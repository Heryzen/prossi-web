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

const INTERNAL_LABEL: Record<string, string> = {
  pending_payment: "Menunggu Bayar",
  paid: "Dibayar",
  processing: "Diproses",
  packaging: "Dikemas",
  ready_to_ship: "Siap Kirim",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
  new: "Pesanan Baru",
  completed: "Selesai",
};

const SHIPPING_LABEL: Record<string, string> = {
  confirmed: "Resi Terbit",
  allocated: "Menunggu Kurir",
  picking_up: "Kurir Menuju",
  picked: "Dijemput",
  in_transit: "Dalam Perjalanan",
  dropping_off: "Sedang Diantar",
  delivered: "Terkirim",
  on_hold: "Ditahan",
  cancelled: "Batal Kurir",
  returned: "Dikembalikan",
};

const PAYMENT_LABEL: Record<string, string> = {
  unpaid: "Belum Dibayar",
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  failed: "Gagal",
};

const STEPS = [
  { key: "paid", label: "Pembayaran Dikonfirmasi" },
  { key: "processing", label: "Sedang Diproses" },
  { key: "packaging", label: "Sedang Dikemas" },
  { key: "ready_to_ship", label: "Siap Kirim" },
  { key: "shipped", label: "Dalam Pengiriman" },
  { key: "delivered", label: "Pesanan Diterima" },
];

function trackingUrl(courier: string, waybill: string) {
  if (courier === "jne") return `https://www.jne.co.id/id/tracking/trace?airwayNumber=${waybill}`;
  if (courier === "jnt") return `https://jet.co.id/track?awb=${waybill}`;
  return `https://biteship.com/track?waybill=${encodeURIComponent(waybill)}`;
}

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
  internal_status: string | null;
  shipping_status: string | null;
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

  const st = order.internal_status ?? order.status;
  const currentStepIdx = STEPS.findIndex((s) => s.key === st);
  const isCancelled = st === "cancelled";
  const isShipped = st === "shipped" || st === "delivered";

  return (
    <section className="bg-white w-full pt-[140px] pb-[80px] px-6 md:px-[160px]">
      <div className="max-w-[700px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <div>
          <Link href="/shop/orders" className="font-['Inter',sans-serif] text-[13px] text-[#889bbf] hover:text-[#b59637] mb-3 block">
            ← Riwayat Pesanan
          </Link>
          <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#b59637] uppercase tracking-wider">Pesanan</span>
          <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[26px] text-[#11151c] mt-0.5">
            #{order.order_number}
          </h1>
        </div>

        {/* Status timeline */}
        {!isCancelled ? (
          <div className="border border-[#e6ecf7] rounded-[16px] px-6 py-6">
            <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#889bbf] mb-5">Status Pesanan</p>
            <div className="flex flex-col">
              {STEPS.map((step, i) => {
                const done = i <= currentStepIdx;
                const active = i === currentStepIdx;
                const isLast = i === STEPS.length - 1;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${active ? "bg-[#b59637] text-white" : done ? "bg-[#2a7a50] text-white" : "bg-[#e6ecf7] text-[#c8cef4]"}`}>
                        {done && !active ? "✓" : ""}
                      </div>
                      {!isLast && <div className={`w-0.5 h-8 mt-1 ${done && !active ? "bg-[#2a7a50]" : "bg-[#e6ecf7]"}`} />}
                    </div>
                    <div className="pt-0.5 pb-6">
                      <p className={`font-['Inter',sans-serif] font-semibold text-[14px] ${active ? "text-[#b59637]" : done ? "text-[#11151c]" : "text-[#c8cef4]"}`}>
                        {step.label}
                      </p>
                      {active && order.shipping_status && (
                        <p className="font-['Inter',sans-serif] text-[12px] text-[#6b3fa0] mt-0.5">
                          {SHIPPING_LABEL[order.shipping_status] ?? order.shipping_status}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#fdf0ee] border border-[#f5cbc7] rounded-[12px] px-5 py-4">
            <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#a8312a]">Pesanan ini telah dibatalkan.</p>
          </div>
        )}

        {/* Resi + tracking */}
        {isShipped && order.tracking_number && (
          <div className="bg-[#f3eef8] border border-[#d4c5f5] rounded-[16px] px-6 py-5 flex flex-col gap-3">
            <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#6b3fa0]">Info Pengiriman</p>
            <div>
              <p className="font-['Inter',sans-serif] text-[12px] text-[#889bbf] mb-0.5">Kurir</p>
              <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#11151c] uppercase">
                {order.shipping_courier} {order.shipping_service}
              </p>
            </div>
            <div>
              <p className="font-['Inter',sans-serif] text-[12px] text-[#889bbf] mb-0.5">Nomor Resi</p>
              <p className="font-mono font-bold text-[18px] text-[#11151c]">{order.tracking_number}</p>
            </div>
            {order.shipping_status && (
              <div>
                <p className="font-['Inter',sans-serif] text-[12px] text-[#889bbf] mb-0.5">Status Kurir</p>
                <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#6b3fa0]">
                  {SHIPPING_LABEL[order.shipping_status] ?? order.shipping_status}
                </p>
              </div>
            )}
            <a
              href={trackingUrl(order.shipping_courier, order.tracking_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit bg-[#6b3fa0] rounded-[100px] px-6 py-2.5 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-80 transition-opacity mt-1"
            >
              Lacak Paket →
            </a>
          </div>
        )}

        {/* Payment status chip — only show if unpaid */}
        {order.payment_status !== "paid" && (
          <div className="flex gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[100px] font-['Inter',sans-serif] font-semibold text-[13px] bg-[#f4ece4] text-[#b59637]">
              {PAYMENT_LABEL[order.payment_status] ?? order.payment_status}
            </span>
          </div>
        )}

        {/* Items */}
        <div className="flex flex-col gap-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-4">
              <span className="font-['Inter',sans-serif] text-[15px] text-[#11151c]">
                {item.name} <span className="text-[#889bbf]">x{item.qty}</span>
              </span>
              <span className="font-['Inter',sans-serif] font-medium text-[15px] text-[#3b4963] whitespace-nowrap">
                {rupiah(item.price * item.qty)}
              </span>
            </div>
          ))}
          <div className="flex justify-between pt-3" style={{ borderTop: "1px dashed #c8cef4" }}>
            <span className="font-['Inter',sans-serif] text-[15px] text-[#11151c]">
              Pengiriman ({(order.shipping_courier ?? "").toUpperCase()} {(order.shipping_service ?? "").toUpperCase()})
            </span>
            <span className="font-['Inter',sans-serif] font-medium text-[15px] text-[#3b4963]">{rupiah(order.shipping_cost ?? 0)}</span>
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
