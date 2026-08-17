import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

// Returns product_type for each slug: { types: { "soothe-creme": "e_voucher", ... } }
export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get("slugs") ?? "";
  if (!slugs) return NextResponse.json({ types: {} });

  const slugList = slugs.split(",").filter(Boolean).slice(0, 50);

  try {
    const filter = slugList.map((s) => `filter[slug][_in][]=${encodeURIComponent(s)}`).join("&");
    const res = await fetch(
      `${DIRECTUS_URL}/items/products?fields=slug,product_type&${filter}&limit=50`,
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
    );
    const json = await res.json();
    const types: Record<string, string> = {};
    for (const p of json?.data ?? []) {
      types[p.slug] = p.product_type ?? "e_voucher";
    }
    for (const s of slugList) {
      if (!(s in types)) types[s] = "e_voucher";
    }
    return NextResponse.json({ types });
  } catch {
    const types: Record<string, string> = {};
    for (const s of slugList) types[s] = "e_voucher";
    return NextResponse.json({ types });
  }
}
