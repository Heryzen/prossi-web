import { NextResponse } from "next/server";
import { createBiteshipOrder } from "@/lib/biteship";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

function verifyAdmin(req: Request): boolean {
  return !!process.env.ADMIN_SECRET && req.headers.get("x-admin-token") === process.env.ADMIN_SECRET;
}

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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ order_number: string }> }
) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_number } = await params;

  try {
    const rows = await directus(
      `/items/orders?filter[order_number][_eq]=${encodeURIComponent(order_number)}&limit=1`
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });

    if (order.internal_status !== "ready_to_ship") {
      return NextResponse.json({ error: "Order belum ready_to_ship" }, { status: 400 });
    }

    const originPostal = process.env.BITESHIP_ORIGIN_POSTAL_CODE ?? "12190";
    const originName = process.env.BITESHIP_ORIGIN_CONTACT_NAME ?? "Prossi Clinic";
    const originPhone =
      process.env.BITESHIP_ORIGIN_CONTACT_PHONE ?? process.env.NEXT_PUBLIC_WA_NUMBER ?? "6221000000";
    const originAddress = process.env.BITESHIP_ORIGIN_ADDRESS ?? "Jl. Klinik Prossi";

    const addr = order.address ?? {};
    const destAddress =
      [addr.detail, addr.district, addr.city, addr.province].filter(Boolean).join(", ") || addr.detail;

    const biteshipOrder = await createBiteshipOrder({
      referenceId: order.order_number,
      originAddress,
      originPostalCode: originPostal,
      originContactName: originName,
      originContactPhone: originPhone,
      destinationContactName: addr.name ?? order.guest_name ?? "-",
      destinationContactPhone: addr.phone ?? order.guest_phone ?? "-",
      destinationAddress: destAddress,
      destinationPostalCode: addr.postal ?? "00000",
      courierCode: order.shipping_courier,
      courierType: order.shipping_service,
      items: (order.items ?? []).map((i: { name: string; price: number; qty: number }) => ({
        name: i.name,
        value: i.price,
        qty: i.qty,
      })),
    });

    const waybill = biteshipOrder.courier?.waybill_id ?? biteshipOrder.waybill_id ?? "";
    const trackingLink = biteshipOrder.courier?.link ?? "";

    await directus(`/items/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        internal_status: "shipped",
        status: "shipped",
        biteship_order_id: biteshipOrder.id,
        tracking_number: waybill,
        shipping_status: biteshipOrder.status ?? "confirmed",
      }),
    });

    const phone = order.guest_phone ?? addr.phone;
    if (phone) {
      const courierLabel = (order.shipping_courier ?? "kurir").toUpperCase();
      sendWhatsAppMessage(
        phone,
        `Halo ${order.guest_name ?? addr.name}, pesanan #${order.order_number} sudah dikirim! 🚚\n\nKurir: ${courierLabel}\nNo. Resi: ${waybill}${trackingLink ? `\nLacak: ${trackingLink}` : ""}\n\nTerima kasih sudah belanja di Prossi Clinic 💛`
      ).catch(() => {});
    }

    return NextResponse.json({ ok: true, waybill_id: waybill, biteship_order_id: biteshipOrder.id });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
