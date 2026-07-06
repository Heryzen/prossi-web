import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "").replace(/^62/, "");
  return `+62${digits}`;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `PROSSI-${code}`;
}

async function directus(path: string, init?: RequestInit) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      ...init?.headers,
    },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.errors?.[0]?.message ?? res.statusText);
  return json.data;
}

export async function POST(req: Request) {
  try {
    const { full_name, email, phone } = await req.json();
    if (!full_name || !email || !phone) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const code = generateCode();

    // sudah ada member dengan nomor ini?
    const existing = await directus(
      `/items/members?filter[phone][_eq]=${encodeURIComponent(normalized)}&fields=id,status&limit=1`
    );

    if (existing.length > 0) {
      if (existing[0].status === "active") {
        return NextResponse.json({ error: "Nomor sudah terdaftar" }, { status: 409 });
      }
      // pending: perbarui data + kode baru
      await directus(`/items/members/${existing[0].id}`, {
        method: "PATCH",
        body: JSON.stringify({ full_name, email, otp_code: code }),
      });
    } else {
      await directus("/items/members", {
        method: "POST",
        body: JSON.stringify({
          full_name,
          email,
          phone: normalized,
          otp_code: code,
          status: "pending",
          verified_via: "whatsapp",
        }),
      });
    }

    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? "628123456789";
    const text = encodeURIComponent(`Kode verifikasi saya: ${code}`);
    return NextResponse.json({
      code,
      waLink: `https://wa.me/${waNumber}?text=${text}`,
      phone: normalized,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
