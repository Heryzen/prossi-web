import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;
const VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN ?? "prossi-wa-webhook-verify";

/** Verifikasi webhook oleh Meta saat pertama kali didaftarkan */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (
    searchParams.get("hub.mode") === "subscribe" &&
    searchParams.get("hub.verify_token") === VERIFY_TOKEN
  ) {
    return new Response(searchParams.get("hub.challenge") ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

/**
 * Pesan masuk dari WA Cloud API.
 * Reverse OTP: user mengirim "Kode verifikasi saya: PROSSI-XXXXX" ke nomor klinik.
 * Cocokkan kode + nomor pengirim → aktivasi member.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: { from: string; text?: { body: string } }[] =
      body?.entry?.flatMap((e: { changes?: { value?: { messages?: unknown[] } }[] }) =>
        e.changes?.flatMap((c) => c.value?.messages ?? []) ?? []
      ) ?? [];

    for (const msg of messages) {
      const text = msg.text?.body ?? "";
      const match = text.match(/PROSSI-[A-Z2-9]{5}/i);
      if (!match) continue;

      const code = match[0].toUpperCase();
      const senderPhone = `+${msg.from.replace(/\D/g, "")}`; // Meta kirim tanpa '+'

      const res = await fetch(
        `${DIRECTUS_URL}/items/members?filter[otp_code][_eq]=${code}&filter[phone][_eq]=${encodeURIComponent(senderPhone)}&filter[status][_eq]=pending&fields=id&limit=1`,
        { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
      );
      const found = (await res.json())?.data?.[0];
      if (!found) continue;

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

    // Meta selalu butuh 200 agar tidak retry
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
