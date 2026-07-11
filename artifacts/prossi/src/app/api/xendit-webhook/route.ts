import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;
const WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN;

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

/** Webhook Xendit — update status pembayaran order otomatis saat pembayaran masuk */
export async function POST(req: Request) {
  const callbackToken = req.headers.get("x-callback-token");
  if (WEBHOOK_TOKEN && callbackToken !== WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "Invalid callback token" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const referenceId: string | undefined = body?.reference_id ?? body?.data?.reference_id;
    const status: string | undefined = body?.status ?? body?.data?.status;

    if (!referenceId) return NextResponse.json({ received: true });

    const rows = await directus(`/items/orders?filter[order_number][_eq]=${encodeURIComponent(referenceId)}&limit=1`);
    const order = rows?.[0];
    if (!order) return NextResponse.json({ received: true });

    if (status === "PAID" || status === "SUCCEEDED" || status === "COMPLETED") {
      await directus(`/items/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ payment_status: "paid", status: "processing" }),
      });
      sendWhatsAppMessage(
        order.guest_phone,
        `Pembayaran untuk pesanan #${order.order_number} berhasil diterima ✅. Pesanan kamu sedang kami siapkan untuk dikirim. Terima kasih!`
      ).catch(() => {});
    } else if (status === "FAILED" || status === "EXPIRED") {
      await directus(`/items/orders/${order.id}`, { method: "PATCH", body: JSON.stringify({ payment_status: "failed" }) });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
