import crypto from "crypto";
import { sendMail } from "./mailer";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

export const DEFAULT_VOUCHER_VALIDITY_DAYS = 90;

export function generateVoucherCode(): string {
  const part = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `PROSSI-${part()}-${part()}`;
}

// Voucher terms/redeem-instructions/validity live on the product that was
// purchased. An order can only contain items of one type (physical vs
// voucher — the checkout splits mixed carts into separate orders), so the
// first item's product is a representative source for this order's voucher.
export async function getVoucherProductInfo(slug: string): Promise<{
  terms: string | null;
  redeemInstructions: string | null;
  validityDays: number;
}> {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/products?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=voucher_terms,voucher_redeem_instructions,voucher_validity_days&limit=1`,
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
    );
    const json = await res.json();
    const p = json?.data?.[0];
    return {
      terms: p?.voucher_terms ?? null,
      redeemInstructions: p?.voucher_redeem_instructions ?? null,
      validityDays: p?.voucher_validity_days ?? DEFAULT_VOUCHER_VALIDITY_DAYS,
    };
  } catch {
    return { terms: null, redeemInstructions: null, validityDays: DEFAULT_VOUCHER_VALIDITY_DAYS };
  }
}

export function computeVoucherExpiry(validityDays: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + validityDays);
  return d.toISOString();
}

export async function sendVoucherEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; qty: number }[];
  voucherCode: string;
  expiresAt: string;
  terms?: string | null;
  redeemInstructions?: string | null;
}) {
  const itemList = params.items
    .map((i) => `<li style="margin:4px 0">${i.name}${i.qty > 1 ? ` x${i.qty}` : ""}</li>`)
    .join("");

  const expiryLabel = new Date(params.expiresAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const extraSections = [
    params.redeemInstructions
      ? `<div style="margin:0 0 24px">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#889bbf;text-transform:uppercase;letter-spacing:.05em">Cara Redeem</p>
          <p style="color:#11151c;font-size:14px;margin:0;white-space:pre-line">${params.redeemInstructions}</p>
        </div>`
      : "",
    params.terms
      ? `<div style="margin:0 0 24px">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#889bbf;text-transform:uppercase;letter-spacing:.05em">Syarat &amp; Ketentuan</p>
          <p style="color:#555;font-size:13px;margin:0;white-space:pre-line">${params.terms}</p>
        </div>`
      : "",
  ].join("");

  await sendMail(
    params.to,
    `Voucher Pesanan #${params.orderNumber} — Prossi Clinic`,
    `<div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
      <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#b59637;letter-spacing:.06em;text-transform:uppercase">Prossi Clinic</p>
      <h2 style="color:#11151c;font-size:22px;margin:0 0 4px;font-weight:700">Terima kasih, ${params.customerName.split(" ")[0]}!</h2>
      <p style="color:#555;font-size:14px;margin:0 0 24px">Pembayaran pesanan <strong>#${params.orderNumber}</strong> telah dikonfirmasi.</p>
      <div style="background:#f9f7f4;border-radius:12px;padding:20px 24px;margin:0 0 24px">
        <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:#889bbf;text-transform:uppercase;letter-spacing:.05em">Item Pesanan</p>
        <ul style="margin:0;padding-left:20px;color:#11151c;font-size:14px">${itemList}</ul>
      </div>
      <div style="background:#fff;border:2px dashed #b59637;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px">
        <p style="margin:0 0 8px;font-size:12px;color:#889bbf;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Kode Voucher Kamu</p>
        <span style="font-size:28px;font-weight:700;letter-spacing:4px;color:#b59637;font-family:monospace">${params.voucherCode}</span>
        <p style="margin:10px 0 0;font-size:12px;color:#889bbf">Tunjukkan kode ini saat melakukan perawatan di klinik</p>
        <p style="margin:10px 0 0;font-size:12px;color:#a8312a;font-weight:600">Berlaku sampai ${expiryLabel}</p>
      </div>
      ${extraSections}
      <p style="color:#889bbf;font-size:13px;margin:0">Ada pertanyaan? Hubungi kami di <a href="https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}" style="color:#b59637">WhatsApp</a>.</p>
    </div>`
  );
}
