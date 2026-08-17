import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan | Prossi Clinic",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4ece4] px-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-[480px]">
        <span className="font-serif font-semibold text-[64px] text-[#b59637] leading-none">404</span>
        <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[24px] text-[#11151c]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="font-['Inter',sans-serif] text-[16px] text-[#3b4963]">
          Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          href="/"
          className="bg-[#b59637] rounded-[100px] px-9 py-4 text-white font-['Inter',sans-serif] font-semibold text-[16px] hover:opacity-90 transition-opacity"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
