import Link from "next/link";

export default function DoctorCategoryPage({ params }: { params: { slug: string } }) {
  const labels: Record<string, string> = {
    "dokter-spesialis-gizi-klinik": "Dokter Spesialis Gizi Klinik",
    "dokter-spesialis-dve": "Dokter Spesialis DVE",
    "dokter-umum": "Dokter Umum",
  };

  const label = labels[params.slug] ?? "Dokter";

  return (
    <main className="min-h-screen bg-[#f4ece4] flex flex-col items-center justify-center px-6 pt-[120px] pb-[80px]">
      <div className="max-w-[600px] w-full flex flex-col items-center gap-8 text-center">
        <h1 className="font-serif font-semibold text-[48px] text-[#503d1c]">{label}</h1>
        <p className="font-sans text-lg text-[#503d1c]/70">
          Halaman ini sedang dalam pengembangan. Lihat semua dokter kami di halaman Doctors.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/doctors" className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity">
            Lihat Semua Dokter
          </Link>
          <Link href="/contact" className="border border-[#b59637] rounded-full px-9 py-[18px] text-[#b59637] font-serif font-semibold text-lg hover:bg-[#b59637] hover:text-white transition-colors">
            Reservasi
          </Link>
        </div>
      </div>
    </main>
  );
}
