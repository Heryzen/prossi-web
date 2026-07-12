import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan layanan Prossi Clinic.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f4ece4] flex flex-col items-center justify-center px-6 pt-[120px] pb-[80px]">
      <div className="max-w-[600px] w-full flex flex-col items-center gap-8 text-center">
        <h1 className="font-serif font-semibold text-[48px] text-[#503d1c]">Terms of Use</h1>
        <p className="font-sans text-lg text-[#503d1c]/70">
          Halaman syarat & ketentuan sedang dalam pengembangan.
        </p>
        <Link href="/" className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
