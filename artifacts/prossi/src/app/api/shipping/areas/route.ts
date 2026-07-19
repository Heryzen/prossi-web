import { NextResponse } from "next/server";

const BASE = "https://api.biteship.com";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input") ?? "";

  if (input.length < 3) return NextResponse.json({ areas: [] });

  try {
    const res = await fetch(
      `${BASE}/v1/maps/areas?countries=ID&input=${encodeURIComponent(input)}&type=single`,
      {
        headers: { Authorization: process.env.BITESHIP_API_KEY ?? "" },
        cache: "no-store",
      }
    );
    const json = await res.json();

    const areas = (json.areas ?? []).map((a: {
      id: string;
      administrative_division_level_1_name?: string;
      administrative_division_level_2_name?: string;
      administrative_division_level_3_name?: string;
      name: string;
      postal_code: string;
    }) => ({
      id: a.id,
      district: a.administrative_division_level_3_name ?? a.name,
      city: a.administrative_division_level_2_name ?? "",
      province: a.administrative_division_level_1_name ?? "",
      postal_code: a.postal_code,
      label: [
        a.administrative_division_level_3_name ?? a.name,
        a.administrative_division_level_2_name,
        a.administrative_division_level_1_name,
        a.postal_code,
      ]
        .filter(Boolean)
        .join(", "),
    }));

    return NextResponse.json({ areas });
  } catch {
    return NextResponse.json({ areas: [] });
  }
}
