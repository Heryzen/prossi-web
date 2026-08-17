const advantages = [
  {
    title: "Ditangani oleh Profesional",
    desc: "Selain ruangan yang disterilisasi secara berkala, seluruh karyawan juga selalu diperhatikan kesehatannya demi menjaga keamanan pasien saat berkunjung",
  },
  {
    title: "Hasil Nyata",
    desc: "Memberikan solusi dan hasil perawatan yang nyata karena didukung oleh peralatan berkualitas dan tenaga kesehatan berpengalaman",
  },
  {
    title: "Nyaman",
    desc: "Tersedia ruangan yang bersih dan nyaman untuk dikunjungi. Juga menjamin kenyamanan pasien dengan meminimalisir rasa sakit saat perawatan",
  },
  {
    title: "Harga Terbaik",
    desc: "Memberikan perawatan terbaik dengan harga bersaing. Selalu ada penawaran menarik setiap bulannya",
  },
  {
    title: "Aman",
    desc: "Dokter spesialis sebagai penanggung jawab dan perawatan yang dipastikan sudah memenuhi standar operasional kesehatan nasional",
  },
];

export function CompareSection() {
  return (
    <section className="w-full pt-[64px] pb-[64px] px-6 md:px-[120px] bg-[#b59637]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10">
        {/* Left */}
        <div className="flex flex-col gap-3 md:w-[360px] shrink-0">
          <h2 className="font-['Source_Serif_4',serif] font-normal text-[40px] leading-[56px] tracking-[0.0125em] text-white">
            Apa Yang Membuat Perawatan Kami Berbeda
          </h2>
          <p className="font-['Inter',sans-serif] text-[18px] text-white/90">
            Pendekatan yang memastikan setiap treatment sesuai dengan kondisi Anda aman, terarah, dan dapat dipantau.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-0 flex-1">
          {advantages.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-4 border-b border-white/20 last:border-0">
              <svg className="shrink-0 mt-0.5" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="11" fill="rgba(255,255,255,0.2)" />
                <path d="M6.5 11L9.5 14L15.5 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col gap-1">
                <span className="font-['Lato',sans-serif] font-extrabold text-[16px] text-white leading-[22px]">
                  {item.title}
                </span>
                <span className="font-['Readex_Pro',sans-serif] text-[16px] text-white/90 leading-[22px]">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-9 py-[18px] rounded-full font-['Source_Serif_4',serif] font-semibold text-[18px] text-white border border-[#ecd5a5] bg-[#b59637] hover:opacity-90 transition-opacity"
            >
              Reservation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
