import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

const ALLOWED_STATUS = ["processing", "packaging", "ready_to_ship", "cancelled"];

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
  const { internal_status } = await req.json().catch(() => ({}));

  if (!internal_status || !ALLOWED_STATUS.includes(internal_status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  try {
    const rows = await directus(
      `/items/orders?filter[order_number][_eq]=${encodeURIComponent(order_number)}&limit=1`
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });

    if (["shipped", "delivered", "cancelled"].includes(order.internal_status ?? "")) {
      return NextResponse.json({ error: "Status sudah final" }, { status: 400 });
    }

    await directus(`/items/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({ internal_status }),
    });

    return NextResponse.json({ ok: true, internal_status });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
