import crypto from "crypto";
import { sendMail } from "./mailer";

const SECRET = process.env.OTP_SECRET ?? "prossi-otp-secret-change-me";
const EXPIRY_MS = 10 * 60 * 1000;

export function generateOtpToken(email: string): { code: string; token: string } {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + EXPIRY_MS;
  const payload = JSON.stringify({ email, code, expiry });
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  const token = Buffer.from(JSON.stringify({ payload, sig })).toString("base64url");
  return { code, token };
}

export function verifyOtpToken(token: string, email: string, code: string): boolean {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const { payload, sig } = JSON.parse(raw) as { payload: string; sig: string };
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return false;
    const data = JSON.parse(payload) as { email: string; code: string; expiry: number };
    if (data.email !== email || data.code !== code) return false;
    if (Date.now() > data.expiry) return false;
    return true;
  } catch {
    return false;
  }
}

export async function sendOtpEmail(email: string, code: string) {
  await sendMail(
    email,
    "Kode Verifikasi Prossi Clinic",
    `<div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
      <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#b59637;letter-spacing:.06em;text-transform:uppercase">Prossi Clinic</p>
      <h2 style="color:#11151c;font-size:22px;margin:0 0 12px;font-weight:700">Kode Verifikasi Email</h2>
      <p style="color:#555;font-size:14px;margin:0 0 24px">Masukkan kode berikut untuk melanjutkan proses checkout:</p>
      <div style="background:#f9f7f4;border-radius:12px;padding:28px;text-align:center;margin:0 0 24px">
        <span style="font-size:40px;font-weight:700;letter-spacing:10px;color:#b59637;font-family:monospace">${code}</span>
      </div>
      <p style="color:#889bbf;font-size:13px;margin:0">Kode berlaku <strong>10 menit</strong>. Jangan bagikan ke siapapun.</p>
    </div>`
  );
}
