export type PaymentDisplay =
  | { kind: "virtual_account"; bankName: string; accountNumber: string }
  | { kind: "qr"; qrString: string }
  | { kind: "redirect"; url: string }
  | { kind: "unavailable"; message: string };

const VA_CHANNELS: Record<string, string> = {
  "Virtual Account BCA": "BCA",
  "Virtual Account Mandiri": "MANDIRI",
  "Virtual Account BNI": "BNI",
  BRIVA: "BRI",
  "Virtual Account CIMB": "CIMB",
};

const EWALLET_CHANNELS: Record<string, string> = {
  Gopay: "ID_GOPAY",
  OVO: "ID_OVO",
  DANA: "ID_DANA",
};

/**
 * Buat payment request ke Xendit untuk metode yang dipilih user, lalu kembalikan
 * info yang bisa ditampilkan langsung di halaman kita (embedded) — nomor VA atau
 * QR code — bukan redirect ke hosted page Xendit.
 * Butuh XENDIT_SECRET_KEY. Kalau belum ada, kembalikan status "unavailable".
 */
export async function createXenditPayment(params: {
  referenceId: string;
  amount: number;
  method: string;
  customerName: string;
}): Promise<PaymentDisplay> {
  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    return { kind: "unavailable", message: "Pembayaran online belum dikonfigurasi. Tim kami akan menghubungi Anda via WhatsApp." };
  }

  const auth = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
  const isVA = params.method in VA_CHANNELS;
  const isEwallet = params.method in EWALLET_CHANNELS;

  try {
    let body: Record<string, unknown>;
    if (isVA) {
      body = {
        reference_id: params.referenceId,
        amount: params.amount,
        currency: "IDR",
        country: "ID",
        payment_method: {
          type: "VIRTUAL_ACCOUNT",
          reusability: "ONE_TIME_USE",
          virtual_account: {
            channel_code: VA_CHANNELS[params.method],
            channel_properties: { customer_name: params.customerName },
          },
        },
      };
    } else if (isEwallet) {
      body = {
        reference_id: params.referenceId,
        amount: params.amount,
        currency: "IDR",
        country: "ID",
        payment_method: {
          type: "EWALLET",
          reusability: "ONE_TIME_USE",
          ewallet: {
            channel_code: EWALLET_CHANNELS[params.method],
            channel_properties: { success_return_url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000" },
          },
        },
      };
    } else {
      return { kind: "unavailable", message: "Metode pembayaran tidak dikenali." };
    }

    const res = await fetch("https://api.xendit.co/payment_requests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      return { kind: "unavailable", message: json?.message ?? "Gagal membuat pembayaran." };
    }

    const actions: { type: string; descriptor?: string; value?: string; url?: string }[] = json?.actions ?? [];
    const vaAction = actions.find((a) => a.descriptor?.includes("VIRTUAL_ACCOUNT"));
    if (vaAction?.value) {
      return { kind: "virtual_account", bankName: VA_CHANNELS[params.method], accountNumber: vaAction.value };
    }
    const qrAction = actions.find((a) => a.type === "PRESENT_TO_CUSTOMER" && a.value);
    if (qrAction?.value) return { kind: "qr", qrString: qrAction.value };
    const redirectAction = actions.find((a) => a.url);
    if (redirectAction?.url) return { kind: "redirect", url: redirectAction.url };

    return { kind: "unavailable", message: "Menunggu instruksi pembayaran dari penyedia." };
  } catch {
    return { kind: "unavailable", message: "Tidak bisa terhubung ke layanan pembayaran." };
  }
}
