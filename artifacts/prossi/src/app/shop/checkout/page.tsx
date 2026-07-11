"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart, type CartItem } from "@/lib/cart";
import type { ShippingRate } from "@/lib/biteship";
import type { PaymentDisplay } from "@/lib/xendit";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const PAYMENT_METHODS = [
  {
    group: "Virtual Account",
    items: [
      { label: "Virtual Account BCA", logo: "/figma/banks/bank-bca.png" },
      { label: "Virtual Account Mandiri", logo: "/figma/banks/bank-mandiri.png" },
      { label: "Virtual Account BNI", logo: "/figma/banks/bank-bni.png" },
      { label: "BRIVA", logo: "/figma/banks/bank-bri.png" },
      { label: "Virtual Account CIMB", logo: "/figma/banks/bank-cimb.png" },
    ],
  },
  {
    group: "E-wallet",
    items: [
      { label: "Gopay", logo: "/figma/banks/ewallet-gopay.png" },
      { label: "OVO", logo: "/figma/banks/ewallet-ovo.png" },
      { label: "DANA", logo: "/figma/banks/ewallet-dana.png" },
    ],
  },
];

const PROVINCES = ["DKI Jakarta", "Banten", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Bali"];

type Address = {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postal: string;
  detail: string;
};

const emptyAddress: Address = { name: "", phone: "", province: "", city: "", district: "", postal: "", detail: "" };

const inputCls =
  "w-full border border-[#c4cfe1] rounded-[5px] px-3 py-[9px] font-['Inter',sans-serif] font-medium text-[14px] text-[#11151c] placeholder:text-[#889bbf] outline-none focus:border-[#b59637] transition-colors bg-white";
const labelCls = "font-['Inter',sans-serif] font-medium text-[14px] text-[#11151c] pb-2 block";

function StepHeading({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 rounded-[20px] bg-[#dee5f0] flex items-center justify-center font-['Inter',sans-serif] font-bold text-[14px] text-[#11151c]">
        {num}
      </span>
      <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[20px] leading-[30px] text-[#11151c]">
        {label}
      </span>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="#11151C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#11151c" className="shrink-0 mt-1">
      <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.35 11.8a1 1 0 0 0 1.3 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
}

function getMember(): { id: string; full_name: string } | null {
  try {
    const raw = localStorage.getItem("prossi_member");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");
  const qty = Number(searchParams.get("qty") ?? "1");
  const { items: cartItems, clear: clearCart } = useCart();

  const [quickBuyItem, setQuickBuyItem] = useState<CartItem | null>(null);
  const items: CartItem[] = productSlug && quickBuyItem ? [quickBuyItem] : cartItems;

  const [addr, setAddr] = useState<Address>(emptyAddress);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(true);
  const [view, setView] = useState<"delivery" | "method" | "pay">("delivery");
  const [dueOpen, setDueOpen] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentDisplay, setPaymentDisplay] = useState<PaymentDisplay | null>(null);

  // quick-buy (Beli Sekarang) — ambil detail produk by slug
  useEffect(() => {
    if (!productSlug) return;
    fetch(`${DIRECTUS_URL}/items/products?filter[slug][_eq]=${encodeURIComponent(productSlug)}&fields=name,price,image&limit=1`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const p = json?.data?.[0];
        if (p) {
          setQuickBuyItem({
            slug: productSlug,
            name: p.name,
            price: p.price,
            image: p.image ? `${DIRECTUS_URL}/assets/${p.image}` : null,
            qty: qty > 0 ? qty : 1,
          });
        }
      })
      .catch(() => {});
  }, [productSlug, qty]);

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setAddr({ ...addr, [k]: e.target.value });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingCost = selectedRate?.cost ?? 0;
  const total = subtotal + shippingCost;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setEditing(false);
    setRatesLoading(true);
    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postal_code: addr.postal,
          items: items.map((i) => ({ name: i.name, value: i.price, qty: i.qty })),
        }),
      });
      const json = await res.json();
      setRates(json.rates ?? []);
      setSelectedRate(json.rates?.[0] ?? null);
    } catch {
      setRates([]);
    } finally {
      setRatesLoading(false);
    }
  };

  const handleContinuePayment = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      const member = getMember();
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, name: i.name, price: i.price, qty: i.qty })),
          address: addr,
          shipping_courier: selectedRate?.courier ?? "",
          shipping_service: selectedRate?.service ?? "",
          shipping_cost: shippingCost,
          payment_method: selected,
          member_id: member?.id,
        }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderJson.error ?? "Gagal membuat pesanan.");
        return;
      }
      setOrderNumber(orderJson.order_number);

      const payRes = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: orderJson.order_number, method: selected }),
      });
      const payJson = await payRes.json();
      setPaymentDisplay(payJson.display ?? { kind: "unavailable", message: "Gagal memuat instruksi pembayaran." });

      if (!productSlug) clearCart();
      setView("pay");
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-[112px] min-h-screen flex flex-col lg:flex-row">
      {/* ── Kolom kiri ── */}
      <div className="bg-[#f4ece4] w-full lg:w-[45%] px-6 py-10 lg:pl-[160px] lg:pr-[80px] lg:pt-[100px] lg:pb-[80px] flex flex-col gap-8 lg:gap-12 shrink-0">
        <Link href="/shop" className="flex items-center gap-2 font-['Inter',sans-serif] font-medium text-[16px] text-[#11151c] hover:opacity-70 transition-opacity w-fit">
          <ChevronLeft />
          Payment
        </Link>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="bg-white border border-[#e6ecf7] rounded-[20px] overflow-hidden max-w-[480px] flex"
              style={{ boxShadow: "0px 4px 4px -4px rgba(12,12,13,0.05), 0px 16px 16px -8px rgba(12,12,13,0.1)" }}
            >
              <div className="w-[100px] h-[100px] shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(180deg, #f4ece4 0%, #e8d9bd 100%)" }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif font-semibold text-[14px] text-[#b59637] opacity-60">PROSSI</span>
                )}
              </div>
              <div className="px-4 py-3 flex flex-col justify-center gap-1">
                <p className="font-['Lato',sans-serif] font-bold text-[15px] leading-tight text-[#11151c] line-clamp-2">
                  {item.name}
                </p>
                <p className="font-['Inter',sans-serif] text-[13px] text-[#3b4963]">
                  {item.qty} x {rupiah(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="font-['Inter',sans-serif] text-[14px] text-[#889bbf]">
            Keranjang kosong.{" "}
            <Link href="/shop" className="underline">
              Lihat produk
            </Link>
          </p>
        )}

        {/* Total due accordion */}
        <div
          className="bg-white border border-[#e6ecf7] rounded-[20px] px-5 py-6 max-w-[480px]"
          style={{ boxShadow: "0px 4px 4px -4px rgba(12,12,13,0.05), 0px 16px 16px -8px rgba(12,12,13,0.1)" }}
        >
          <button type="button" onClick={() => setDueOpen(!dueOpen)} className="w-full flex items-center justify-between cursor-pointer">
            <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">Total due</span>
            <span className="flex items-center gap-2">
              <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[20px] text-black">{rupiah(total)}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={dueOpen ? "" : "rotate-180"}>
                <path d="M18 15l-6-6-6 6" stroke="#11151C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          {dueOpen && (
            <div className="flex flex-col gap-2 mt-4 pt-3" style={{ borderTop: "2px solid #e6ecf7" }}>
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between">
                  <span className="font-['Lato',sans-serif] text-[15px] text-[#11151c]">
                    {item.name} x{item.qty}
                  </span>
                  <span className="font-['Lato',sans-serif] font-medium text-[15px] text-[#3b4963] whitespace-nowrap">
                    {rupiah(item.price * item.qty)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="font-['Lato',sans-serif] text-[16px] text-[#11151c]">Delivery</span>
                <span className="font-['Lato',sans-serif] font-medium text-[16px] text-[#3b4963]">
                  {selectedRate ? rupiah(shippingCost) : "-"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Kolom kanan ── */}
      <div className="bg-white flex-1 px-6 py-10 lg:pl-[120px] lg:pr-[160px] lg:pt-[100px] lg:pb-[80px]">
        {view === "delivery" && (
          <div className="flex flex-col gap-10 max-w-[480px]">
            {/* Step 1 — Delivery */}
            <div className="flex flex-col gap-6">
              <StepHeading num="1" label="Delivery" />

              {editing ? (
                <form className="flex flex-wrap gap-2" onSubmit={handleSaveAddress}>
                  <div className="w-full sm:w-[calc(50%-4px)]">
                    <label className={labelCls}>Full Name</label>
                    <input required className={inputCls} placeholder="Enter your name" value={addr.name} onChange={set("name")} />
                  </div>
                  <div className="w-full sm:w-[calc(50%-4px)]">
                    <label className={labelCls}>Phone Number</label>
                    <input required className={inputCls} placeholder="08xxxxxxxxxx" value={addr.phone} onChange={set("phone")} inputMode="tel" />
                  </div>
                  <div className="w-full sm:w-[calc(50%-4px)]">
                    <label className={labelCls}>Province</label>
                    <select required className={inputCls} value={addr.province} onChange={set("province")}>
                      <option value="" disabled>Select province</option>
                      {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="w-full sm:w-[calc(50%-4px)]">
                    <label className={labelCls}>City</label>
                    <input required className={inputCls} placeholder="Select city" value={addr.city} onChange={set("city")} />
                  </div>
                  <div className="w-full sm:w-[calc(50%-4px)]">
                    <label className={labelCls}>District</label>
                    <input required className={inputCls} placeholder="Select district" value={addr.district} onChange={set("district")} />
                  </div>
                  <div className="w-full sm:w-[calc(50%-4px)]">
                    <label className={labelCls}>Postal Code</label>
                    <input required className={inputCls} placeholder="Enter code" value={addr.postal} onChange={set("postal")} inputMode="numeric" />
                  </div>
                  <div className="w-full">
                    <label className={labelCls}>Address Details</label>
                    <textarea
                      required
                      rows={3}
                      className={inputCls}
                      placeholder="Enter street name, building name or number, nearby landmarks, or other information"
                      value={addr.detail}
                      onChange={set("detail")}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={items.length === 0}
                    className="mt-2 bg-[#11151c] rounded-[8px] px-6 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3 border border-[#c4cfe1] rounded-[6px] px-5 py-4">
                    <LocationIcon />
                    <div className="flex flex-col gap-1">
                      <span className="font-['Inter',sans-serif] font-bold text-[16px] text-[#11151c]">{addr.name}</span>
                      <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">{addr.phone}</span>
                      <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">{addr.detail}</span>
                      <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">
                        {addr.district}, {addr.city}, {addr.province}, {addr.postal}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="w-fit rounded-[8px] px-4 py-3 font-['Inter',sans-serif] font-semibold text-[14px] text-[#11151c] hover:bg-[#f1f4fa] transition-colors cursor-pointer"
                  >
                    Edit Delivery Address
                  </button>
                </div>
              )}
            </div>

            {/* Step 1.5 — Pilih Kurir */}
            {saved && !editing && (
              <div className="flex flex-col gap-4">
                <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">Pilih Pengiriman</span>
                {ratesLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#b59637] border-t-transparent animate-spin" />
                    <p className="font-['Inter',sans-serif] text-[14px] text-[#889bbf]">Memuat ongkir...</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {rates.map((r) => (
                      <button
                        key={`${r.courier}-${r.service}`}
                        type="button"
                        onClick={() => setSelectedRate(r)}
                        className="flex items-center justify-between py-3 px-4 border rounded-[8px] text-left cursor-pointer transition-colors"
                        style={{ borderColor: selectedRate?.courier === r.courier && selectedRate?.service === r.service ? "#11151c" : "#e6ecf7" }}
                      >
                        <div className="flex flex-col">
                          <span className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#11151c]">
                            {r.courier} {r.service}
                          </span>
                          <span className="font-['Inter',sans-serif] text-[13px] text-[#3b4963]">{r.description} · {r.etd}</span>
                        </div>
                        <span className="font-['Inter',sans-serif] font-bold text-[14px] text-[#11151c]">{rupiah(r.cost)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2 — Payment Summary */}
            <div className="flex flex-col gap-6">
              <StepHeading num="2" label="Payment Summary" />

              {saved && !editing && selectedRate ? (
                <>
                  <div className="flex flex-col gap-2 pb-3" style={{ borderBottom: "2px solid #e6ecf7" }}>
                    {items.map((item) => (
                      <div key={item.slug} className="flex justify-between gap-4">
                        <span className="font-['Lato',sans-serif] text-[15px] leading-[30px] text-[#11151c]">
                          {item.name} x{item.qty}
                        </span>
                        <span className="font-['Lato',sans-serif] font-medium text-[15px] text-[#3b4963] whitespace-nowrap">
                          {rupiah(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4">
                      <span className="font-['Lato',sans-serif] text-[16px] leading-[30px] text-[#11151c]">
                        Delivery ({selectedRate.courier} {selectedRate.service})
                      </span>
                      <span className="font-['Lato',sans-serif] font-medium text-[16px] text-[#3b4963]">{rupiah(shippingCost)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">Total due</span>
                    <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[20px] text-black">{rupiah(total)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView("method")}
                    className="w-full bg-[#11151c] rounded-[8px] px-4 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Select Payment Method
                  </button>
                </>
              ) : (
                <p className="font-['Inter',sans-serif] font-medium text-[14px] text-[#889bbf]">
                  Lengkapi alamat dan pilih pengiriman terlebih dahulu.
                </p>
              )}
            </div>
          </div>
        )}

        {view === "method" && (
          <div className="flex flex-col gap-6 max-w-[480px]">
            <button
              type="button"
              onClick={() => setView("delivery")}
              className="flex items-center gap-2 font-['Inter',sans-serif] font-medium text-[16px] text-[#11151c] hover:opacity-70 transition-opacity w-fit cursor-pointer"
            >
              <ChevronLeft />
              Payment Method
            </button>

            {PAYMENT_METHODS.map((group) => (
              <div key={group.group} className="flex flex-col">
                <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963] pb-2">{group.group}</span>
                {group.items.map((method) => (
                  <button
                    key={method.label}
                    type="button"
                    onClick={() => setSelected(method.label)}
                    className="flex items-center gap-3 py-4 cursor-pointer text-left"
                    style={{ borderBottom: "2px solid #eff1fc" }}
                  >
                    <img src={method.logo} alt="" className="w-[29px] h-5 object-contain shrink-0" />
                    <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#11151c] flex-1">{method.label}</span>
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ border: selected === method.label ? "5px solid #11151c" : "1px solid #c4cfe1" }}
                    />
                  </button>
                ))}
              </div>
            ))}

            <p className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">
              By clicking the button below, you acknowledge that you have read, understood and agree to the{" "}
              <Link href="/privacy" className="underline">Privacy and Warranty Policy.</Link>
            </p>

            {error && <p className="font-['Inter',sans-serif] text-[14px] text-red-600">{error}</p>}

            <button
              type="button"
              disabled={!selected || submitting}
              onClick={handleContinuePayment}
              className="w-full rounded-[8px] px-4 py-3 font-['Inter',sans-serif] font-semibold text-[14px] transition-opacity cursor-pointer disabled:cursor-not-allowed"
              style={
                selected
                  ? { background: "#11151c", color: "#ffffff" }
                  : { background: "#f1f4fa", color: "#889bbf", border: "1px solid #889bbf" }
              }
            >
              {submitting ? "Memproses..." : "Continue Payment"}
            </button>
          </div>
        )}

        {view === "pay" && (
          <div className="flex flex-col gap-6 max-w-[480px] items-center text-center pt-8">
            <div className="w-16 h-16 rounded-full bg-[#b59637] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[20px] text-[#11151c]">
              Pesanan #{orderNumber} Diterima
            </h1>

            {paymentDisplay?.kind === "virtual_account" && (
              <div className="bg-[#f1f4fa] rounded-[12px] px-8 py-6 flex flex-col gap-2 w-full">
                <span className="font-['Inter',sans-serif] text-[14px] text-[#3b4963]">Transfer ke {paymentDisplay.bankName} Virtual Account</span>
                <span className="font-mono font-bold text-[24px] text-[#11151c] tracking-wider">{paymentDisplay.accountNumber}</span>
              </div>
            )}
            {paymentDisplay?.kind === "qr" && (
              <div className="bg-[#f1f4fa] rounded-[12px] px-8 py-6 flex flex-col gap-2 w-full">
                <span className="font-['Inter',sans-serif] text-[14px] text-[#3b4963]">Scan QR untuk membayar</span>
                <span className="font-mono text-[11px] text-[#11151c] break-all">{paymentDisplay.qrString}</span>
              </div>
            )}
            {paymentDisplay?.kind === "redirect" && (
              <a href={paymentDisplay.url} target="_blank" rel="noopener noreferrer" className="bg-[#11151c] rounded-[8px] px-6 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px]">
                Lanjutkan Pembayaran
              </a>
            )}
            {paymentDisplay?.kind === "unavailable" && (
              <p className="font-['Inter',sans-serif] text-[14px] text-[#3b4963]">{paymentDisplay.message}</p>
            )}

            <p className="font-['Inter',sans-serif] text-[13px] text-[#889bbf]">
              Status pembayaran akan otomatis terupdate begitu kami menerima konfirmasi. Kami juga akan mengirim
              update via WhatsApp ke {addr.phone}.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {orderNumber && (
                <Link
                  href={`/shop/orders/${orderNumber}`}
                  className="bg-[#11151c] rounded-[8px] px-6 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 transition-opacity"
                >
                  Lihat Detail Pesanan
                </Link>
              )}
              <Link
                href="/shop"
                className="bg-transparent border-2 border-[#b59637] text-[#b59637] rounded-[8px] px-6 py-3 font-['Inter',sans-serif] font-semibold text-[14px] hover:bg-[#b59637]/10 transition-colors"
              >
                Kembali ke Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
