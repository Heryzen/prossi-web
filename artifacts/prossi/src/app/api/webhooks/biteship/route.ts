import { NextResponse } from "next/server";

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
  const webhookToken = process.env.BITESHIP_WEBHOOK_TOKEN;
  if (webhookToken) {
    const incoming = req.headers.get("x-biteship-token");
    if (incoming !== webhookToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ received: true });
  }

  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ received: true });
  }

  const event = body.event as string | undefined;
  const biteshipOrderId = body.order_id as string | undefined;
  if (!biteshipOrderId) return NextResponse.json({ received: true });

  try {
    const rows = await directus(
      `/items/orders?filter[biteship_order_id][_eq]=${encodeURIComponent(biteshipOrderId)}&limit=1`
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ received: true });

    const patch: Record<string, unknown> = {};

    switch (event) {
      case "order.status": {
        const status = body.status as string | undefined;
        if (status) {
          patch.shipping_status = status;
          if (status === "delivered") {
            patch.internal_status = "delivered";
            patch.status = "completed";
          }
        }
        const waybill = body.courier_waybill_id as string | undefined;
        if (waybill && !order.tracking_number) patch.tracking_number = waybill;
        break;
      }

      case "order.waybill_id": {
        const waybill = body.courier_waybill_id as string | undefined;
        if (waybill) patch.tracking_number = waybill;
        break;
      }

      case "order.price": {
        const price = body.price as number | undefined;
        if (price != null) patch.shipping_cost = price;
        break;
      }

      default:
        return NextResponse.json({ received: true });
    }

    if (Object.keys(patch).length > 0) {
      await directus(`/items/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
