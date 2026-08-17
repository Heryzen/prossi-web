import { sendMail } from "./mailer";

const WA = process.env.NEXT_PUBLIC_WA_NUMBER ?? "";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const FOOTER = `<tr><td style="background:#f9f7f4;padding:20px 32px;border-top:1px solid #eee8da"><p style="margin:0;font-size:12px;color:#aaa;line-height:1.6">Ada pertanyaan? Hubungi kami via <a href="https://wa.me/${WA}" style="color:#b59637;text-decoration:none">WhatsApp</a>.<br>© 2026 Prossi Clinic. Jl. Bintaro Utama 3A, Bintaro Jaya Sektor 3.</p></td></tr>`;

function header() {
  return `<tr><td style="background:#11151c;padding:28px 32px 24px"><table cellpadding="0" cellspacing="0"><tr><td style="padding-right:12px"><div style="width:36px;height:36px;background:#b59637;border-radius:50%;text-align:center;line-height:36px"><span style="color:#fff;font-size:18px;font-weight:700">P</span></div></td><td><div style="color:#fff;font-size:18px;font-weight:700">Prossi</div><div style="color:#b59637;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;margin-top:2px">Clinic</div></td></tr></table></td></tr>`;
}

function wrap(body: string) {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f4f1ea;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:40px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06)">${header()}${body}${FOOTER}</table></td></tr></table></body></html>`;
}

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

type OrderBase = { order_number: string; guest_name: string };
type OrderWithItems = OrderBase & { items: { name: string; qty: number; price: number }[]; total: number };

