import { NextResponse } from "next/server";
import { verifyMidtransSignature } from "@/lib/midtrans";
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
      const hasPhysical = !!order.address;

      const now = new Date().toISOString();
      const history: { status: string; date: string }[] = Array.isArray(order.status_history) ? order.status_history : [];
      history.push({ status: "paid", date: now });
      if (!hasPhysical) history.push({ status: "delivered", date: now });

      const patch: Record<string, unknown> = {
        payment_status: "paid",
        internal_status: hasPhysical ? "processing" : "delivered",
        status: hasPhysical ? "processing" : "completed",
        status_history: history,
      };

      if (!hasPhysical) {
        const voucherCode = generateVoucherCode();
        const firstItem = (order.items ?? [])[0];
        const { terms, redeemInstructions, validityDays } = firstItem?.slug
          ? await getVoucherProductInfo(firstItem.slug)
          : { terms: null, redeemInstructions: null, validityDays: undefined };
        const expiresAt = computeVoucherExpiry(validityDays ?? 90, new Date(now));
        patch.voucher_code = voucherCode;
        patch.voucher_expires_at = expiresAt;

        const email = order.guest_email;
        if (email) {
          sendVoucherEmail({
            to: email,
            customerName: order.guest_name ?? "Pelanggan",
            orderNumber: order.order_number,
            items: order.items ?? [],
            voucherCode,
            expiresAt,
            terms,
            redeemInstructions,
          }).catch(() => {});
        }
      }

      await directus(`/items/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });

      // Mark linked non-physical orders paid too
      if (order.payment_group_id) {
        const linkedRows = await directus(
          `/items/orders?filter[payment_group_id][_eq]=${encodeURIComponent(order.payment_group_id)}&fields=*&limit=20`
        ).catch(() => []);
        for (const linked of linkedRows ?? []) {
          if (linked.payment_status !== "paid") {
            const lHistory = Array.isArray(linked.status_history) ? linked.status_history : [];
            lHistory.push({ status: "paid", date: now });
            await directus(`/items/orders/${linked.id}`, {
              method: "PATCH",
              body: JSON.stringify({ payment_status: "paid", internal_status: "processing", status: "processing", status_history: lHistory }),
            }).catch(() => {});
          }
        }
      }

      const email = order.guest_email;
      if (email) {
        sendPaymentConfirmedEmail(email, {
          order_number: order.order_number,
          guest_name: order.guest_name ?? "",
          items: order.items ?? [],
          total: order.total ?? 0,
          shipping_courier: order.shipping_courier ?? null,
        }).catch(() => {});
      }
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
