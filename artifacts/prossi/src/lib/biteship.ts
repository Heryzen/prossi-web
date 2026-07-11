export type ShippingRate = {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};

const FALLBACK_RATES: ShippingRate[] = [
  { courier: "JNE", service: "REG", description: "Reguler (estimasi)", cost: 15000, etd: "2-3 hari" },
  { courier: "JNT", service: "EZ", description: "Ekonomi (estimasi)", cost: 12000, etd: "3-4 hari" },
];

/**
 * Ambil ongkir dari Biteship. Butuh BITESHIP_API_KEY + BITESHIP_ORIGIN_POSTAL_CODE.
 * Kalau belum dikonfigurasi atau API gagal, kembalikan tarif flat sebagai fallback
 * (supaya checkout tetap bisa jalan sebelum kredensial asli tersedia).
 */
export async function getShippingRates(
  destinationPostalCode: string,
  items: { name: string; value: number; qty: number }[]
): Promise<ShippingRate[]> {
  const apiKey = process.env.BITESHIP_API_KEY;
  const originPostal = process.env.BITESHIP_ORIGIN_POSTAL_CODE ?? "12190";

  if (!apiKey) return FALLBACK_RATES;

  try {
    const res = await fetch("https://api.biteship.com/v1/rates/couriers", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: apiKey },
      body: JSON.stringify({
        origin_postal_code: Number(originPostal),
        destination_postal_code: Number(destinationPostalCode),
        couriers: "jne,jnt,sicepat,anteraja",
        items: items.map((i) => ({ name: i.name, value: i.value, quantity: i.qty, weight: 500 })),
      }),
    });
    const json = await res.json();
    const pricing = json?.pricing;
    if (!Array.isArray(pricing) || pricing.length === 0) return FALLBACK_RATES;

    return pricing.map(
      (p: { courier_name: string; courier_service_name: string; description: string; price: number; duration: string }) => ({
        courier: p.courier_name,
        service: p.courier_service_name,
        description: p.description || p.courier_service_name,
        cost: p.price,
        etd: p.duration,
      })
    );
  } catch {
    return FALLBACK_RATES;
  }
}
