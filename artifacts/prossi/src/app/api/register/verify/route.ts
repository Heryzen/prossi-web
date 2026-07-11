import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

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
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json({ error: "Kode wajib diisi" }, { status: 400 });
    }

    const rows = await directus(
      `/items/members?filter[phone][_eq]=${encodeURIComponent(phone)}&filter[status][_eq]=pending&fields=id,full_name,email,phone,otp_code,otp_expires_at&limit=1`
    );
    const member = rows?.[0];

    if (!member || member.otp_code !== String(code)) {
      return NextResponse.json({ error: "Kode salah" }, { status: 400 });
    }
    if (!member.otp_expires_at || new Date(member.otp_expires_at) < new Date()) {
      return NextResponse.json({ error: "Kode sudah kadaluarsa, minta kode baru" }, { status: 400 });
    }

    await directus(`/items/members/${member.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "active",
        verified_at: new Date().toISOString(),
        otp_code: null,
        otp_expires_at: null,
      }),
    });

    return NextResponse.json({
      id: member.id,
      full_name: member.full_name,
      email: member.email,
      phone: member.phone,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
