import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;
const SHIPPING_KEY = process.env.SHIPPING_API_KEY;

function verifyAdmin(req: Request): boolean {
  if (!process.env.ADMIN_SECRET) return false;
  const headerToken = req.headers.get("x-admin-token");
  if (headerToken === process.env.ADMIN_SECRET) return true;
  const url = new URL(req.url);
  return url.searchParams.get("token") === process.env.ADMIN_SECRET;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ order_number: string }> }
) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_number } = await params;

  try {
    // 1. Get biteship_order_id from Directus
    const dirRes = await fetch(
      `${DIRECTUS_URL}/items/orders?filter[order_number][_eq]=${encodeURIComponent(order_number)}&fields=biteship_order_id&limit=1`,
      { headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }, cache: "no-store" }
    );
    const dirJson = await dirRes.json();
    const order = dirJson?.data?.[0];
    if (!order?.biteship_order_id) {
      return NextResponse.json({ error: "Belum ada data pengiriman untuk order ini." }, { status: 404 });
    }

    // 2. Fetch label from shipping provider
    const labelRes = await fetch(
      `https://api.biteship.com/v1/orders/${order.biteship_order_id}/label`,
      { headers: { Authorization: `${SHIPPING_KEY}` }, cache: "no-store" }
    );
    const labelJson = await labelRes.json();
    const fileUrl = labelJson?.shipping_label?.file_url;
    if (!fileUrl) {
      return NextResponse.json({ error: "Label belum tersedia, coba beberapa saat lagi." }, { status: 503 });
    }

    // 3. Redirect to the PDF label
    return NextResponse.redirect(fileUrl, { status: 302 });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
