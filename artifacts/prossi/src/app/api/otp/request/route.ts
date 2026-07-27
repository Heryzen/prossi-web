import { NextRequest, NextResponse } from "next/server";
import { generateOtpToken, sendOtpEmail } from "@/lib/emailOtp";

export async function POST(req: NextRequest) {
  let email: string;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
  }

  const isDev = process.env.NODE_ENV !== "production";

  if (!process.env.SMTP_USER) {
    if (!isDev) {
      return NextResponse.json({ error: "Email service belum dikonfigurasi." }, { status: 500 });
    }
    // Dev: return token tanpa kirim email, log kode ke server console
    const { code, token } = generateOtpToken(email.toLowerCase().trim());
    console.log(`\n[DEV OTP] ${email} → ${code}\n`);
    return NextResponse.json({ otpToken: token });
  }

  try {
    const { code, token } = generateOtpToken(email.toLowerCase().trim());
    await sendOtpEmail(email, code);
    return NextResponse.json({ otpToken: token });
  } catch {
    return NextResponse.json({ error: "Gagal mengirim email OTP." }, { status: 502 });
  }
}
