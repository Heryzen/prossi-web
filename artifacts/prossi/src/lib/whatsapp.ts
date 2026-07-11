/**
 * Kirim pesan WhatsApp keluar (order confirmation, payment success, shipping update)
 * via Fonnte (https://docs.fonnte.com/api-send-message/). Butuh FONNTE_TOKEN.
 * Kalau belum dikonfigurasi, pesan di-log ke console (aman untuk development).
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    console.log(`[WA notif - belum dikonfigurasi] to=${to}: ${text}`);
    return;
  }

  try {
    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        target: to.replace(/\D/g, ""),
        message: text,
        countryCode: "62",
      }),
    });
  } catch (e) {
    console.error("Gagal kirim WA notification:", e);
  }
}
