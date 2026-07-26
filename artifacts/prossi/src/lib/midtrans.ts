import crypto from "crypto";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY ?? "";
const IS_PROD = process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production";
const SNAP_BASE = IS_PROD ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";

export const MIDTRANS_SNAP_JS = IS_PROD
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

function auth() {
  return "Basic " + Buffer.from(SERVER_KEY + ":").toString("base64");
}

export type SnapItem = { id: string; name: string; price: number; quantity: number };

export async function createSnapToken(params: {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: SnapItem[];
}): Promise<{ token: string; redirect_url: string }> {
  if (!SERVER_KEY) throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi.");

  const res = await fetch(`${SNAP_BASE}/snap/v1/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth() },
    body: JSON.stringify({
      transaction_details: { order_id: params.orderId, gross_amount: params.grossAmount },
      customer_details: {
        first_name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone ?? "",
      },
      item_details: params.items,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error_messages?.[0] ?? "Midtrans error");
  return { token: json.token, redirect_url: json.redirect_url };
}

export function verifyMidtransSignature(orderId: string, statusCode: string, grossAmount: string): string {
  return crypto
    .createHash("sha512")
    .update(orderId + statusCode + grossAmount + SERVER_KEY)
    .digest("hex");
}
