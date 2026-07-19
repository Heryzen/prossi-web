import { NextRequest, NextResponse } from "next/server";

const FAZPASS_BASE = "https://api.fazpass.com";

export async function POST(req: NextRequest) {
  const merchantKey = process.env.FAZPASS_SMS_MERCHANT_KEY;

  if (!merchantKey) {
    return NextResponse.json({ error: "Fazpass not configured." }, { status: 500 });
  }

  let otpId: string, otp: string;
  try {
    ({ otpId, otp } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!otpId || !otp) {
    return NextResponse.json({ error: "otpId and otp are required." }, { status: 400 });
  }

  try {
    const res = await fetch(`${FAZPASS_BASE}/v1/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${merchantKey}`,
      },
      body: JSON.stringify({ otp_id: otpId, otp }),
    });

    const json = await res.json();

    if (!res.ok || !json.status) {
      return NextResponse.json({ error: json.message ?? "Kode OTP tidak valid." }, { status: 400 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ error: "Tidak bisa terhubung ke server OTP." }, { status: 502 });
  }
}