// ── 1. Admin: new order notification ─────────────────────────────────────────
export async function sendNewOrderAdminEmail(order: OrderWithItems & {
  guest_phone: string;
  guest_email?: string | null;
  shipping_courier?: string | null;
  shipping_service?: string | null;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  const itemRows = order.items.map((i) =>
    `<tr><td style="padding:8px 0;font-size:14px;color:#11151c;border-bottom:1px solid #f0f0f0">${i.name} <span style="color:#888">x${i.qty}</span></td><td style="padding:8px 0;font-size:14px;color:#11151c;text-align:right;border-bottom:1px solid #f0f0f0;white-space:nowrap">${rupiah(i.price * i.qty)}</td></tr>`
  ).join("");
  const courierInfo = order.shipping_courier
    ? `Kurir: ${order.shipping_courier.toUpperCase()}${order.shipping_service ? ` ${order.shipping_service.toUpperCase()}` : ""}`
    : "Non-fisik / e-voucher";
  const html = wrap(`<tr><td style="padding:36px 32px 28px">
    <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#11151c">🛒 Pesanan Baru Masuk</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#666">Order <strong>#${order.order_number}</strong> baru saja dibuat dan menunggu pembayaran.</p>
    <div style="background:#f9f7f4;border-radius:10px;padding:16px 20px;margin-bottom:20px">
      <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#b59637;text-transform:uppercase;letter-spacing:.08em">Pelanggan</p>
      <p style="margin:0;font-size:15px;font-weight:700;color:#11151c">${order.guest_name}</p>
      <p style="margin:2px 0 0;font-size:13px;color:#666">${order.guest_phone}${order.guest_email ? ` · ${order.guest_email}` : ""}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#666">${courierInfo}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">${itemRows}</table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:15px;font-weight:700;color:#11151c;padding-top:8px">Total</td>
      <td style="font-size:16px;font-weight:700;color:#b59637;text-align:right;padding-top:8px">${rupiah(order.total)}</td>
    </tr></table>
    <div style="margin-top:24px"><a href="${SITE}/admin/orders/${order.order_number}" style="display:inline-block;background:#b59637;color:#fff;text-decoration:none;border-radius:100px;padding:12px 28px;font-size:14px;font-weight:600">Lihat Detail Pesanan →</a></div>
  </td></tr>`);
  await sendMail(adminEmail, `[Prossi Admin] Pesanan Baru #${order.order_number}`, html);
}

// ── 2. Customer: payment confirmed ───────────────────────────────────────────
export async function sendPaymentConfirmedEmail(to: string, order: OrderWithItems & {
  shipping_courier?: string | null;
}) {
  const hasShipping = !!order.shipping_courier;
  const itemRows = order.items.map((i) =>
    `<tr><td style="padding:8px 0;font-size:14px;color:#11151c;border-bottom:1px solid #f0f0f0">${i.name} <span style="color:#888">x${i.qty}</span></td><td style="padding:8px 0;font-size:14px;color:#11151c;text-align:right;border-bottom:1px solid #f0f0f0">${rupiah(i.price * i.qty)}</td></tr>`
  ).join("");
  const nextStep = hasShipping
    ? "Pesanan kamu sedang kami proses dan akan segera dikirim."
    : "E-voucher kamu sedang kami proses.";
  const html = wrap(`<tr><td style="padding:36px 32px 28px">
    <div style="width:48px;height:48px;background:#edf7f2;border-radius:50%;text-align:center;line-height:48px;margin-bottom:16px;font-size:22px">✓</div>
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#11151c">Pembayaran Dikonfirmasi</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.6">Halo <strong>${order.guest_name}</strong>, pembayaran pesanan <strong>#${order.order_number}</strong> sudah kami terima. ${nextStep}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">${itemRows}</table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:15px;font-weight:700;color:#11151c;padding-top:8px">Total</td>
      <td style="font-size:16px;font-weight:700;color:#b59637;text-align:right;padding-top:8px">${rupiah(order.total)}</td>
    </tr></table>
    <div style="margin-top:24px"><a href="${SITE}/shop/orders/${order.order_number}" style="display:inline-block;background:#b59637;color:#fff;text-decoration:none;border-radius:100px;padding:12px 28px;font-size:14px;font-weight:600">Lacak Pesanan →</a></div>
  </td></tr>`);
  await sendMail(to, `Pembayaran Dikonfirmasi — #${order.order_number}`, html);
}

// ── 3. Customer: order cancelled ─────────────────────────────────────────────
export async function sendOrderCancelledEmail(to: string, order: OrderBase) {
  const html = wrap(`<tr><td style="padding:36px 32px 28px">
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#11151c">Pesanan Dibatalkan</h1>
    <p style="margin:0 0 16px;font-size:14px;color:#666;line-height:1.6">Halo <strong>${order.guest_name}</strong>, pesanan <strong>#${order.order_number}</strong> telah dibatalkan oleh tim kami.</p>
    <p style="margin:0;font-size:14px;color:#666;line-height:1.6">Jika ada pertanyaan, jangan ragu untuk menghubungi kami melalui WhatsApp.</p>
  </td></tr>`);
  await sendMail(to, `Pesanan #${order.order_number} Dibatalkan`, html);
}

// ── 4. Customer: order shipped ───────────────────────────────────────────────
export async function sendOrderShippedEmail(to: string, order: OrderBase & {
  shipping_courier: string;
  shipping_service?: string | null;
  tracking_number: string;
}) {
  const courierLabel = order.shipping_courier.toUpperCase();
  const html = wrap(`<tr><td style="padding:36px 32px 28px">
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#11151c">Paket Sedang Dikirim 🚚</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.6">Halo <strong>${order.guest_name}</strong>, pesanan <strong>#${order.order_number}</strong> sudah diserahkan ke kurir.</p>
    <div style="background:#f9f7f4;border:2px solid #e8e0d0;border-radius:12px;padding:24px;margin-bottom:24px">
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#b59637;margin-bottom:4px">Kurir</div>
        <div style="font-size:15px;font-weight:700;color:#11151c">${courierLabel}${order.shipping_service ? ` · ${order.shipping_service.toUpperCase()}` : ""}</div>
      </div>
      <div>
        <div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#b59637;margin-bottom:4px">Nomor Resi</div>
        <div style="font-size:24px;font-weight:700;color:#11151c;font-family:Courier,monospace;letter-spacing:3px">${order.tracking_number}</div>
      </div>
    </div>
    <a href="${SITE}/shop/orders/${order.order_number}" style="display:inline-block;background:#b59637;color:#fff;text-decoration:none;border-radius:100px;padding:12px 28px;font-size:14px;font-weight:600">Lacak Paket →</a>
  </td></tr>`);
  await sendMail(to, `Pesanan #${order.order_number} Sedang Dikirim`, html);
}

// ── 5. Customer: order delivered ─────────────────────────────────────────────
export async function sendOrderDeliveredEmail(to: string, order: OrderBase) {
  const html = wrap(`<tr><td style="padding:36px 32px 28px">
    <div style="width:48px;height:48px;background:#edf7f2;border-radius:50%;text-align:center;line-height:48px;margin-bottom:16px;font-size:22px">✓</div>
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#11151c">Paket Berhasil Diterima!</h1>
    <p style="margin:0 0 16px;font-size:14px;color:#666;line-height:1.6">Halo <strong>${order.guest_name}</strong>, pesanan <strong>#${order.order_number}</strong> telah diterima. Terima kasih sudah berbelanja di Prossi Clinic! 💛</p>
    <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.6">Kami harap produk yang kamu terima sesuai ekspektasi. Jangan lupa untuk rutin merawat diri ya!</p>
    <a href="${SITE}/shop" style="display:inline-block;background:#b59637;color:#fff;text-decoration:none;border-radius:100px;padding:12px 28px;font-size:14px;font-weight:600">Belanja Lagi →</a>
  </td></tr>`);
  await sendMail(to, `Pesanan #${order.order_number} Telah Diterima`, html);
}
