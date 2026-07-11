"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4ece4] px-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-[480px]">
        <span className="font-serif font-semibold text-[48px] text-[#b59637] leading-none">Oops</span>
        <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[22px] text-[#11151c]">
          Terjadi Kesalahan
        </h1>
        <p className="font-['Inter',sans-serif] text-[16px] text-[#3b4963]">
          Halaman ini mengalami gangguan sementara. Silakan coba lagi.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-[#b59637] rounded-[100px] px-8 py-3 text-white font-['Inter',sans-serif] font-semibold text-[15px] hover:opacity-90 transition-opacity cursor-pointer"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="border-2 border-[#b59637] text-[#b59637] rounded-[100px] px-8 py-3 font-['Inter',sans-serif] font-semibold text-[15px] hover:bg-[#b59637]/10 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
