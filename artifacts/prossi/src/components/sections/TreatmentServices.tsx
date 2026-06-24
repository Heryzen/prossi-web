import React from "react";

const treatments = [
  {
    title: "Konsultasi Dengan Dokter Sp.GK",
    desc: "Konsultasi langsung dengan dokter spesialis gizi klinik untuk mengetahui kondisi tubuhmu secara mendalam, mencakup evaluasi berat badan, komposisi tubuh, riwayat kesehatan, dan pola makan sehari-hari.",
    img: "/figma/imgProgramImage.png",
  },
  {
    title: "Slimming Program Dengan Dokter Sp.GK",
    desc: "Slimming Program di Prossi Clinic adalah program penurunan berat badan secara medis dan terstruktur yang ditangani langsung oleh dokter spesialis gizi klinik. Program ini tidak hanya berfokus pada penurunan angka di timbangan, tetapi juga memperbaiki komposisi tubuh, metabolisme, dan kesehatan dalam secara menyeluruh.",
    img: "/figma/imgProgramImage1.png",
  },
  {
    title: "Prossi Gene",
    desc: "Prossi Gene adalah layanan cek genetik yang membantu memahami apa yang dibutuhkan tubuhmu dari metabolisme, nutrisi, hingga gaya hidup terbaik sesuai DNA-mu.",
    img: "/figma/imgProgramImage2.png",
  },
  {
    title: "Pro Sila",
    desc: "Pro Sila adalah layanan untuk membantumu mendapatkan tubuh ideal dengan program yang disesuaikan.",
    img: "/figma/imgProgramImage.png",
  },
  {
    title: "Premium Slim Solution & Fat Burn Treatment Package (PFTP)",
    desc: "Fat Burn Treatment Package adalah paket perawatan penurunan berat badan berkecepatan tinggi slimming.",
    img: "/figma/imgProgramImage1.png",
  },
  {
    title: "ProssiConsult+ By Sp.GK",
    desc: "Untuk kamu yang berada jauh dari cabang Prossi Clinic, kini tersedia layanan Prossi Consult+, sesi konsultasi slimming dan solusi kesehatan secara online bersama dokter Spesialis Gizi Klinik (Sp.GK).",
    img: "/figma/imgProgramImage2.png",
  },
];

export function TreatmentServices() {
  return (
    <section className="bg-[#c26345] w-full py-20 px-6 md:px-[100px] text-white">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <span className="text-[#ecd5a5] font-semibold text-sm uppercase tracking-wider bg-[#a04e33] px-4 py-1 rounded-full">Slimming Program</span>
          <h2 className="font-serif font-semibold text-[32px] md:text-[46px] mt-4 mb-4">
            Pilih Perawatan Sesuai Kebutuhan Anda
          </h2>
          <p className="font-sans text-lg text-white/90">
            Setiap kategori dirancang untuk membantu Anda menemukan solusi yang paling sesuai dengan kondisi Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {treatments.map((t, i) => (
            <div key={i} className="bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row group hover:shadow-xl transition-shadow">
              <div className="w-full md:w-[280px] h-[200px] md:h-auto shrink-0">
                <img src={t.img} alt={t.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col gap-3 text-[#120f0b]">
                <h3 className="font-serif font-semibold text-[20px] leading-tight group-hover:text-[#b59637] transition-colors">
                  {t.title}
                </h3>
                <p className="font-sans text-[15px] text-[#503d1c]/80 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
