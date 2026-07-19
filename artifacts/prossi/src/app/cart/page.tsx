"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="bg-white w-full pt-[140px] pb-[100px] px-6 flex flex-col items-center gap-6 text-center min-h-[60vh]">
        <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[24px] text-[#11151c]">
          Keranjang Kosong
        </h1>
        <p className="font-['Inter',sans-serif] text-[16px] text-[#3b4963]">
          Belum ada produk di keranjangmu.
        </p>
        <Link
          href="/shop"
          className="bg-[#b59637] rounded-[100px] px-9 py-4 text-white font-['Inter',sans-serif] font-semibold text-[16px] hover:opacity-90 transition-opacity"
        >
          Lihat Produk
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-white w-full pt-[140px] pb-[80px] px-6 md:px-[160px]">
      <div className="max-w-[900px] mx-auto flex flex-col gap-8">
        <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[24px] md:text-[28px] text-[#11151c]">
          Keranjang Belanja
        </h1>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center gap-4 border border-[#e6ecf7] rounded-[16px] p-4"
            >
              <div className="w-20 h-20 shrink-0 rounded-[10px] overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "linear-gradient(180deg, #f4ece4 0%, #e8d9bd 100%)" }}
                  >
                    <span className="font-serif font-semibold text-[10px] text-[#b59637] opacity-60">PROSSI</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <Link href={`/shop/${item.slug}`} className="font-['Lato',sans-serif] font-bold text-[16px] text-[#11151c] hover:opacity-70 transition-opacity">
                  {item.name}
                </Link>
                <span className="font-['Inter',sans-serif] font-semibold text-[15px] text-[#11151c]">{rupiah(item.price)}</span>
              </div>

              <div className="flex items-center gap-2 border border-[#c4cfe1] rounded-[8px]">
                <button
                  type="button"
                  onClick={() => updateQty(item.slug, item.qty - 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#f1f4fa] transition-colors cursor-pointer font-bold text-[#11151c]"
                >
                  −
                </button>
                <span className="w-8 text-center font-['Inter',sans-serif] font-medium text-[14px] text-[#11151c]">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => updateQty(item.slug, item.qty + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#f1f4fa] transition-colors cursor-pointer font-bold text-[#11151c]"
                >
                  +
                </button>
              </div>

              <span className="font-['Inter',sans-serif] font-bold text-[16px] text-[#11151c] w-[110px] text-right">
                {rupiah(item.price * item.qty)}
              </span>

              <button
                type="button"
                onClick={() => removeItem(item.slug)}
                aria-label="Hapus"
                className="text-[#889bbf] hover:text-red-600 transition-colors cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6" style={{ borderTop: "2px solid #e6ecf7" }}>
          <span className="font-['Inter',sans-serif] font-medium text-[16px] text-[#3b4963]">Subtotal</span>
          <span className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[22px] text-[#11151c]">
            {rupiah(subtotal)}
          </span>
        </div>

        <Link
          href="/shop/checkout"
          className="w-full md:w-fit self-end bg-[#11151c] rounded-[8px] px-9 py-4 text-white font-['Inter',sans-serif] font-semibold text-[16px] text-center hover:opacity-90 transition-opacity"
        >
          Lanjut ke Pembayaran
        </Link>
      </div>
    </section>
  );
}
