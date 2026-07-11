import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

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
    const { full_name, phone, treatment, clinic, member_id } = await req.json();

    if (!full_name || !phone || !treatment || !clinic) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    await directus("/items/reservations", {
      method: "POST",
      body: JSON.stringify({
        member: member_id ?? null,
        guest_name: full_name,
        guest_phone: phone,
        notes: `Kategori Treatment: ${treatment}\nKlinik Pilihan: ${clinic}`,
        status: "new",
      }),
    });

    sendWhatsAppMessage(
      phone,
      `Halo ${full_name}, terima kasih sudah mengajukan reservasi di Prossi Clinic!\n\nTreatment: ${treatment}\nKlinik: ${clinic}\n\nTim kami akan segera menghubungi Anda untuk konfirmasi jadwal.`
    ).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
