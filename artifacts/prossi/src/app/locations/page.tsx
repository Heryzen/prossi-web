import Link from "next/link";

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-[#f4ece4] flex flex-col items-center justify-center px-6 pt-[120px] pb-[80px]">
      <div className="max-w-[600px] w-full flex flex-col items-center gap-8 text-center">
        <h1 className="font-serif font-semibold text-[48px] text-[#503d1c]">Locations</h1>
        <p className="font-sans text-lg text-[#503d1c]/70">
          Halaman lokasi klinik sedang dalam pengembangan. Untuk informasi lokasi, silakan hubungi kami langsung.
        </p>
        <Link href="/contact" className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity">
          Hubungi Kami
        </Link>
      </div>
    </main>
  );
}
