"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCart, type CartItem } from "@/lib/cart";
import type { ShippingRate } from "@/lib/biteship";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";

const enableShipping = process.env.NEXT_PUBLIC_ENABLE_SHIPPING !== "false";

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

declare global {
  interface Window {
    snap: { pay: (token: string, options: object) => void };
  }
}

type AreaResult = {
  id: string;
  label: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
};

type Address = {
  name: string;
  phone: string;
  area_id: string;
  province: string;
  city: string;
  district: string;
  postal: string;
  detail: string;
  note: string;
};

const emptyAddress: Address = { name: "", phone: "", area_id: "", province: "", city: "", district: "", postal: "", detail: "", note: "" };

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
  const [view, setView] = useState<"delivery" | "verify-email" | "pay">("delivery");
  const [dueOpen, setDueOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPhysical, setHasPhysical] = useState(false);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const [guestEmail, setGuestEmail] = useState("");
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [otpSending, setOtpSending] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [areaQuery, setAreaQuery] = useState("");
  const [areaSuggestions, setAreaSuggestions] = useState<AreaResult[]>([]);
  const [areaLoading, setAreaLoading] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const areaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Load Midtrans Snap.js
  useEffect(() => {
    const MIDTRANS_ENV = process.env.NEXT_PUBLIC_MIDTRANS_ENV ?? "sandbox";
    const snapUrl =
      MIDTRANS_ENV === "production"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
    if (!clientKey) return;
    const script = document.createElement("script");
    script.src = snapUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Detect physical products in cart
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return;
    const slugs = cartItems.map((i) => i.slug).join(",");
    fetch(`/api/products/types?slugs=${encodeURIComponent(slugs)}`)
      .then((r) => r.json())
      .then((json) => {
        const types: Record<string, string> = json.types ?? {};
        const physical = cartItems.some((i) => types[i.slug] === "physical");
        setHasPhysical(physical);
      })
      .catch(() => {}); // default to no shipping (e-voucher)
  }, [cartItems]);

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setAddr({ ...addr, [k]: e.target.value });

  const handleAreaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setAreaQuery(v);
    setAddr((prev) => ({ ...prev, area_id: "", province: "", city: "", district: "", postal: "" }));
    setAreaOpen(false);
    if (areaTimerRef.current) clearTimeout(areaTimerRef.current);
    if (v.length < 3) { setAreaSuggestions([]); return; }
    areaTimerRef.current = setTimeout(async () => {
      setAreaLoading(true);
      try {
        const res = await fetch(`/api/shipping/areas?input=${encodeURIComponent(v)}`);
        const json = await res.json();
        setAreaSuggestions(json.areas ?? []);
        setAreaOpen((json.areas?.length ?? 0) > 0);
      } catch { /* ignore */ }
      finally { setAreaLoading(false); }
    }, 400);
  };

  function selectArea(area: AreaResult) {
    setAreaQuery(area.label);
    setAddr((prev) => ({ ...prev, area_id: area.id, district: area.district, city: area.city, province: area.province, postal: area.postal_code }));
    setAreaOpen(false);
    setAreaSuggestions([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingCost = selectedRate?.cost ?? 0;
  const total = subtotal + shippingCost;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enableShipping && hasPhysical && !addr.area_id) {
      setError("Pilih kecamatan dari daftar dropdown terlebih dahulu.");
      return;
    }
    setError(null);
    setSaved(true);
    setEditing(false);
    if (!(enableShipping && hasPhysical)) return;
    setRatesLoading(true);
    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area_id: addr.area_id,
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

  const handleGoToVerifyOrMethod = async () => {
    if (otpToken === "verified") {
      setView("pay");
      return;
    }
    setOtpSending(true);
    setError(null);
    try {
      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: guestEmail }),
      });
      const json = await res.json();
      setOtpToken(json.otpToken ?? json.token ?? null);
      setView("verify-email");
    } catch {
      setError("Tidak bisa mengirim kode OTP.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleSnapPay = async () => {
    setPayLoading(true);
    setPayError(null);
    try {
      let currentOrderNumber = orderNumber;
      if (!currentOrderNumber) {
        const member = getMember();
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({ slug: i.slug, name: i.name, price: i.price, qty: i.qty })),
            address: addr,
            ...(enableShipping && hasPhysical
              ? {
                  shipping_courier: selectedRate?.courierCode ?? "",
                  shipping_service: selectedRate?.serviceCode ?? "",
                  shipping_cost: shippingCost,
                }
              : {}),
            payment_method: "midtrans",
            member_id: member?.id,
            guest_email: guestEmail,
          }),
        });
        const orderJson = await orderRes.json();
        if (!orderRes.ok) {
          setPayError(orderJson.error ?? "Gagal membuat pesanan.");
          return;
        }
        currentOrderNumber = orderJson.order_number;
        setOrderNumber(currentOrderNumber);
        if (!productSlug) clearCart();
      }

      let token = snapToken;
      if (!token) {
        const midRes = await fetch("/api/payment/midtrans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_number: currentOrderNumber }),
        });
        const midJson = await midRes.json();
        if (!midRes.ok) {
          setPayError(midJson.error ?? "Gagal memulai pembayaran.");
          return;
        }
        token = midJson.snap_token;
        setSnapToken(token);
      }

      setPayLoading(false);
      window.snap.pay(token!, {
        onSuccess: () => {
          window.location.href = `/shop/orders/${currentOrderNumber}`;
        },
        onPending: () => {
          window.location.href = `/shop/orders/${currentOrderNumber}`;
        },
        onError: (result: unknown) => {
          setPayError("Pembayaran gagal. Silakan coba lagi.");
          console.error("Snap error:", result);
        },
        onClose: () => {
          // user closed the Snap popup, stay on pay view
        },
      });
    } catch {
      setPayError("Tidak bisa terhubung ke server.");
    } finally {
      setPayLoading(false);
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
              className="bg-white border border-[#e6ecf7] rounded-[20px] overflow-hidden w-full lg:max-w-[480px] flex"
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
          className="bg-white border border-[#e6ecf7] rounded-[20px] px-5 py-6 w-full lg:max-w-[480px]"
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
          <div className="flex flex-col gap-10 w-full lg:max-w-[480px]">
            {/* Step 1 — Delivery */}
            <div className="flex flex-col gap-6">
              <StepHeading num="1" label="Delivery" />

              {editing ? (
                <form className="flex flex-wrap gap-2" onSubmit={handleSaveAddress}>
                  <div className="w-full">
                    <label className={labelCls}>Email</label>
                    <input type="email" required className={inputCls} placeholder="email@contoh.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                  </div>
                  <div className="w-full md:w-[calc(50%-4px)]">
                    <label className={labelCls}>Full Name</label>
                    <input required className={inputCls} placeholder="Enter your name" value={addr.name} onChange={set("name")} />
                  </div>
                  <div className="w-full md:w-[calc(50%-4px)]">
                    <label className={labelCls}>Phone Number</label>
                    <input required className={inputCls} placeholder="08xxxxxxxxxx" value={addr.phone} onChange={set("phone")} inputMode="tel" />
                  </div>
                  {enableShipping && hasPhysical && (
                    <>
                  <div className="w-full relative">
                    <label className={labelCls}>Kecamatan / Kelurahan</label>
                    <input
                      className={inputCls}
                      placeholder="Ketik kecamatan/kota, mis. Pesanggrahan atau Jakarta Selatan"
                      value={areaQuery}
                      onChange={handleAreaInput}
                      onFocus={() => areaSuggestions.length > 0 && setAreaOpen(true)}
                      onBlur={() => setTimeout(() => setAreaOpen(false), 150)}
                      autoComplete="off"
                    />
                    {areaLoading && (
                      <span className="absolute right-3 top-[42px] w-4 h-4 border-2 border-[#b59637] border-t-transparent rounded-full animate-spin" />
                    )}
                    {areaOpen && areaSuggestions.length > 0 && (
                      <ul className="absolute top-full left-0 right-0 z-50 bg-white border border-[#c4cfe1] rounded-[8px] shadow-lg max-h-[220px] overflow-y-auto mt-1">
                        {areaSuggestions.map((area) => (
                          <li
                            key={area.id}
                            onMouseDown={() => selectArea(area)}
                            className="px-4 py-3 font-['Inter',sans-serif] text-[13px] text-[#11151c] cursor-pointer hover:bg-[#f4ece4] border-b border-[#f0f3fa] last:border-0"
                          >
                            {area.label}
                          </li>
                        ))}
                      </ul>
                    )}
                    {addr.area_id && (
                      <p className="mt-1.5 font-['Inter',sans-serif] text-[12px] text-[#2a7a50]">
                        ✓ {addr.district}, {addr.city}, {addr.province} · Kode Pos {addr.postal}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={labelCls}>Alamat Lengkap</label>
                    <textarea
                      required
                      rows={3}
                      className={inputCls}
                      placeholder="Jl. ... No. ..., RT/RW, blok/unit"
                      value={addr.detail}
                      onChange={set("detail")}
                    />
                  </div>
                  <div className="w-full">
                    <label className={labelCls}>
                      Patokan / Catatan untuk Kurir{" "}
                      <span className="font-normal text-[#889bbf]">(opsional)</span>
                    </label>
                    <input
                      className={inputCls}
                      placeholder="mis. pagar hijau, seberang minimarket, titip satpam"
                      value={addr.note}
                      onChange={set("note")}
                    />
                  </div>
                    </>
                  )}
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
                        {addr.district}, {addr.city}, {addr.province} {addr.postal}
                      </span>
                      {addr.note && (
                        <span className="font-['Inter',sans-serif] text-[13px] text-[#889bbf]">
                          Catatan: {addr.note}
                        </span>
                      )}
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
            {enableShipping && hasPhysical && saved && !editing && (
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

              {saved && !editing && (selectedRate || !(enableShipping && hasPhysical)) ? (
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
                    {enableShipping && hasPhysical && selectedRate && (
                      <div className="flex justify-between gap-4">
                        <span className="font-['Lato',sans-serif] text-[16px] leading-[30px] text-[#11151c]">
                          Delivery ({selectedRate.courier} {selectedRate.service})
                        </span>
                        <span className="font-['Lato',sans-serif] font-medium text-[16px] text-[#3b4963]">{rupiah(shippingCost)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">Total due</span>
                    <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[20px] text-black">{rupiah(total)}</span>
                  </div>
                  <button
                    type="button"
                    disabled={otpSending}
                    onClick={handleGoToVerifyOrMethod}
                    className="w-full bg-[#11151c] rounded-[8px] px-4 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    {otpSending ? "Mengirim kode..." : "Lanjutkan ke Pembayaran"}
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

        {view === "verify-email" && (
          <div className="flex flex-col gap-6 w-full lg:max-w-[480px]">
            <button
              type="button"
              onClick={() => setView("delivery")}
              className="flex items-center gap-2 font-['Inter',sans-serif] font-medium text-[16px] text-[#11151c] hover:opacity-70 transition-opacity w-fit cursor-pointer"
            >
              <ChevronLeft />
              Kembali
            </button>

            <div className="bg-white rounded-[16px] border border-[#e6ecf7] px-6 py-8 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[20px] text-[#11151c]">
                  Verifikasi Email
                </h2>
                <p className="font-['Inter',sans-serif] text-[14px] text-[#3b4963]">
                  Kode 6 digit telah dikirim ke{" "}
                  <span className="font-semibold">{guestEmail}</span>
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    className="w-11 h-14 text-center border border-[#c4cfe1] rounded-[5px] font-['Inter',sans-serif] font-medium text-[20px] text-[#11151c] outline-none focus:border-[#b59637] transition-colors"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const newDigits = [...otpDigits];
                      newDigits[i] = val.slice(-1);
                      setOtpDigits(newDigits);
                      if (val && i < 5) otpRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
                        otpRefs.current[i - 1]?.focus();
                      }
                    }}
                  />
                ))}
              </div>

              {otpError && <p className="text-red-500 text-sm text-center">{otpError}</p>}

              <button
                type="button"
                disabled={otpDigits.join("").length !== 6 || otpVerifying}
                onClick={async () => {
                  setOtpVerifying(true);
                  setOtpError(null);
                  try {
                    const res = await fetch("/api/otp/verify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: guestEmail, otpToken, code: otpDigits.join("") }),
                    });
                    const json = await res.json();
                    if (res.ok && json.valid) {
                      setOtpToken("verified");
                      setView("pay");
                    } else {
                      setOtpError(json.error ?? "Kode tidak valid. Silakan coba lagi.");
                      setOtpDigits(Array(6).fill(""));
                      otpRefs.current[0]?.focus();
                    }
                  } catch {
                    setOtpError("Tidak bisa terhubung ke server.");
                  } finally {
                    setOtpVerifying(false);
                  }
                }}
                className="w-full bg-[#b59637] text-white rounded-[100px] px-4 py-3 font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpVerifying ? "Memverifikasi..." : "Verifikasi"}
              </button>

              <button
                type="button"
                disabled={otpSending}
                onClick={async () => {
                  setOtpSending(true);
                  setOtpError(null);
                  try {
                    const res = await fetch("/api/otp/request", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: guestEmail }),
                    });
                    const json = await res.json();
                    setOtpToken(json.otpToken ?? json.token ?? null);
                    setOtpDigits(Array(6).fill(""));
                  } catch {
                    setOtpError("Tidak bisa mengirim ulang kode.");
                  } finally {
                    setOtpSending(false);
                  }
                }}
                className="w-fit self-center font-['Inter',sans-serif] text-[14px] text-[#3b4963] underline cursor-pointer disabled:opacity-50"
              >
                {otpSending ? "Mengirim..." : "Kirim Ulang"}
              </button>
            </div>
          </div>
        )}

        {view === "pay" && (
          <div className="flex flex-col gap-6 w-full lg:max-w-[480px]">
            <button
              type="button"
              onClick={() => setView("delivery")}
              className="flex items-center gap-2 font-['Inter',sans-serif] font-medium text-[16px] text-[#11151c] hover:opacity-70 transition-opacity w-fit cursor-pointer"
            >
              <ChevronLeft />
              Kembali
            </button>

            <StepHeading num="2" label="Ringkasan Pesanan" />

            <div className="flex flex-col gap-2 pb-4" style={{ borderBottom: "2px solid #e6ecf7" }}>
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
              {enableShipping && hasPhysical && selectedRate && (
                <div className="flex justify-between gap-4">
                  <span className="font-['Lato',sans-serif] text-[16px] leading-[30px] text-[#11151c]">
                    Delivery ({selectedRate.courier} {selectedRate.service})
                  </span>
                  <span className="font-['Lato',sans-serif] font-medium text-[16px] text-[#3b4963]">{rupiah(shippingCost)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">Total</span>
              <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[20px] text-black">{rupiah(total)}</span>
            </div>

            <p className="font-['Inter',sans-serif] font-medium text-[14px] text-[#3b4963]">
              Dengan mengklik tombol di bawah, Anda menyetujui{" "}
              <Link href="/privacy" className="underline">Kebijakan Privasi dan Garansi.</Link>
            </p>

            {payError && <p className="font-['Inter',sans-serif] text-[14px] text-red-600">{payError}</p>}

            <button
              type="button"
              disabled={payLoading}
              onClick={handleSnapPay}
              className="w-full bg-[#b59637] rounded-[8px] px-4 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {payLoading ? "Memproses..." : "Bayar Sekarang"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
