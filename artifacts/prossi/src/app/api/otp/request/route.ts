import { NextRequest, NextResponse } from "next/server";

const FAZPASS_BASE = "https://api.fazpass.com";

export async function POST(req: NextRequest) {
  const merchantKey = process.env.FAZPASS_SMS_MERCHANT_KEY;

  if (!merchantKey) {
    return NextResponse.json({ error: "Fazpass not configured." }, { status: 500 });
  }

  let phone: string, channel: "sms" | "wa" = "sms";
  try {
    ({ phone, channel = "sms" } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const gatewayKey =
    channel === "wa"
      ? process.env.FAZPASS_WA_GATEWAY_KEY
      : process.env.FAZPASS_SMS_GATEWAY_KEY;

  if (!gatewayKey) {
    return NextResponse.json({ error: `Fazpass ${channel.toUpperCase()} gateway not configured.` }, { status: 500 });
  }

  if (!phone) {
    return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
  }

  // Normalize to 628xxx format (Fazpass tidak pakai +)
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("62")
    ? digits
    : digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : `62${digits}`;

  try {
    const res = await fetch(`${FAZPASS_BASE}/v1/otp/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${merchantKey}`,
      },
      body: JSON.stringify({ phone: normalized, gateway_key: gatewayKey }),
    });

    const json = await res.json();

    if (!res.ok || !json.status) {
      return NextResponse.json({ error: json.message ?? "Gagal mengirim OTP." }, { status: 502 });
    }

    return NextResponse.json({ otpId: json.data.id });
  } catch {
    return NextResponse.json({ error: "Tidak bisa terhubung ke server OTP." }, { status: 502 });
  }
}
