import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "").replace(/^62/, "");
  return `+62${digits}`;
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

    // sudah ada member dengan nomor ini?
    const existing = await directus(
      `/items/members?filter[phone][_eq]=${encodeURIComponent(normalized)}&fields=id,status&limit=1`
    );

    let memberId: string;
    if (existing.length > 0) {
      if (existing[0].status === "active") {
        return NextResponse.json({ error: "Nomor sudah terdaftar" }, { status: 409 });
      }
      memberId = existing[0].id;
      await directus(`/items/members/${memberId}`, {
        method: "PATCH",
        body: JSON.stringify({ full_name, email, password, status: "active" }),
      });
    } else {
      // email dipakai member lain?
      const emailTaken = await directus(
        `/items/members?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`
      );
      if (emailTaken.length > 0) {
        return NextResponse.json({ error: "Email sudah terdaftar. Gunakan email lain atau masuk dengan akun tersebut." }, { status: 409 });
      }

      const created = await directus("/items/members", {
        method: "POST",
        body: JSON.stringify({
          full_name,
          email,
          phone: normalized,
          password,
          status: "active",
        }),
      });
      memberId = created.id;
    }

    return NextResponse.json({
      id: memberId,
      full_name,
      email,
      phone: normalized,
      waNumber: WA_NUMBER,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
