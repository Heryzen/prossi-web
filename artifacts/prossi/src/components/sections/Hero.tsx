"use client";

import Link from "next/link";
import { useState, useCallback, type ReactNode } from "react";

export type HeroSlide = {
  img: string;
  heading: ReactNode;
  sub: string;
};

const defaultSlides: HeroSlide[] = [
  {
    img: "/figma/imgBackground1.webp",
    heading: (
      <>
        Kulit Lebih Sehat. Tubuh Lebih Ideal. Dengan Pendekatan medis yang{" "}
        <span className="font-['Arizonia'] text-[#b59637]">Tepat</span>
      </>
    ),
    sub: "Perawatan langsung oleh dokter spesialis dengan diagnosis yang akurat dan hasil yang terarah.",
  },
  {
    img: "/figma/imgBackground1.webp",
    heading: (
      <>
        Perjalanan Menuju Tubuh Ideal Dimulai dari Satu Langkah yang{" "}
        <span className="font-['Arizonia'] text-[#b59637]">Tepat</span>
      </>
    ),
    sub: "Prossi Clinic hadir dengan program slimming berbasis medis, ditangani langsung oleh Dokter Sp.GK.",
  },
  {
    img: "/figma/imgBackground1.webp",
    heading: (
      <>
        Kulit Sehat &amp; Bercahaya dengan Perawatan{" "}
        <span className="font-['Arizonia'] text-[#b59637]">Medis</span>
      </>
    ),
    sub: "Skin treatment oleh Dokter Sp.DVE dan Dokter Estetika untuk hasil yang aman, terarah, dan nyata.",
  },
];

export function Hero({ slides: slidesProp }: { slides?: HeroSlide[] }) {
  const slides = slidesProp && slidesProp.length > 0 ? slidesProp : defaultSlides;
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Sliding track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative w-full shrink-0 overflow-hidden">
            {/* Background image */}
            <img
              src={slide.img}
              alt=""
              className="w-full h-[560px] object-cover object-center lg:h-auto lg:object-fill block prossi-kenburns"
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(244,236,228,1) 14%, rgba(244,236,228,0.85) 48%, rgba(244,236,228,0) 62%)",
              }}
            />

            {/* Content */}
            <div className="absolute inset-0 z-10 flex items-start justify-center">
              <div className="max-w-[816px] w-full flex flex-col items-center gap-5 lg:gap-[42px] px-6 lg:px-0 text-center pt-[80px] lg:pt-[161px]">
                <div className="flex flex-col gap-3 lg:gap-4 items-center w-full">
                  <h1 className="prossi-fade-up font-['Source_Serif_4',serif] font-normal text-[28px] lg:text-[64px] leading-tight lg:leading-[1.15] text-[#503d1c]">
                    {slide.heading}
                  </h1>
                  <p className="prossi-fade-up font-['Inter',sans-serif] text-sm lg:text-[18px] text-[#503d1c] lg:whitespace-nowrap">
                    {slide.sub}
                  </p>
                </div>
                <Link
                  href="/treatments"
                  className="prossi-fade-up bg-[#b59637] border border-[#ecd5a5] rounded-full px-6 py-3 lg:px-9 lg:py-[18px] text-white font-serif font-semibold text-sm lg:text-lg hover:opacity-90 hover:scale-[1.03] transition-all duration-300"
                >
                  Explore Treatments
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow navigation — desktop only */}
      <div className="hidden lg:flex absolute bottom-[92px] left-1/2 -translate-x-1/2 z-20 items-center gap-6">
        <button
          type="button"
          onClick={prev}
          className="w-[52px] h-[52px] rounded-full bg-white/50 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
        >
          <img src="/figma/imgSystemUiconsArrowLeft.svg" alt="Previous" className="w-[26px] h-[26px]" />
        </button>
        <button
          type="button"
          onClick={next}
          className="w-[52px] h-[52px] rounded-full bg-[#66533b] flex items-center justify-center hover:bg-[#503d1c] transition-colors cursor-pointer"
        >
          <img src="/figma/imgSystemUiconsArrowLeft1.svg" alt="Next" className="w-[26px] h-[26px] rotate-180" />
        </button>
      </div>

      {/* Mobile arrows */}
      <div className="flex lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-20 items-center gap-4">
        <button
          type="button"
          onClick={prev}
          className="w-[44px] h-[44px] rounded-full bg-white/50 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
        >
          <img src="/figma/imgSystemUiconsArrowLeft.svg" alt="Previous" className="w-[22px] h-[22px]" />
        </button>
        <button
          type="button"
          onClick={next}
          className="w-[44px] h-[44px] rounded-full bg-[#66533b] flex items-center justify-center hover:bg-[#503d1c] transition-colors cursor-pointer"
        >
          <img src="/figma/imgSystemUiconsArrowLeft1.svg" alt="Next" className="w-[22px] h-[22px] rotate-180" />
        </button>
      </div>
    </section>
  );
}
