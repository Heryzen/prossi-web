import { NextResponse } from "next/server";

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ order_number: string }> }
) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_number } = await params;

  try {
    const rows = await directus(
      `/items/orders?filter[order_number][_eq]=${encodeURIComponent(order_number)}&fields=id,voucher_code,voucher_used&limit=1`
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    if (!order.voucher_code) return NextResponse.json({ error: "Order ini tidak memiliki voucher" }, { status: 400 });
    if (order.voucher_used) return NextResponse.json({ error: "Voucher sudah ditandai digunakan sebelumnya" }, { status: 400 });

    const voucher_used_at = new Date().toISOString();
    await directus(`/items/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({ voucher_used: true, voucher_used_at }),
    });

    return NextResponse.json({ ok: true, voucher_used_at });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
