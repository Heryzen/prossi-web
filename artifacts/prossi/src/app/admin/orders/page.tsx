"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
};

const INTERNAL_CHIP: Record<string, string> = {
  pending_payment: "bg-[#fdf0e8] text-[#b85c1a]",
  paid: "bg-[#edf7f2] text-[#2a7a50]",
  processing: "bg-[#eef3fb] text-[#2d5fa8]",
  packaging: "bg-[#eef3fb] text-[#2d5fa8]",
  ready_to_ship: "bg-[#eef3fb] text-[#2d5fa8]",
  shipped: "bg-[#f3eef8] text-[#6b3fa0]",
  delivered: "bg-[#edf7f2] text-[#2a7a50]",
  cancelled: "bg-[#fdf0ee] text-[#a8312a]",
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

type Order = {
  order_number: string;
  guest_name: string;
  guest_phone: string;
  total: number;
  shipping_courier: string;
  items: { name: string; qty: number }[];
  internal_status: string | null;
  status: string;
  shipping_status: string | null;
  date_created: string;
};

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "paid", label: "Dibayar" },
  { key: "processing", label: "Diproses" },
  { key: "ready_to_ship", label: "Siap Kirim" },
  { key: "shipped", label: "Dikirim" },
  { key: "delivered", label: "Selesai" },
  { key: "cancelled", label: "Batal" },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("prossi_admin_token");
    if (!t) { router.replace("/admin/login"); return; }
    setToken(t);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const url = filter === "all" ? "/api/admin/orders" : `/api/admin/orders?status=${filter}`;
    fetch(url, { headers: { "x-admin-token": token } })
      .then((r) => r.json())
      .then((j) => setOrders(j.orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, filter]);

  function logout() {
    localStorage.removeItem("prossi_admin_token");
    router.push("/admin/login");
  }

  const displayed = search
    ? orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(search.toLowerCase()) ||
          (o.guest_name ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const urgent = orders.filter(
    (o) => o.internal_status === "paid" || o.internal_status === "ready_to_ship"
  ).length;

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <div className="sticky top-0 z-50 bg-white border-b border-[#e6ecf7] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[16px] text-[#11151c]">
            Prossi Admin
          </span>
          {urgent > 0 && (
            <span className="bg-[#a8312a] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {urgent}
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="font-['Inter',sans-serif] text-[13px] text-[#889bbf] hover:text-[#a8312a] transition-colors"
        >
          Keluar
        </button>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-[1100px] mx-auto">
        <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[22px] text-[#11151c] mb-5">
          Daftar Pesanan
        </h1>

        <input
          type="text"
          placeholder="Cari nomor order atau nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-[380px] border border-[#dde3f0] rounded-[10px] px-4 py-2.5 font-['Inter',sans-serif] text-[14px] outline-none focus:border-[#b59637] transition-colors mb-4"
        />

        <div className="flex gap-2 flex-wrap mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-[100px] font-['Inter',sans-serif] text-[13px] font-semibold transition-colors ${
                filter === f.key
                  ? "bg-[#b59637] text-white"
                  : "bg-white border border-[#e6ecf7] text-[#3b4963] hover:border-[#b59637]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-white rounded-[12px] border border-[#e6ecf7] animate-pulse" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#e6ecf7] px-6 py-12 text-center">
            <p className="font-['Inter',sans-serif] text-[15px] text-[#889bbf]">Tidak ada pesanan.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-[#e6ecf7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e6ecf7]">
                    {["No. Order", "Customer", "Produk", "Total", "Kurir", "Status", "Status Kurir", "Tanggal", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#889bbf] px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((order) => {
                    const st = order.internal_status ?? order.status;
                    const isUrgent = st === "paid" || st === "ready_to_ship";
                    const firstItem = order.items?.[0];
                    const extra = (order.items?.length ?? 0) - 1;
                    return (
                      <tr
                        key={order.order_number}
                        className={`border-b border-[#f0f3fa] hover:bg-[#fafbff] ${isUrgent ? "bg-[#fffcf0]" : ""}`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-['Merriweather_Sans',sans-serif] font-bold text-[13px] text-[#11151c]">
                            #{order.order_number}
                          </span>
                          {isUrgent && (
                            <span className="ml-1.5 bg-[#b59637] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              !
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-['Inter',sans-serif] text-[13px] text-[#11151c] block">{order.guest_name}</span>
                          <span className="font-['Inter',sans-serif] text-[11px] text-[#889bbf]">{order.guest_phone}</span>
                        </td>
                        <td className="px-4 py-3 max-w-[150px]">
                          <span className="font-['Inter',sans-serif] text-[12px] text-[#3b4963] line-clamp-1">
                            {firstItem?.name ?? "-"}{extra > 0 ? ` +${extra}` : ""}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#11151c]">
                            {rupiah(order.total)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-['Inter',sans-serif] text-[12px] text-[#3b4963] uppercase">{order.shipping_courier ?? "-"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-[100px] font-['Inter',sans-serif] font-semibold text-[11px] whitespace-nowrap ${INTERNAL_CHIP[st] ?? "bg-[#f1f4fa] text-[#11151c]"}`}>
                            {INTERNAL_LABEL[st] ?? st}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {order.shipping_status ? (
                            <span className="font-['Inter',sans-serif] text-[12px] text-[#6b3fa0] whitespace-nowrap">
                              {SHIPPING_LABEL[order.shipping_status] ?? order.shipping_status}
                            </span>
                          ) : (
                            <span className="text-[#c8cef4] text-[12px]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-['Inter',sans-serif] text-[12px] text-[#889bbf]">
                            {new Date(order.date_created).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/orders/${order.order_number}`}
                            className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#b59637] hover:opacity-70 whitespace-nowrap"
                          >
                            Detail →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
