"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export function AddToCartActions({
  slug,
  name,
  price,
  image,
}: {
  slug: string;
  name: string;
  price: number;
  image: string | null;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ slug, name, price, image }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 border border-[#c4cfe1] rounded-[8px] w-fit">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f4fa] transition-colors cursor-pointer font-bold text-[#11151c]"
        >
          −
        </button>
        <span className="w-10 text-center font-['Inter',sans-serif] font-medium text-[14px] text-[#11151c]">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f4fa] transition-colors cursor-pointer font-bold text-[#11151c]"
        >
          +
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="w-full sm:w-fit bg-white border-2 border-[#b59637] text-[#b59637] rounded-[100px] px-9 py-4 font-['Inter',sans-serif] font-semibold text-[16px] hover:bg-[#b59637]/10 transition-colors cursor-pointer"
        >
          {added ? "Ditambahkan ✓" : "Tambah ke Keranjang"}
        </button>
        <Link
          href={`/shop/checkout?product=${slug}&qty=${qty}`}
          className="w-full sm:w-fit bg-[#b59637] rounded-[100px] px-9 py-4 text-white font-['Inter',sans-serif] font-semibold text-[16px] text-center hover:opacity-90 transition-opacity"
          style={{ boxShadow: "0px 2px 0px rgba(0,0,0,0.04)" }}
        >
          Beli Sekarang
        </Link>
      </div>
    </div>
  );
}
