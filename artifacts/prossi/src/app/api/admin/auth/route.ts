import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !password || password !== secret) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, token: secret });
}
