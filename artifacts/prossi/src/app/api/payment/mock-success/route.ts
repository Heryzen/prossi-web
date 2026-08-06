import { NextResponse } from "next/server";
import { computeVoucherExpiry, generateVoucherCode, getVoucherProductInfo, sendVoucherEmail } from "@/lib/voucher";
import { sendPaymentConfirmedEmail } from "@/lib/emailTemplates";

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

async function markOrderPaid(order: Record<string, unknown>, now: string) {
  const isNonPhysical = !order.address;
  const history: { status: string; date: string }[] = Array.isArray(order.status_history)
    ? [...(order.status_history as { status: string; date: string }[])]
    : [];
  history.push({ status: "paid", date: now });
  if (isNonPhysical) history.push({ status: "delivered", date: now });

  const patch: Record<string, unknown> = {
    payment_status: "paid",
    internal_status: isNonPhysical ? "delivered" : "paid",
    status: isNonPhysical ? "completed" : "active",
    status_history: history,
  };

  if (isNonPhysical) {
    const voucherCode = generateVoucherCode();
    const items = (order.items as { name: string; qty: number; slug?: string }[]) ?? [];
    const firstSlug = items[0]?.slug;
    const { terms, redeemInstructions, validityDays } = firstSlug
      ? await getVoucherProductInfo(firstSlug)
      : { terms: null, redeemInstructions: null, validityDays: undefined };
    const expiresAt = computeVoucherExpiry(validityDays ?? 90, new Date(now));
    patch.voucher_code = voucherCode;
    patch.voucher_expires_at = expiresAt;

    const email = order.guest_email as string | null;
    if (email) {
      sendVoucherEmail({
        to: email,
        customerName: (order.guest_name as string) ?? "Pelanggan",
        orderNumber: order.order_number as string,
        items,
        voucherCode,
        expiresAt,
        terms,
        redeemInstructions,
      }).catch(() => {});
    }
  }

  await directus(`/items/orders/${order.id}`, { method: "PATCH", body: JSON.stringify(patch) });

  const email = order.guest_email as string | null;
  if (email) {
    sendPaymentConfirmedEmail(email, {
      order_number: order.order_number as string,
      guest_name: (order.guest_name as string) ?? "",
      items: (order.items as { name: string; price: number; qty: number }[]) ?? [],
      total: (order.total as number) ?? 0,
      shipping_courier: (order.shipping_courier as string | null) ?? null,
    }).catch(() => {});
  }
}

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_PAYMENT_MOCK !== "true") {
    return NextResponse.json({ error: "Mock payment not enabled" }, { status: 403 });
  }

  const { order_number } = await req.json().catch(() => ({}));
  if (!order_number) return NextResponse.json({ error: "order_number required" }, { status: 400 });

  try {
    const rows = await directus(
      `/items/orders?filter[order_number][_eq]=${encodeURIComponent(order_number)}&fields=*&limit=1`
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const now = new Date().toISOString();
    await markOrderPaid(order, now);

    // Also mark linked non-physical orders
    const linkedRows = await directus(
      `/items/orders?filter[payment_group_id][_eq]=${encodeURIComponent(order_number)}&fields=*&limit=20`
    ).catch(() => []);
    for (const linked of (linkedRows ?? []) as Record<string, unknown>[]) {
      if (linked.payment_status !== "paid") {
        await markOrderPaid(linked, now);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
