import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;
const CODE_TTL_MS = 5 * 60 * 1000;

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "").replace(/^62/, "");
  return `+62${digits}`;
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
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
    const { full_name, email, phone, password } = await req.json();
    if (!full_name || !email || !phone || !password) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

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
        body: JSON.stringify({ full_name, email, password, otp_code: code, otp_expires_at: expiresAt }),
      });
    } else {
      // email dipakai member lain?
      const emailTaken = await directus(
        `/items/members?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`
      );
      if (emailTaken.length > 0) {
        return NextResponse.json({ error: "Email sudah terdaftar. Gunakan email lain atau masuk dengan akun tersebut." }, { status: 409 });
      }

      await directus("/items/members", {
        method: "POST",
        body: JSON.stringify({
          full_name,
          email,
          phone: normalized,
          password,
          otp_code: code,
          otp_expires_at: expiresAt,
          status: "pending",
          verified_via: "whatsapp",
        }),
      });
    }

    await sendWhatsAppMessage(
      normalized,
      `Kode verifikasi Prossi Clinic kamu: ${code}. Berlaku 5 menit, jangan bagikan ke siapa pun.`
    );

    return NextResponse.json({ phone: normalized, expiresInSeconds: CODE_TTL_MS / 1000 });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
