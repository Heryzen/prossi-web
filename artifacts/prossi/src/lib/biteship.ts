const BASE = "https://api.biteship.com";

export type ShippingRate = {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
  courierCode: string;
  serviceCode: string;
};

export type BiteshipOrder = {
  id: string;
  waybill_id: string;
  tracking_id: string;
  status: string;
  price: number;
  courier: {
    company: string;
    type: string;
    waybill_id: string;
    tracking_id: string;
    routing_code: string;
    link: string;
  };
};

const FALLBACK_RATES: ShippingRate[] = [
  { courier: "JNE", service: "Reguler", description: "JNE Reguler (estimasi)", cost: 15000, etd: "2-3 hari", courierCode: "jne", serviceCode: "reg" },
  { courier: "J&T", service: "EZ", description: "J&T Express (estimasi)", cost: 12000, etd: "3-4 hari", courierCode: "jnt", serviceCode: "ez" },
];

function biteshipHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: process.env.BITESHIP_API_KEY ?? "",
  };
}

export async function getShippingRates(
  destinationPostalCode: string,
  items: { name: string; value: number; qty: number }[],
  destinationAreaId?: string
): Promise<ShippingRate[]> {
  const apiKey = process.env.BITESHIP_API_KEY;
  const originLocationId = process.env.BITESHIP_ORIGIN_LOCATION_ID;
  const originPostal = process.env.BITESHIP_ORIGIN_POSTAL_CODE ?? "12330";

  if (!apiKey) return FALLBACK_RATES;

  const origin = originLocationId
    ? { origin_location_id: originLocationId }
    : { origin_postal_code: Number(originPostal) };

  const destination = destinationAreaId
    ? { destination_area_id: destinationAreaId, destination_postal_code: Number(destinationPostalCode) || undefined }
    : { destination_postal_code: Number(destinationPostalCode) };

  try {
    const res = await fetch(`${BASE}/v1/rates/couriers`, {
      method: "POST",
      headers: biteshipHeaders(),
      body: JSON.stringify({
        ...origin,
        ...destination,
        couriers: "jne,jnt",
        items: items.map((i) => ({
          name: i.name,
          value: i.value,
          quantity: i.qty,
          weight: 500,
          length: 20,
          width: 15,
          height: 10,
        })),
      }),
    });
    const json = await res.json();
    const pricing = json?.pricing;
    if (!Array.isArray(pricing) || pricing.length === 0) return FALLBACK_RATES;

    return pricing
      .filter((p: { available_collection_method?: string[] }) =>
        p.available_collection_method?.includes("pickup") ?? true
      )
      .map((p: {
        courier_code: string;
        courier_service_code: string;
        courier_name: string;
        courier_service_name: string;
        price: number;
        duration: string;
      }) => ({
        courierCode: p.courier_code,
        serviceCode: p.courier_service_code,
        courier: p.courier_name,
        service: p.courier_service_name,
        description: `${p.courier_name} ${p.courier_service_name}`,
        cost: p.price,
        etd: p.duration,
      }));
  } catch {
    return FALLBACK_RATES;
  }
}

export async function createBiteshipOrder(params: {
  referenceId: string;
  originAddress: string;
  originPostalCode: string;
  originContactName: string;
  originContactPhone: string;
  destinationContactName: string;
  destinationContactPhone: string;
  destinationAddress: string;
  destinationPostalCode: string;
  courierCode: string;
  courierType: string;
  items: { name: string; value: number; qty: number }[];
}): Promise<BiteshipOrder> {
  const originLocationId = process.env.BITESHIP_ORIGIN_LOCATION_ID;
  const originFields = originLocationId
    ? { origin_location_id: originLocationId, origin_collection_method: "pickup" }
    : {
        origin_contact_name: params.originContactName,
        origin_contact_phone: params.originContactPhone,
        origin_address: params.originAddress,
        origin_postal_code: Number(params.originPostalCode),
        origin_collection_method: "pickup",
      };

  const res = await fetch(`${BASE}/v1/orders`, {
    method: "POST",
    headers: biteshipHeaders(),
    body: JSON.stringify({
      shipper_contact_name: "Prossi Clinic",
      shipper_contact_phone: params.originContactPhone,
      ...originFields,
      destination_contact_name: params.destinationContactName,
      destination_contact_phone: params.destinationContactPhone,
      destination_address: params.destinationAddress,
      destination_postal_code: Number(params.destinationPostalCode),
      courier_company: params.courierCode,
      courier_type: params.courierType,
      delivery_type: "now",
      reference_id: params.referenceId,
      items: params.items.map((i) => ({
        name: i.name,
        category: "healthcare",
        value: i.value,
        quantity: i.qty,
        weight: 500,
        length: 20,
        width: 15,
        height: 10,
      })),
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? json?.message ?? "Gagal membuat order Biteship");
  return json as BiteshipOrder;
}

export const INTERNAL_STATUS_LABEL: Record<string, string> = {
  pending_payment: "Menunggu Pembayaran",
  paid: "Dibayar",
  processing: "Diproses",
  packaging: "Dikemas",
  ready_to_ship: "Siap Kirim",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

export const SHIPPING_STATUS_LABEL: Record<string, string> = {
  confirmed: "Resi Terbit",
  allocated: "Menunggu Kurir",
  picking_up: "Kurir Menuju Lokasi",
  picked: "Dijemput Kurir",
  in_transit: "Dalam Perjalanan",
  dropping_off: "Sedang Diantar",
  delivered: "Terkirim",
  on_hold: "Ditahan",
  cancelled: "Dibatalkan Kurir",
  return_in_transit: "Dikembalikan",
  returned: "Dikembalikan ke Pengirim",
  courier_not_found: "Kurir Tidak Ditemukan",
};

export function getCombinedStatusLabel(internalStatus: string, shippingStatus?: string): string {
  if (shippingStatus && SHIPPING_STATUS_LABEL[shippingStatus]) {
    return SHIPPING_STATUS_LABEL[shippingStatus];
  }
  return INTERNAL_STATUS_LABEL[internalStatus] ?? internalStatus;
}
