"use client";

import { useEffect, useRef, useState } from "react";

export type BeforeAfterPair = { before: string; after: string };

const GAP_PX = 36;

export function BeforeAfterCarousel({ pairs }: { pairs: BeforeAfterPair[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [spacerWidth, setSpacerWidth] = useState(0);

  // Lets the last card scroll fully into view (flush) even when the
  // viewport is wider than one card, instead of clamping mid-card.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateSpacer = () => {
      const card = container.querySelector<HTMLElement>("[data-before-after-card]");
      if (!card) return;
      // Subtract GAP_PX to offset the flex `gap` the browser inserts
      // between the last card and this spacer.
      setSpacerWidth(Math.max(0, container.clientWidth - card.offsetWidth - GAP_PX));
    };

    updateSpacer();
    const observer = new ResizeObserver(updateSpacer);
    observer.observe(container);
    return () => observer.disconnect();
  }, [pairs.length]);

  const scroll = (dir: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>("[data-before-after-card]");
    const step = (card?.offsetWidth ?? container.clientWidth) + GAP_PX;
    container.scrollBy({
      left: dir === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-9 overflow-x-auto pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {pairs.map((pair, i) => (
          <div
            key={i}
            data-before-after-card
            className="flex-none w-[85vw] max-w-[717px] h-[280px] md:w-[717px] md:h-[536px] bg-white rounded-[12px] overflow-hidden flex snap-start"
          >
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
        {spacerWidth > 0 && <div aria-hidden className="flex-none" style={{ width: spacerWidth }} />}
      </div>

      <div className="flex items-center gap-6 justify-center">
        <button
          onClick={() => scroll("prev")}
          className="w-[52px] h-[52px] rounded-full bg-white/50 flex items-center justify-center hover:bg-white/80 transition-colors cursor-pointer"
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#66533B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => scroll("next")}
          className="w-[52px] h-[52px] rounded-full bg-[#66533b] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
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
