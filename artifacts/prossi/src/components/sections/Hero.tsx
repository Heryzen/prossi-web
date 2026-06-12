import React from "react";
import imgBackground1 from "@/assets/figma/imgBackground1.png";
import imgFrame1618873279 from "@/assets/figma/imgFrame1618873279.jpg";

export function Hero() {
  return (
    <section className="relative w-full h-[880px] flex items-center justify-center pt-[79px]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src={imgBackground1} alt="" className="absolute h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4ece4] from-[14%] via-[#f4ece4]/85 via-[48%] to-transparent to-[62%]"></div>
      </div>
      
      <div className="relative z-10 max-w-[816px] flex flex-col items-center gap-[42px] px-6 text-center mt-[-168px]">
        <div className="flex flex-col gap-4 items-center w-full">
          <h1 className="font-serif text-[40px] md:text-[64px] leading-tight text-[#120f0b]">
            Kulit Lebih Sehat. Tubuh Lebih Ideal. Dengan Pendekatan medis yang <span className="font-['Arizonia'] text-[#b59637]">Tepat</span>
          </h1>
          <p className="font-sans text-lg text-[#120f0b]">
            Perawatan langsung oleh dokter spesialis dengan diagnosis yang akurat dan hasil yang terarah.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-gradient-to-r from-[#e5be80] via-[#edd8ab] to-[#e5be80] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-[#503d1c] font-serif font-semibold text-lg hover:opacity-90 transition-opacity">
            Konsultasi Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
