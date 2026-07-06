import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/members?filter[phone][_eq]=${encodeURIComponent(phone)}&fields=status&limit=1`,
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
    );
    const json = await res.json();
    const status = json?.data?.[0]?.status ?? "unknown";
    return NextResponse.json({ status });
  } catch {
    return NextResponse.json({ status: "unknown" });
  }
}
