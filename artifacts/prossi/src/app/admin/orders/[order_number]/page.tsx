"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const INTERNAL_LABEL: Record<string, string> = {
  pending_payment: "Menunggu Bayar", paid: "Dibayar", processing: "Diproses",
  packaging: "Dikemas", ready_to_ship: "Siap Kirim", shipped: "Dikirim",
  delivered: "Selesai", cancelled: "Dibatalkan",
};

const SHIPPING_LABEL: Record<string, string> = {
  confirmed: "Resi Terbit", allocated: "Menunggu Kurir", picking_up: "Kurir Menuju",
  picked: "Dijemput", in_transit: "Dalam Perjalanan", dropping_off: "Sedang Diantar",
  delivered: "Terkirim", on_hold: "Ditahan", cancelled: "Batal Kurir", returned: "Dikembalikan",
};

const STEPS = [
  { key: "paid", label: "Dibayar" }, { key: "processing", label: "Diproses" },
  { key: "packaging", label: "Dikemas" }, { key: "ready_to_ship", label: "Siap Kirim" },
  { key: "shipped", label: "Dikirim" }, { key: "delivered", label: "Selesai" },
];

const NEXT_STATUS: Record<string, { value: string; label: string }[]> = {
  paid: [{ value: "processing", label: "Diproses" }, { value: "cancelled", label: "Batalkan" }],
  processing: [{ value: "packaging", label: "Dikemas" }, { value: "cancelled", label: "Batalkan" }],
  packaging: [{ value: "ready_to_ship", label: "Siap Kirim" }, { value: "cancelled", label: "Batalkan" }],
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
  return `https://biteship.com/track?waybill=${encodeURIComponent(waybill)}`;
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const { order_number } = useParams<{ order_number: string }>();

  const [token, setToken] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
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

  async function handleStatusSave() {
    if (!token || !order || !selectedStatus) return;
    setSavingStatus(true); setStatusError("");
    try {
      const res = await fetch(`/api/admin/orders/${order.order_number}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ internal_status: selectedStatus }),
      });
      const j = await res.json();
      if (!res.ok) { setStatusError(j.error ?? "Gagal"); return; }
      setOrder((o) => o ? { ...o, internal_status: selectedStatus } : o);
      setSelectedStatus("");
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
  const nextOptions = NEXT_STATUS[st] ?? [];
  const canShip = st === "ready_to_ship";
  const isFinal = ["shipped", "delivered", "cancelled"].includes(st);
  const isShipped = st === "shipped" || st === "delivered";

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <div className="sticky top-0 z-50 bg-white border-b border-[#e6ecf7] px-6 py-3 flex items-center justify-between">
        <Link href="/admin/orders" className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#3b4963] hover:text-[#b59637]">
          ← Daftar Pesanan
        </Link>
        <button
          onClick={() => { localStorage.removeItem("prossi_admin_token"); router.push("/admin/login"); }}
          className="font-['Inter',sans-serif] text-[13px] text-[#889bbf] hover:text-[#a8312a]"
        >
          Keluar
        </button>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-[780px] mx-auto flex flex-col gap-5">
        {/* Header */}
        <div>
          <p className="font-['Inter',sans-serif] text-[11px] font-semibold tracking-widest uppercase text-[#b59637] mb-1">Pesanan</p>
          <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[22px] text-[#11151c]">
            #{order.order_number}
          </h1>
          <p className="font-['Inter',sans-serif] text-[13px] text-[#889bbf] mt-1">
            {new Date(order.date_created).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}{order.guest_name} · {order.guest_phone}
          </p>
        </div>

        {/* Stepper */}
        {st !== "cancelled" && (
          <div className="bg-white rounded-[16px] border border-[#e6ecf7] px-5 py-5">
            <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#889bbf] mb-4">Status</p>
            <div className="flex items-center overflow-x-auto pb-1">
              {STEPS.map((step, i) => {
                const done = i <= currentStepIdx;
                const active = i === currentStepIdx;
                return (
                  <div key={step.key} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 ${active ? "bg-[#b59637] border-[#b59637] text-white" : done ? "bg-[#edf7f2] border-[#2a7a50] text-[#2a7a50]" : "bg-white border-[#dde3f0] text-[#c8cef4]"}`}>
                        {done && !active ? "✓" : i + 1}
                      </div>
                      <span className={`font-['Inter',sans-serif] text-[10px] font-semibold whitespace-nowrap ${active ? "text-[#b59637]" : done ? "text-[#2a7a50]" : "text-[#c8cef4]"}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-0.5 w-8 md:w-12 flex-shrink-0 mx-1 ${i < currentStepIdx ? "bg-[#2a7a50]" : "bg-[#e6ecf7]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {st === "cancelled" && (
          <div className="bg-[#fdf0ee] border border-[#f5cbc7] rounded-[12px] px-5 py-4">
            <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#a8312a]">Pesanan ini telah dibatalkan.</p>
          </div>
        )}

        {/* Action */}
        {!isFinal && (
          <div className="bg-white rounded-[16px] border border-[#e6ecf7] px-5 py-5">
            <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#889bbf] mb-4">Aksi</p>
            {canShip ? (
              <div className="flex flex-col gap-3">
                <p className="font-['Inter',sans-serif] text-[14px] text-[#3b4963]">
                  Paket siap dijemput kurir. Klik tombol berikut untuk membuat order di Biteship.
                </p>
                <button
                  onClick={() => { setShipError(""); setShowModal(true); }}
                  className="w-fit bg-[#b59637] rounded-[100px] px-8 py-3 text-white font-['Inter',sans-serif] font-semibold text-[15px] hover:opacity-90"
                >
                  🚚 Proses Pengiriman
                </button>
              </div>
            ) : nextOptions.length > 0 ? (
              <div className="flex flex-col gap-3">
                <p className="font-['Inter',sans-serif] text-[13px] text-[#3b4963]">
                  Status saat ini: <strong>{INTERNAL_LABEL[st] ?? st}</strong>
                </p>
                <div className="flex gap-3 items-center flex-wrap">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-[#dde3f0] rounded-[10px] px-4 py-2.5 font-['Inter',sans-serif] text-[14px] outline-none focus:border-[#b59637] bg-white text-[#11151c]"
                  >
                    <option value="">Ubah status ke...</option>
                    {nextOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <button
                    onClick={handleStatusSave}
                    disabled={!selectedStatus || savingStatus}
                    className="bg-[#b59637] rounded-[100px] px-6 py-2.5 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 disabled:opacity-40"
                  >
                    {savingStatus ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
                {statusError && <p className="font-['Inter',sans-serif] text-[13px] text-[#a8312a]">{statusError}</p>}
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
                <span>Ongkir ({(order.shipping_courier ?? "").toUpperCase()} {(order.shipping_service ?? "").toUpperCase()})</span>
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
            <p className="font-['Inter',sans-serif] text-[13px] text-[#3b4963] mt-1">
              {order.address.detail}, {order.address.district}, {order.address.city}, {order.address.province} {order.address.postal}
            </p>
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
              Aksi ini membuat order di Biteship dan tidak bisa dibatalkan.
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
