import { NextResponse } from "next/server";
import { createSnapToken, MIDTRANS_CLIENT_KEY } from "@/lib/midtrans";

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
    const { order_number } = await req.json();
    if (!order_number) return NextResponse.json({ error: "order_number wajib diisi" }, { status: 400 });

    const rows = await directus(
      `/items/orders?filter[order_number][_eq]=${encodeURIComponent(order_number)}&limit=1`
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });

    const items = (order.items ?? []).map((i: { name: string; price: number; qty: number }, idx: number) => ({
      id: `item-${idx}`,
      name: i.name.slice(0, 50),
      price: Math.round(i.price),
      quantity: i.qty,
    }));

    if (order.shipping_cost > 0) {
      items.push({ id: "shipping", name: "Ongkos Kirim", price: Math.round(order.shipping_cost), quantity: 1 });
    }

    const snap = await createSnapToken({
      orderId: order.order_number,
      grossAmount: Math.round(order.total),
      customerName: order.guest_name ?? "Prossi Customer",
      customerEmail: order.guest_email ?? "customer@prossi.com",
      customerPhone: order.guest_phone ?? "",
      items,
    });

    await directus(`/items/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({ payment_status: "pending", payment_method: "midtrans" }),
    });

    return NextResponse.json({ snap_token: snap.token, client_key: MIDTRANS_CLIENT_KEY });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
