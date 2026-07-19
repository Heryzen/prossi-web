import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

async function directus(path: string, init?: RequestInit) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}`, ...init?.headers },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.errors?.[0]?.message ?? res.statusText);
  return json.data;
}

export async function POST(req: Request) {
  try {
    const { full_name, phone, treatment, clinic, location_id, member_id, wa_number } = await req.json();

    if (!full_name || !phone || !treatment || !clinic) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    await directus("/items/reservations", {
      method: "POST",
      body: JSON.stringify({
        member: member_id ?? null,
        location: location_id ?? null,
        wa_number: wa_number ?? null,
        guest_name: full_name,
        guest_phone: phone,
        notes: `Kategori Treatment: ${treatment}\nKlinik Pilihan: ${clinic}`,
        status: "new",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
