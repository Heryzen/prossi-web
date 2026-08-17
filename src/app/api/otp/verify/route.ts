import { NextRequest, NextResponse } from "next/server";
import { verifyOtpToken } from "@/lib/emailOtp";

export async function POST(req: NextRequest) {
  let email: string, otpToken: string, code: string;
  try {
    ({ email, otpToken, code } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !otpToken || !code) {
    return NextResponse.json({ error: "email, otpToken, dan code wajib diisi." }, { status: 400 });
  }

  const valid = verifyOtpToken(otpToken, email.toLowerCase().trim(), code.trim());
  if (!valid) {
    return NextResponse.json({ error: "Kode OTP tidak valid atau sudah kadaluarsa." }, { status: 400 });
  }

  return NextResponse.json({ valid: true });
}
