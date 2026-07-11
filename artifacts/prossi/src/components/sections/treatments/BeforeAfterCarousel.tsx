"use client";

import { useRef } from "react";

export type BeforeAfterPair = { before: string; after: string };

const CARD_WIDTH = 717 + 36; // card width + gap

export function BeforeAfterCarousel({ pairs }: { pairs: BeforeAfterPair[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "next" ? CARD_WIDTH : -CARD_WIDTH,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-9 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {pairs.map((pair, i) => (
          <div key={i} className="flex-none w-[717px] h-[536px] bg-white rounded-[12px] overflow-hidden flex">
            <div className="relative w-1/2 h-full">
              <img src={pair.before} alt="Before" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-black/60 text-white text-[12px] font-semibold uppercase px-3 py-1 rounded-full">
                Before
              </span>
            </div>
            <div className="relative w-1/2 h-full">
              <img src={pair.after} alt="After" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#b59637] text-white text-[12px] font-semibold uppercase px-3 py-1 rounded-full">
                After
              </span>
            </div>
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
    </>
  );
}
