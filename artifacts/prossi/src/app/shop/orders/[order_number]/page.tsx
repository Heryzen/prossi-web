import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

export const metadata: Metadata = {
  title: "Lacak Pesanan | Prossi Clinic",
  robots: "noindex, nofollow",
};

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const STATUS_LABEL: Record<string, string> = {
  new: "Pesanan Baru",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const PAYMENT_LABEL: Record<string, string> = {
  unpaid: "Belum Dibayar",
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  failed: "Gagal",
};

type OrderItem = { slug: string; name: string; price: number; qty: number };
type Order = {
  order_number: string;
  items: OrderItem[];
  shipping_cost: number;
  total: number;
  shipping_courier: string;
  shipping_service: string;
  tracking_number: string | null;
  payment_status: string;
  status: string;
};

async function getOrder(orderNumber: string): Promise<Order | null> {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/orders?filter[order_number][_eq]=${encodeURIComponent(orderNumber)}&limit=1`,
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export default async function OrderTrackingPage({ params }: { params: Promise<{ order_number: string }> }) {
  const { order_number } = await params;
  const order = await getOrder(order_number);

  if (!order) notFound();

  return (
    <section className="bg-white w-full pt-[100px] pb-[80px] px-6 md:px-[160px]">
      <div className="max-w-[700px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#b59637] uppercase">Pesanan</span>
          <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[24px] text-[#11151c]">
            #{order.order_number}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 rounded-[100px] font-['Inter',sans-serif] font-semibold text-[13px] bg-[#f1f4fa] text-[#11151c]">
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
          <span className="px-4 py-2 rounded-[100px] font-['Inter',sans-serif] font-semibold text-[13px] bg-[#f4ece4] text-[#b59637]">
            {PAYMENT_LABEL[order.payment_status] ?? order.payment_status}
          </span>
        </div>

        {order.tracking_number && (
          <div className="bg-[#f1f4fa] rounded-[12px] px-6 py-4">
            <span className="font-['Inter',sans-serif] text-[13px] text-[#3b4963]">Nomor Resi</span>
            <p className="font-mono font-bold text-[18px] text-[#11151c]">{order.tracking_number}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-4">
              <span className="font-['Inter',sans-serif] text-[15px] text-[#11151c]">
                {item.name} x{item.qty}
              </span>
              <span className="font-['Inter',sans-serif] font-medium text-[15px] text-[#3b4963] whitespace-nowrap">
                {rupiah(item.price * item.qty)}
              </span>
            </div>
          ))}
          <div className="flex justify-between pt-3" style={{ borderTop: "1px dashed #c8cef4" }}>
            <span className="font-['Inter',sans-serif] text-[15px] text-[#11151c]">
              Pengiriman ({order.shipping_courier} {order.shipping_service})
            </span>
            <span className="font-['Inter',sans-serif] font-medium text-[15px] text-[#3b4963]">{rupiah(order.shipping_cost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[16px] text-[#11151c]">Total</span>
            <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[18px] text-[#11151c]">{rupiah(order.total)}</span>
          </div>
        </div>

        <Link href="/shop" className="w-fit bg-[#b59637] rounded-[100px] px-9 py-3 text-white font-['Inter',sans-serif] font-semibold text-[15px] hover:opacity-90 transition-opacity">
          Lanjut Belanja
        </Link>
      </div>
    </section>
  );
}
