/**
 * Kirim pesan WhatsApp keluar (order confirmation, payment success, shipping update)
 * via WhatsApp Cloud API. Butuh WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID.
 * Kalau belum dikonfigurasi, pesan di-log ke console (aman untuk development).
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.log(`[WA notif - belum dikonfigurasi] to=${to}: ${text}`);
    return;
  }

  try {
    await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/\D/g, ""),
        type: "text",
        text: { body: text },
      }),
    });
  } catch (e) {
    console.error("Gagal kirim WA notification:", e);
  }
}
