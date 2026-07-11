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

  // Fonnte expects local format ("82xxx") + countryCode separately, not "62xxx" + countryCode=62
  // (sending both leads to a double-prefixed / invalid target).
  const localTarget = to.replace(/\D/g, "").replace(/^62/, "");

  try {
    const form = new FormData();
    form.append("target", localTarget);
    form.append("message", text);
    form.append("countryCode", "62");

    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: token },
      body: form,
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || json?.status === false) {
      console.error("Gagal kirim WA notification (Fonnte):", json ?? res.statusText);
    }
  } catch (e) {
    console.error("Gagal kirim WA notification:", e);
  }
}
