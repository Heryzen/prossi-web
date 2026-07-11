"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type Product = {
  slug: string;
  name: string;
  priceLabel: string;
  img: string | null;
  category: string | null;
};

function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className="bg-white border border-[#e6ecf7] rounded-[20px] overflow-hidden flex flex-col"
      style={{ boxShadow: "0px 4px 4px -4px rgba(12,12,13,0.05), 0px 16px 16px -8px rgba(12,12,13,0.1)" }}
    >
      <Link href={`/shop/${product.slug}`} className="w-full h-[234px] shrink-0 overflow-hidden block">
        {product.img ? (
          <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(180deg, #f4ece4 0%, #e8d9bd 100%)" }}
          >
            <span className="font-serif font-semibold text-[22px] text-[#b59637] opacity-60">PROSSI</span>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-4 px-5 py-6 flex-1">
        <Link href={`/shop/${product.slug}`}>
          <p className="font-['Lato',sans-serif] text-[18px] leading-[30px] text-[#11151c] hover:opacity-70 transition-opacity">
            <span className="font-extrabold">PROSSI CLINIC </span>
            {product.name}
          </p>
        </Link>

        <div className="mt-auto flex flex-col gap-4">
          <div style={{ borderTop: "1px dashed #c8cef4" }} />
          <p className="font-['Inter',sans-serif] font-bold text-[20px] leading-6 text-[#11151c]" style={{ letterSpacing: "0.0075em" }}>
            {product.priceLabel}
          </p>
          <Link
            href={`/shop/${product.slug}`}
            className="w-full bg-[#b59637] rounded-[100px] px-4 py-3 text-white font-['Inter',sans-serif] font-semibold text-[14px] leading-[22px] text-center hover:opacity-90 transition-opacity block"
            style={{ boxShadow: "0px 2px 0px rgba(0,0,0,0.04)" }}
          >
            Beli Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ShopGrid({ products, categories }: { products: Product[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !activeCategory || p.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, activeCategory]);

  return (
    <div className="max-w-[1120px] mx-auto flex flex-col gap-8">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-[320px]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="7" stroke="#889bbf" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="#889bbf" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full border border-[#e6ecf7] rounded-[100px] pl-11 pr-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#11151c] placeholder:text-[#889bbf] outline-none focus:border-[#b59637] transition-colors"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="px-5 py-2 rounded-[100px] font-['Inter',sans-serif] font-medium text-[14px] transition-colors cursor-pointer"
            style={
              activeCategory === null
                ? { background: "#b59637", color: "#fff" }
                : { background: "#f4ece4", color: "#11151c" }
            }
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-[100px] font-['Inter',sans-serif] font-medium text-[14px] transition-colors cursor-pointer"
              style={
                activeCategory === cat
                  ? { background: "#b59637", color: "#fff" }
                  : { background: "#f4ece4", color: "#11151c" }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-['Inter',sans-serif] text-[16px] text-[#889bbf] text-center py-12">
          Tidak ada produk yang cocok.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
