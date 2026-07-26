import crypto from "crypto";
import { sendMail } from "./mailer";

export function generateVoucherCode(): string {
  const part = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `PROSSI-${part()}-${part()}`;
}

export async function sendVoucherEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; qty: number }[];
  voucherCode: string;
}) {
  const itemList = params.items
    .map((i) => `<li style="margin:4px 0">${i.name}${i.qty > 1 ? ` x${i.qty}` : ""}</li>`)
    .join("");

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
      </div>
      <p style="color:#889bbf;font-size:13px;margin:0">Ada pertanyaan? Hubungi kami di <a href="https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}" style="color:#b59637">WhatsApp</a>.</p>
    </div>`
  );
}
