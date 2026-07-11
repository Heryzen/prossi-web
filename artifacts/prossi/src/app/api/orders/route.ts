import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

type OrderItem = { slug: string; name: string; price: number; qty: number };
type Address = {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postal: string;
  detail: string;
};

async function directus(path: string, init?: RequestInit) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}`, ...init?.headers },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.errors?.[0]?.message ?? res.statusText);
  return json.data;
}

function generateOrderNumber(): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PRO-${rand}`;
}

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      items,
      address,
      shipping_courier,
      shipping_service,
      shipping_cost,
      payment_method,
      member_id, // opsional — kalau user login
    }: {
      items: OrderItem[];
      address: Address;
      shipping_courier: string;
      shipping_service: string;
      shipping_cost: number;
      payment_method: string;
      member_id?: string;
    } = body;

    if (!items?.length || !address?.phone) {
      return NextResponse.json({ error: "Data order tidak lengkap" }, { status: 400 });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const total = subtotal + (shipping_cost ?? 0);
    const order_number = generateOrderNumber();

    await directus("/items/orders", {
      method: "POST",
      body: JSON.stringify({
        order_number,
        member: member_id ?? null,
        guest_name: address.name,
        guest_phone: address.phone,
        guest_email: null,
        items,
        subtotal,
        shipping_cost: shipping_cost ?? 0,
        total,
        shipping_courier,
        shipping_service,
        address,
        payment_method,
        payment_status: "unpaid",
        status: "new",
      }),
    });

    const itemLines = items.map((i) => `- ${i.name} x${i.qty}`).join("\n");
    sendWhatsAppMessage(
      address.phone,
      `Halo ${address.name}, pesanan kamu #${order_number} sudah kami terima!\n\n${itemLines}\n\nTotal: ${rupiah(total)}\n\nKami akan konfirmasi pembayaran secepatnya. Terima kasih sudah belanja di Prossi Clinic 💛`
    ).catch(() => {});

    return NextResponse.json({ order_number, total });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("order_number");
  const phone = searchParams.get("phone");
  const memberId = searchParams.get("member_id");

  try {
    if (orderNumber) {
      const rows = await directus(`/items/orders?filter[order_number][_eq]=${encodeURIComponent(orderNumber)}&limit=1`);
      return NextResponse.json({ order: rows?.[0] ?? null });
    }
    if (memberId) {
      const rows = await directus(
        `/items/orders?filter[member][_eq]=${encodeURIComponent(memberId)}&sort=-date_created&limit=50`
      );
      return NextResponse.json({ orders: rows });
    }
    if (phone) {
      const rows = await directus(
        `/items/orders?filter[guest_phone][_eq]=${encodeURIComponent(phone)}&sort=-date_created&limit=50`
      );
      return NextResponse.json({ orders: rows });
    }
    return NextResponse.json({ error: "order_number atau phone wajib diisi" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
