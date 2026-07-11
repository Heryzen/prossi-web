"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

type Order = {
  order_number: string;
  total: number;
  status: string;
  payment_status: string;
  date_created: string;
};

export default function OrderHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let memberId: string | undefined;
    try {
      const raw = localStorage.getItem("prossi_member");
      memberId = raw ? JSON.parse(raw).id : undefined;
    } catch {
      memberId = undefined;
    }

    if (!memberId) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }
    setLoggedIn(true);

    fetch(`/api/orders?member_id=${encodeURIComponent(memberId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setOrders(json?.orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white w-full pt-[100px] pb-[80px] px-6 md:px-[160px]">
        <div className="max-w-[700px] mx-auto flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-20 w-full bg-[#f4ece4] rounded-[12px] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!loggedIn) {
    return (
      <section className="bg-white w-full pt-[100px] pb-[80px] px-6 md:px-[160px]">
        <div className="max-w-[700px] mx-auto flex flex-col items-center gap-6 text-center">
          <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[24px] text-[#11151c]">
            Riwayat Pesanan
          </h1>
          <p className="font-['Inter',sans-serif] text-[15px] text-[#3b4963]">
            Masuk ke akun Anda untuk melihat riwayat pesanan.
          </p>
          <Link
            href="/login"
            className="bg-[#b59637] rounded-[100px] px-9 py-3 text-white font-['Inter',sans-serif] font-semibold text-[15px] hover:opacity-90 transition-opacity"
          >
            Masuk
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white w-full pt-[100px] pb-[80px] px-6 md:px-[160px]">
      <div className="max-w-[700px] mx-auto flex flex-col gap-8">
        <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[24px] text-[#11151c]">
          Riwayat Pesanan
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 text-center py-12">
            <p className="font-['Inter',sans-serif] text-[15px] text-[#3b4963]">
              Belum ada pesanan. Yuk mulai belanja di Shop Prossi.
            </p>
            <Link
              href="/shop"
              className="bg-[#b59637] rounded-[100px] px-9 py-3 text-white font-['Inter',sans-serif] font-semibold text-[15px] hover:opacity-90 transition-opacity"
            >
              Ke Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.order_number}
                href={`/shop/orders/${order.order_number}`}
                className="flex flex-col gap-2 border border-[#e6ecf7] rounded-[12px] px-6 py-4 hover:border-[#b59637] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[16px] text-[#11151c]">
                    #{order.order_number}
                  </span>
                  <span className="font-['Inter',sans-serif] font-medium text-[15px] text-[#3b4963]">
                    {rupiah(order.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-['Inter',sans-serif] text-[13px] text-[#889bbf]">
                    {new Date(order.date_created).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-[100px] font-['Inter',sans-serif] font-semibold text-[12px] bg-[#f1f4fa] text-[#11151c]">
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <span className="px-3 py-1 rounded-[100px] font-['Inter',sans-serif] font-semibold text-[12px] bg-[#f4ece4] text-[#b59637]">
                      {PAYMENT_LABEL[order.payment_status] ?? order.payment_status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
