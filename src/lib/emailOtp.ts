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
    `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06)">
        <tr>
          <td style="background:#11151c;padding:28px 32px 24px">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:12px">
                <div style="width:36px;height:36px;background:#b59637;border-radius:50%;text-align:center;line-height:36px">
                  <span style="color:#fff;font-size:18px;font-weight:700">P</span>
                </div>
              </td>
              <td>
                <div style="color:#fff;font-size:18px;font-weight:700;letter-spacing:.02em">Prossi</div>
                <div style="color:#b59637;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;margin-top:2px">Clinic</div>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 28px">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#11151c">Verifikasi Email Kamu</h1>
            <p style="margin:0 0 28px;font-size:14px;color:#666;line-height:1.6">Gunakan kode di bawah ini untuk melanjutkan. Kode berlaku selama <strong style="color:#11151c">10 menit</strong>.</p>
            <div style="background:#f9f7f4;border:2px solid #e8e0d0;border-radius:12px;padding:28px 24px;text-align:center;margin:0 0 28px">
              <div style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#b59637;margin-bottom:12px">Kode Verifikasi</div>
              <div style="font-size:42px;font-weight:700;letter-spacing:14px;color:#11151c;font-family:Courier,monospace;padding-left:14px">${code}</div>
            </div>
            <p style="margin:0;font-size:13px;color:#999;line-height:1.6">Jika kamu tidak meminta kode ini, abaikan email ini. Jangan bagikan kode ini ke siapapun.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9f7f4;padding:20px 32px;border-top:1px solid #eee8da">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6">Ada pertanyaan? Hubungi kami via <a href="https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}" style="color:#b59637;text-decoration:none">WhatsApp</a>.<br>© 2026 Prossi Clinic. Jl. Bintaro Utama 3A, Bintaro Jaya Sektor 3.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  );
}
