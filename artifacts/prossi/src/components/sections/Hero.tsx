import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full h-[880px] flex items-center justify-center pt-[79px]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="/figma/imgBackground1.webp" alt="" className="absolute h-full w-full object-cover prossi-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4ece4] from-[14%] via-[#f4ece4]/85 via-[48%] to-transparent to-[62%]"></div>
      </div>

      <div className="relative z-10 max-w-[816px] flex flex-col items-center gap-[42px] px-6 text-center mt-[-168px]">
        <div className="flex flex-col gap-4 items-center w-full">
          <h1 className="prossi-fade-up font-serif text-[40px] md:text-[64px] leading-tight text-[#503d1c]" style={{ animationDelay: "120ms" }}>
            Kulit Lebih Sehat. Tubuh Lebih Ideal. Dengan Pendekatan medis yang <span className="font-['Arizonia'] text-[#b59637]">Tepat</span>
          </h1>
          <p className="prossi-fade-up font-sans text-lg text-[#503d1c]" style={{ animationDelay: "260ms" }}>
            Perawatan langsung oleh dokter spesialis dengan diagnosis yang akurat dan hasil yang terarah.
          </p>
        </div>

        <Link href="/treatments" className="prossi-fade-up bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 hover:scale-[1.03] transition-all duration-300" style={{ animationDelay: "400ms" }}>
          Explore Treatments
        </Link>
      </div>

      <div className="absolute bottom-[64px] left-1/2 -translate-x-1/2 flex items-center gap-6">
        <button className="w-[52px] h-[52px] rounded-full bg-white/50 flex items-center justify-center hover:bg-white transition-colors cursor-pointer">
          <img src="/figma/imgSystemUiconsArrowLeft.svg" alt="Previous" className="w-[26px] h-[26px]" />
        </button>
        <button className="w-[52px] h-[52px] rounded-full bg-[#66533b] flex items-center justify-center hover:bg-[#503d1c] transition-colors cursor-pointer">
          <img src="/figma/imgSystemUiconsArrowLeft1.svg" alt="Next" className="w-[26px] h-[26px] rotate-180" />
        </button>
      </div>
    </section>
  );
}
