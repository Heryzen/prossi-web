import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const res = await fetch(
      `${DIRECTUS_URL}/items/members?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,full_name,phone,email,password,status&limit=1`,
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
    );
    const json = await res.json();
    const member = json?.data?.[0];

    if (!member) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }
    if (member.status !== "active") {
      return NextResponse.json({ error: "Akun belum terverifikasi. Selesaikan verifikasi WhatsApp terlebih dahulu." }, { status: 403 });
    }

    const verifyRes = await fetch(`${DIRECTUS_URL}/utils/hash/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ string: password, hash: member.password }),
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson?.data) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    return NextResponse.json({ id: member.id, full_name: member.full_name, phone: member.phone, email: member.email });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
