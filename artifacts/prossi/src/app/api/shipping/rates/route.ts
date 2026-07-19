import { NextResponse } from "next/server";
import { getShippingRates } from "@/lib/biteship";

export async function POST(req: Request) {
  try {
    const { postal_code, area_id, items } = await req.json();
    if ((!postal_code && !area_id) || !Array.isArray(items)) {
      return NextResponse.json({ error: "postal_code atau area_id dan items wajib diisi" }, { status: 400 });
    }
    const rates = await getShippingRates(postal_code ?? "", items, area_id);
    return NextResponse.json({ rates });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
