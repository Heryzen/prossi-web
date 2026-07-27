"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const INTERNAL_LABEL: Record<string, string> = {
  pending_payment: "Menunggu Bayar", paid: "Dibayar", processing: "Diproses",
  packaging: "Dikemas", ready_to_ship: "Siap Kirim", pickup_requested: "Menunggu Penjemputan",
  shipped: "Dikirim", delivered: "Selesai", cancelled: "Dibatalkan",
};

const SHIPPING_LABEL: Record<string, string> = {
  confirmed: "Resi Terbit", allocated: "Menunggu Kurir", picking_up: "Kurir Menuju",
  picked: "Dijemput", in_transit: "Dalam Perjalanan", dropping_off: "Sedang Diantar",
  delivered: "Terkirim", on_hold: "Ditahan", cancelled: "Batal Kurir", returned: "Dikembalikan",
};

const STEPS = [
  { key: "paid", label: "Dibayar" }, { key: "processing", label: "Diproses" },
  { key: "packaging", label: "Dikemas" }, { key: "ready_to_ship", label: "Siap Kirim" },
  { key: "pickup_requested", label: "Menunggu Penjemputan" },
  { key: "shipped", label: "Dikirim" }, { key: "delivered", label: "Selesai" },
];

const NEXT_STATUS: Record<string, { value: string; label: string; desc: string }> = {
  paid:             { value: "processing",    label: "Mulai Proses",      desc: "Tandai pesanan sedang diproses oleh tim" },
  processing:       { value: "packaging",     label: "Kemas Paket",       desc: "Tandai paket sedang dikemas" },
  packaging:        { value: "ready_to_ship", label: "Siap Dikirim",      desc: "Tandai paket siap dijemput kurir" },
  pickup_requested: { value: "shipped",       label: "Serahkan ke Kurir", desc: "Konfirmasi paket sudah diserahkan ke kurir" },
};

type OrderItem = { name: string; price: number; qty: number };
type Address = { name: string; phone: string; province: string; city: string; district: string; postal: string; detail: string };
type Order = {
  id: string; order_number: string; guest_name: string; guest_phone: string;
  items: OrderItem[]; subtotal: number; shipping_cost: number; total: number;
  shipping_courier: string; shipping_service: string; address: Address;
  payment_method: string; payment_status: string; status: string;
  internal_status: string | null; shipping_status: string | null;
  biteship_order_id: string | null; tracking_number: string | null; date_created: string;
};

