import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

/** Health-check sederhana — Fonnte tidak memerlukan handshake khusus seperti Meta. */
export async function GET() {
  return NextResponse.json({ ok: true });
}

/**
 * Pesan masuk dari Fonnte (https://docs.fonnte.com/webhook-reply-message/).
 * Reverse OTP: user mengirim "Kode verifikasi saya: PROSSI-XXXXX" ke nomor klinik.
 * Cocokkan kode + nomor pengirim → aktivasi member.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text: string = body?.message ?? "";
    const sender: string | undefined = body?.sender;

    const match = sender ? text.match(/PROSSI-[A-Z2-9]{5}/i) : null;
    if (match && sender) {
      const code = match[0].toUpperCase();
      const senderPhone = `+${sender.replace(/\D/g, "")}`;

      const res = await fetch(
        `${DIRECTUS_URL}/items/members?filter[otp_code][_eq]=${code}&filter[phone][_eq]=${encodeURIComponent(senderPhone)}&filter[status][_eq]=pending&fields=id&limit=1`,
        { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
      );
      const found = (await res.json())?.data?.[0];
      if (found) {
        await fetch(`${DIRECTUS_URL}/items/members/${found.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({
            status: "active",
            verified_at: new Date().toISOString(),
            otp_code: null,
          }),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
