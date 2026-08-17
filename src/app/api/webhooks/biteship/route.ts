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
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ received: true });
  }

  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ received: true });
  }

  const webhookToken = process.env.SHIPPING_WEBHOOK_TOKEN;
  if (webhookToken) {
    const incoming = req.headers.get("x-biteship-token");
    if (incoming !== webhookToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const event = body.event as string | undefined;
  const biteshipOrderId = body.order_id as string | undefined;
  if (!biteshipOrderId) return NextResponse.json({ received: true });

  try {
    const rows = await directus(
      `/items/orders?filter[biteship_order_id][_eq]=${encodeURIComponent(biteshipOrderId)}&limit=1`
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ received: true, matched: false, biteship_order_id: biteshipOrderId });

    const patch: Record<string, unknown> = {};

    switch (event) {
      case "order.status": {
        const status = body.status as string | undefined;
        if (status) {
          patch.shipping_status = status;
          const existing: { status: string; date: string }[] = Array.isArray(order.status_history)
            ? order.status_history : [];
          patch.status_history = [
            ...existing,
            { status: `shipping_${status}`, date: new Date().toISOString() },
          ];
          if (status === "picked" && order.internal_status === "pickup_requested") {
            patch.internal_status = "shipped";
            patch.status = "shipped";
            patch.status_history = [
              ...existing,
              { status: `shipping_${status}`, date: new Date().toISOString() },
              { status: "shipped", date: new Date().toISOString() },
            ];
          } else if (status === "delivered") {
            patch.internal_status = "delivered";
            patch.status = "completed";
            patch.status_history = [
              ...existing,
              { status: `shipping_${status}`, date: new Date().toISOString() },
              { status: "delivered", date: new Date().toISOString() },
            ];
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

    return NextResponse.json({ received: true, matched: true, order_number: order.order_number, patch: Object.keys(patch) });
  } catch (e) {
    return NextResponse.json({ received: true, error: String(e instanceof Error ? e.message : e) });
  }
}
