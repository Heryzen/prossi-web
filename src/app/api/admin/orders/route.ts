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

export async function GET(req: Request) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("order_number");
  const filterStatus = searchParams.get("status");

  try {
    if (orderNumber) {
      const rows = await directus(
        `/items/orders?filter[order_number][_eq]=${encodeURIComponent(orderNumber)}&limit=1`
      );
      return NextResponse.json({ order: rows?.[0] ?? null });
    }
    let path = `/items/orders?sort=-date_created&limit=200`;
    if (filterStatus && filterStatus !== "all") {
      path += `&filter[internal_status][_eq]=${encodeURIComponent(filterStatus)}`;
    }
    const orders = await directus(path);
    return NextResponse.json({ orders });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