function trackingUrl(courier: string, waybill: string) {
  if (courier === "jne") return `https://www.jne.co.id/id/tracking/trace?airwayNumber=${waybill}`;
  if (courier === "jnt") return `https://jet.co.id/track?awb=${waybill}`;
  return `https://cekresi.com/?noresi=${encodeURIComponent(waybill)}`;
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const { order_number } = useParams<{ order_number: string }>();

  const [token, setToken] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [shipError, setShipError] = useState("");
  const [shipSuccess, setShipSuccess] = useState<{ waybill: string } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("prossi_admin_token");
    if (!t) { router.replace("/admin/login"); return; }
    setToken(t);
  }, [router]);

  const fetchOrder = useCallback(() => {
    if (!token || !order_number) return;
    setLoading(true);
    fetch(`/api/admin/orders?order_number=${encodeURIComponent(order_number)}`, {
      headers: { "x-admin-token": token },
    })
      .then((r) => r.json())
      .then((j) => { if (!j.order) { setNotFound(true); return; } setOrder(j.order); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token, order_number]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  async function handleStatusChange(newStatus: string) {
    if (!token || !order) return;
    setSavingStatus(true); setStatusError("");
    try {
      const res = await fetch(`/api/admin/orders/${order.order_number}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ internal_status: newStatus }),
      });
      const j = await res.json();
      if (!res.ok) { setStatusError(j.error ?? "Gagal"); return; }
      setOrder((o) => o ? { ...o, internal_status: newStatus } : o);
    } catch { setStatusError("Gagal terhubung ke server"); }
    finally { setSavingStatus(false); }
  }

  async function handleShip() {
    if (!token || !order) return;
    setShipping(true); setShipError("");
    try {
      const res = await fetch(`/api/admin/orders/${order.order_number}/ship`, {
        method: "POST",
        headers: { "x-admin-token": token },
      });
      const j = await res.json();
      if (!res.ok) { setShipError(j.error ?? "Gagal"); return; }
      setShowModal(false);
      setShipSuccess({ waybill: j.waybill_id });
      fetchOrder();
    } catch { setShipError("Gagal terhubung ke server"); }
    finally { setShipping(false); }
  }

  if (!token || loading) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#b59637] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex flex-col items-center justify-center gap-4">
        <p className="font-['Inter',sans-serif] text-[#3b4963]">Order tidak ditemukan.</p>
        <Link href="/admin/orders" className="text-[#b59637] font-semibold">← Kembali</Link>
      </div>
    );
  }

  const st = order.internal_status ?? order.status;
  const currentStepIdx = STEPS.findIndex((s) => s.key === st);
  const nextAction = NEXT_STATUS[st] ?? null;
  const canShip = st === "ready_to_ship";
  const isFinal = ["shipped", "delivered", "cancelled"].includes(st);
  const isShipped = st === "shipped" || st === "delivered";
  const isPendingPayment = st === "pending_payment";

  return (
    <div className="min-h-screen bg-[#f9f7f4] pt-[104px]">
      <div className="sticky top-[104px] z-40 bg-white border-b border-[#e6ecf7] px-6 py-3">
        <Link href="/admin/orders" className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#3b4963] hover:text-[#b59637]">
          ← Daftar Pesanan
        </Link>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-[780px] mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-['Inter',sans-serif] text-[11px] font-semibold tracking-widest uppercase text-[#b59637] mb-0.5">Pesanan</p>
            <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[26px] text-[#11151c]">
              #{order.order_number}
            </h1>
            <p className="font-['Inter',sans-serif] text-[13px] text-[#889bbf] mt-1">
              {new Date(order.date_created).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}{order.guest_name} · {order.guest_phone}
            </p>
          </div>
          <span className={`mt-1 px-4 py-1.5 rounded-full font-['Inter',sans-serif] text-[12px] font-bold whitespace-nowrap ${
            st === "pending_payment" ? "bg-[#fdf0e8] text-[#b85c1a]" :
            st === "paid" ? "bg-[#e8f5ed] text-[#2a7a50]" :
            st === "cancelled" ? "bg-[#fdf0ee] text-[#a8312a]" :
            st === "delivered" ? "bg-[#edf7f2] text-[#2a7a50]" :
            "bg-[#eef3fb] text-[#2d5fa8]"
          }`}>
            {INTERNAL_LABEL[st] ?? st}
          </span>
        </div>

        {/* Stepper */}
        {st === "pending_payment" ? (
          <div className="bg-[#fdf6ec] border border-[#f0d89a] rounded-[14px] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#b59637] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v10m0 0l-3-3m3 3l3-3M5 17h14M5 21h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#7a5c0a]">Menunggu Pembayaran</p>
              <p className="font-['Inter',sans-serif] text-[12px] text-[#a07820] mt-0.5">Belum ada konfirmasi pembayaran dari Midtrans.</p>
            </div>
          </div>
        ) : st !== "cancelled" ? (
          <div className="bg-white rounded-[14px] border border-[#e6ecf7] px-5 py-5">
            <div className="flex items-center overflow-x-auto pb-1 gap-0">
              {STEPS.map((step, i) => {
                const done = i < currentStepIdx;
                const active = i === currentStepIdx;
                return (
                  <div key={step.key} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                        active ? "bg-[#b59637] text-white shadow-[0_0_0_3px_#f0e2ad]" :
                        done   ? "bg-[#2a7a50] text-white" :
                                 "bg-white border-2 border-[#dde3f0] text-[#c8cef4]"
                      }`}>
                        {done ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        ) : i + 1}
                      </div>
                      <span className={`font-['Inter',sans-serif] text-[10px] font-semibold whitespace-nowrap ${
                        active ? "text-[#b59637]" : done ? "text-[#2a7a50]" : "text-[#c8d0e0]"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-[3px] w-8 md:w-14 flex-shrink-0 mx-1 rounded-full mb-4 ${i < currentStepIdx ? "bg-[#2a7a50]" : "bg-[#e6ecf7]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#fdf0ee] border border-[#f5cbc7] rounded-[14px] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#a8312a] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#a8312a]">Pesanan Dibatalkan</p>
              <p className="font-['Inter',sans-serif] text-[12px] text-[#c06060] mt-0.5">Order ini telah dibatalkan dan tidak bisa diproses kembali.</p>
            </div>
          </div>
        )}

        {/* Action */}
        {!isFinal && !isPendingPayment && (
          <div className="bg-white rounded-[14px] border border-[#e6ecf7] px-5 py-5">
            <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#889bbf] mb-4">Aksi</p>
            {canShip ? (
              <div className="flex flex-col gap-3">
                <p className="font-['Inter',sans-serif] text-[14px] text-[#3b4963]">Paket siap dijemput kurir. Proses pengiriman sekarang.</p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => { setShipError(""); setShowModal(true); }}
                    className="flex items-center gap-2 bg-[#b59637] rounded-[100px] px-7 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 transition-opacity"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-2 0h6l3 3v4h-1m-8 0H9m12 0a2 2 0 11-4 0 2 2 0 014 0zM7 20a2 2 0 100-4 2 2 0 000 4z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Proses Pengiriman
                  </button>
                  <button
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={savingStatus}
                    className="bg-white text-[#a8312a] border border-[#f5cbc7] hover:bg-[#fdf0ee] rounded-[100px] px-5 py-3 font-['Inter',sans-serif] font-semibold text-[14px] cursor-pointer transition-colors disabled:opacity-50"
                  >
                    Batalkan Pesanan
                  </button>
                </div>
              </div>
            ) : nextAction ? (
              <div className="flex flex-col gap-4">
                <div className="bg-[#f9f7f4] rounded-[10px] px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-['Inter',sans-serif] text-[13px] text-[#889bbf] mb-0.5">Langkah berikutnya</p>
                    <p className="font-['Inter',sans-serif] font-semibold text-[15px] text-[#11151c]">{nextAction.desc}</p>
                  </div>
                  <button
                    onClick={() => handleStatusChange(nextAction.value)}
                    disabled={savingStatus}
                    className="flex items-center gap-2 bg-[#b59637] rounded-[100px] px-7 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 transition-opacity disabled:opacity-40 whitespace-nowrap"
                  >
                    {savingStatus ? "Menyimpan..." : nextAction.label + " →"}
                  </button>
                </div>
                {statusError && <p className="font-['Inter',sans-serif] text-[13px] text-[#a8312a]">{statusError}</p>}
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={savingStatus}
                  className="w-fit bg-white text-[#a8312a] border border-[#f5cbc7] hover:bg-[#fdf0ee] rounded-[8px] px-4 py-2 font-['Inter',sans-serif] font-semibold text-[13px] cursor-pointer transition-colors disabled:opacity-50"
                >
                  Batalkan Pesanan
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Resi panel */}
        {isShipped && (
          <div className="bg-[#f3eef8] border border-[#d4c5f5] rounded-[16px] px-5 py-5">
            <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#6b3fa0] mb-3">Info Pengiriman</p>
            {shipSuccess && (
              <p className="font-['Inter',sans-serif] text-[13px] text-[#2a7a50] bg-[#edf7f2] rounded-[8px] px-4 py-2 mb-3">
                ✓ Berhasil. Resi: <strong>{shipSuccess.waybill}</strong>
              </p>
            )}
            <div className="flex flex-col gap-2">
              {order.tracking_number && (
                <div>
                  <p className="font-['Inter',sans-serif] text-[11px] text-[#889bbf] mb-0.5">Nomor Resi</p>
                  <p className="font-mono font-bold text-[16px] text-[#11151c]">{order.tracking_number}</p>
                </div>
              )}
              {order.shipping_status && (
                <div>
                  <p className="font-['Inter',sans-serif] text-[11px] text-[#889bbf] mb-0.5">Status Kurir</p>
                  <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#6b3fa0]">
                    {SHIPPING_LABEL[order.shipping_status] ?? order.shipping_status}
                  </p>
                </div>
              )}
              {order.tracking_number && (
                <a href={trackingUrl(order.shipping_courier, order.tracking_number)} target="_blank" rel="noopener noreferrer"
                  className="w-fit mt-1 font-['Inter',sans-serif] text-[13px] font-semibold text-[#6b3fa0] hover:opacity-70">
                  Lacak Paket →
                </a>
              )}
              <div className="border-t border-[#e6ecf7] pt-4 mt-2">
                <p className="font-['Inter',sans-serif] text-[11px] text-[#889bbf] mb-2">Label Pengiriman</p>
                <a
                  href={`/admin/orders/${order.order_number}/label`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#b59637] text-white rounded-[100px] px-6 py-2.5 font-['Inter',sans-serif] font-semibold text-[13px] hover:opacity-90 transition-opacity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Cetak Label Pengiriman
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-[16px] border border-[#e6ecf7] px-5 py-5">
          <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#889bbf] mb-4">Produk</p>
          <div className="flex flex-col gap-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between gap-4">
                <span className="font-['Inter',sans-serif] text-[14px] text-[#11151c]">{item.name} <span className="text-[#889bbf]">x{item.qty}</span></span>
                <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963] whitespace-nowrap">{rupiah(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-[#dde3f0] pt-3 flex flex-col gap-2">
              <div className="flex justify-between text-[13px] text-[#3b4963]">
                <span>Ongkir{order.shipping_courier ? ` (${order.shipping_courier.toUpperCase()} ${(order.shipping_service ?? "").toUpperCase()})` : ""}</span>
                <span>{rupiah(order.shipping_cost ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[15px] text-[#11151c]">Total</span>
                <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[16px] text-[#11151c]">{rupiah(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div className="bg-white rounded-[16px] border border-[#e6ecf7] px-5 py-5">
            <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#889bbf] mb-3">Alamat</p>
            <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#11151c]">{order.address.name}</p>
            <p className="font-['Inter',sans-serif] text-[13px] text-[#3b4963]">{order.address.phone}</p>
            {[order.address.detail, order.address.district, order.address.city, order.address.province].filter(Boolean).length > 0 && (
              <p className="font-['Inter',sans-serif] text-[13px] text-[#3b4963] mt-1">
                {[order.address.detail, order.address.district, order.address.city, order.address.province].filter(Boolean).join(", ")}
                {order.address.postal ? ` ${order.address.postal}` : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white rounded-[20px] max-w-[380px] w-full p-6 flex flex-col gap-4">
            <h3 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[18px] text-[#11151c]">Konfirmasi Pengiriman</h3>
            <p className="font-['Inter',sans-serif] text-[14px] text-[#3b4963]">
              Apakah paket <strong>#{order.order_number}</strong> sudah siap dijemput kurir{" "}
              <strong>{(order.shipping_courier ?? "").toUpperCase()}</strong>?
            </p>
            <p className="font-['Inter',sans-serif] text-[12px] text-[#889bbf] bg-[#f9f7f4] rounded-[8px] px-3 py-2">
              Aksi ini akan memproses pengiriman dan tidak bisa dibatalkan.
            </p>
            {shipError && (
              <p className="font-['Inter',sans-serif] text-[13px] text-[#a8312a] bg-[#fdf0ee] rounded-[8px] px-3 py-2">{shipError}</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} disabled={shipping}
                className="flex-1 border border-[#dde3f0] rounded-[100px] py-2.5 font-['Inter',sans-serif] font-semibold text-[14px] text-[#3b4963] hover:border-[#889bbf] disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleShip} disabled={shipping}
                className="flex-1 bg-[#b59637] rounded-[100px] py-2.5 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 disabled:opacity-50">
                {shipping ? "Memproses..." : "Ya, Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
