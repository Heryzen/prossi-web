import { NextResponse } from "next/server";
import { createXenditPayment } from "@/lib/xendit";

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
    const { order_number, method } = await req.json();
    if (!order_number || !method) {
      return NextResponse.json({ error: "order_number dan method wajib diisi" }, { status: 400 });
    }

    const rows = await directus(`/items/orders?filter[order_number][_eq]=${encodeURIComponent(order_number)}&limit=1`);
    const order = rows?.[0];
    if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });

    const display = await createXenditPayment({
      referenceId: order_number,
      amount: order.total,
      method,
      customerName: order.guest_name ?? "Prossi Customer",
    });

    await directus(`/items/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({ payment_method: method, xendit_reference_id: order_number, payment_status: "pending" }),
    });

    return NextResponse.json({ display });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
