"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export type Review = {
  text: string;
  location: string;
  name: string;
  avatar: string;
  image: string | null;
  videoUrl?: string | null;
  rating?: number;
};

function DefaultMedia() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #f4ece4 0%, #e8d9bd 100%)" }}
    >
      <span className="font-serif font-semibold text-[22px] text-[#b59637] opacity-60">PROSSI</span>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="32" height="32" viewBox="0 0 24 24" fill={i < count ? "#FFD665" : "#e5ddd0"}>
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  if (src) {
    return <img src={src} alt={name} className="w-[62px] h-[62px] rounded-full object-cover" />;
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-[62px] h-[62px] rounded-full bg-[#b59637] flex items-center justify-center text-white font-semibold text-lg shrink-0">
      {initials}
    </div>
  );
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url);
}

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="ml-1">
      <path d="M8 5v14l11-7z" fill="#120f0b" />
    </svg>
  );
}

export function Testimonials({ reviews: reviewsProp }: { reviews?: Review[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!activeVideo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideo]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const defaultReviews: Review[] = [
    {
      text: `"What separates this team is they don't chase trends. No one tried to sell me peptides or stacks. They measured, waited for the data, and prescribed exactly three interventions. One year later, those three interventions have changed my trajectory. That's the difference between medicine and marketing."`,
      location: "NEW YORK, USA",
      name: "Camelia H.",
      avatar: "/figma/imgImagePlaceholder.webp",
      image: "/figma/imgFrame1618873278.webp"
    },
    {
      text: `"I came in feeling fine. I left with a clear understanding of exactly where my biology is headed if I don't intervene. Six months later, my metabolic markers have reversed direction, my sleep is actually restorative, and I've dropped eight pounds without trying. The data didn't lie."`,
      location: "NEW YORK, USA",
      name: "Jessica T.",
      avatar: "/figma/imgImagePlaceholder.webp",
      image: "/figma/imgFrame1618873277.webp"
    },
    {
      text: `"I've done executive health screenings across three continents. This was the first time a physician spent 90 minutes walking me through my results — not just the numbers, but what they actually mean for how I'll feel in ten years. The imaging revealed what physicals have been missing for decades."`,
      location: "SAN FRANCISCO, USA",
      name: "Michael R.",
      avatar: "/figma/imgImagePlaceholder1.webp",
      image: "/figma/imgFrame1618873279.webp"
    }
  ];

  const reviews = reviewsProp && reviewsProp.length > 0 ? reviewsProp : defaultReviews;

  return (
    <section className="relative w-full py-12 lg:py-[100px] overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#f4ece4]"></div>
        <div className="absolute inset-0 opacity-20 overflow-hidden">
           <img src="/figma/imgTestimonials.webp" alt="" className="absolute w-full h-full object-cover mix-blend-multiply" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1440px] w-full flex flex-col items-center gap-[60px] px-6 lg:px-[100px]">
        <div className="flex flex-col items-center gap-6 w-full text-center max-w-[1019px]">
          <div className="flex gap-[16px] items-center justify-center overflow-clip relative shrink-0">
            <div className="h-0 relative shrink-0 w-[63px]">
              <div className="absolute inset-[-5.77px_-9.16%_-5.77px_0]">
                <img alt="" className="block max-w-none size-full" src="/figma/imgLine4.svg" />
              </div>
            </div>
            <span className="font-['Inter'] font-semibold leading-normal not-italic relative shrink-0 text-[14px] text-[#120f0b] whitespace-nowrap">TESTIMONIALS</span>
            <div className="flex items-center justify-center relative shrink-0">
              <div className="-scale-y-100 flex-none rotate-180">
                <div className="h-0 relative w-[63px]">
                  <div className="absolute inset-[-5.77px_-9.16%_-5.77px_0]">
                    <img alt="" className="block max-w-none size-full" src="/figma/imgLine2.svg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-[#120f0b] capitalize">
            Voices of Transformation
          </h2>
          <p className="font-sans text-lg text-[#120f0b]">
            Hear from those who have invested in their long-term vitality.
          </p>
        </div>

        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 -ml-6">
            {reviews.map((review, i) => (
              <div key={i} className="flex-[0_0_100%] md:flex-[0_0_869px] pl-6">
                <div className="w-full bg-[#fff8f2] border border-[#deba69] rounded-[24px] p-8 flex flex-col md:flex-row gap-6 h-full">
                  <div className="flex flex-col w-full md:w-[316px] shrink-0 justify-between">
                    <div className="flex flex-col gap-4">
                      <Stars count={review.rating ?? 5} />
                      <p className="font-sans text-lg leading-relaxed text-[#120f0b]">
                        {review.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-8">
                      <Avatar src={review.avatar} name={review.name} />
                      <div className="flex flex-col gap-2 text-[#120f0b]">
                        <span className="font-sans font-semibold text-sm opacity-60 uppercase">{review.location}</span>
                        <span className="font-sans font-medium text-base">{review.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[200px] md:flex-1 md:h-[338px] rounded-xl overflow-hidden relative">
                    {review.videoUrl ? (
                      <button
                        type="button"
                        onClick={() => setActiveVideo(review.videoUrl!)}
                        aria-label={`Play video testimonial from ${review.name}`}
                        className="group absolute inset-0 w-full h-full cursor-pointer"
                      >
                        {review.image ? (
                          <img src={review.image} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
                        ) : (
                          <DefaultMedia />
                        )}
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-105 transition-all shadow-lg">
                            <PlayIcon />
                          </span>
                        </div>
                      </button>
                    ) : review.image ? (
                      <img src={review.image} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
                    ) : (
                      <DefaultMedia />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={scrollPrev} className="w-[52px] h-[52px] rounded-full bg-white/50 flex items-center justify-center hover:bg-white transition-colors cursor-pointer z-10">
             <img src="/figma/imgSystemUiconsArrowLeft.svg" alt="Previous" className="w-[26px] h-[26px]" />
          </button>
          <button onClick={scrollNext} className="w-[52px] h-[52px] rounded-full bg-[#66533b] flex items-center justify-center hover:bg-[#503d1c] transition-colors cursor-pointer z-10">
             <img src="/figma/imgSystemUiconsArrowLeft1.svg" alt="Next" className="w-[26px] h-[26px] rotate-180" />
          </button>
        </div>
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-[900px] aspect-video bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {isDirectVideo(activeVideo) ? (
              <video src={activeVideo} controls autoPlay className="absolute inset-0 w-full h-full object-contain" />
            ) : (
              <iframe
                src={activeVideo}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            )}
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 transition-colors flex items-center justify-center text-white cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
