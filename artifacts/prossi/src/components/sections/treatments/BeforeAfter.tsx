"use client";

import { useRef } from "react";

const images = [
  { src: "/figma/imgBeforeAfter1-41fe45.webp", alt: "Before After 1" },
  { src: "/figma/imgBeforeAfter2-41fe45b.webp", alt: "Before After 2" },
  { src: "/figma/imgBeforeAfter1-41fe45.webp", alt: "Before After 3" },
  { src: "/figma/imgBeforeAfter2-41fe45b.webp", alt: "Before After 4" },
];

const CARD_WIDTH = 717 + 36; // card width + gap

export function BeforeAfter() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "next" ? CARD_WIDTH : -CARD_WIDTH,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#f4ece4] w-full py-[60px] px-6 md:px-[40px]">
      <div className="max-w-[1358px] mx-auto flex flex-col gap-10">
        <div className="text-center">
          <h2 className="font-['Lato',sans-serif] font-extrabold text-[60px] leading-[0.99em] uppercase text-[#b59637]">
            Before After
          </h2>
          <p className="font-['Readex_Pro',sans-serif] text-[16px] text-[#b59637] mt-2">
            Panduan Lengkap Menggunakan N3
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-9 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((img, i) => (
            <div key={i} className="flex-none w-[717px] h-[536px] bg-white rounded-[12px] overflow-hidden">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 justify-center">
          <button
            onClick={() => scroll("prev")}
            className="w-[52px] h-[52px] rounded-full bg-white/50 flex items-center justify-center hover:bg-white/80 transition-colors"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#66533B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scroll("next")}
            className="w-[52px] h-[52px] rounded-full bg-[#66533b] flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
