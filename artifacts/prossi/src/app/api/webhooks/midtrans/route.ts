import { NextResponse } from "next/server";
import { verifyMidtransSignature } from "@/lib/midtrans";
import { generateVoucherCode, sendVoucherEmail } from "@/lib/voucher";

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
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ received: true });
  }

  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

  const expected = verifyMidtransSignature(order_id, status_code, gross_amount);
  if (signature_key !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const isPaid =
    (transaction_status === "capture" && fraud_status === "accept") ||
    transaction_status === "settlement";
  const isFailed = ["deny", "cancel", "expire"].includes(transaction_status);

  try {
    const rows = await directus(
      `/items/orders?filter[order_number][_eq]=${encodeURIComponent(order_id)}&limit=1`
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ received: true });

    if (isPaid) {
      const hasPhysical = (order.items ?? []).some(
        (i: { product_type?: string }) => i.product_type === "physical"
      );

      const patch: Record<string, unknown> = {
        payment_status: "paid",
        internal_status: hasPhysical ? "processing" : "delivered",
        status: hasPhysical ? "processing" : "completed",
      };

      if (!hasPhysical) {
        const voucherCode = generateVoucherCode();
        patch.voucher_code = voucherCode;

        const email = order.guest_email;
        if (email) {
          sendVoucherEmail({
            to: email,
            customerName: order.guest_name ?? "Pelanggan",
            orderNumber: order.order_number,
            items: order.items ?? [],
            voucherCode,
          }).catch(() => {});
        }
      }

      await directus(`/items/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    } else if (isFailed) {
      await directus(`/items/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ payment_status: "failed" }),
      });
    }
  } catch {
    // Always 200 so Midtrans doesn't retry
  }

  return NextResponse.json({ received: true });
}
