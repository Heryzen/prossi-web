"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export function CTA() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const slides = [1, 2];

  return (
    <section className="bg-[#f4ece4] w-full py-[100px] px-6 flex justify-center overflow-hidden">
      <div className="max-w-[1240px] w-full flex flex-col gap-6">
        <div className="w-full relative rounded-[32px] overflow-hidden bg-transparent" ref={emblaRef}>
          <div className="flex">
            {slides.map((_, index) => (
              <div key={index} className="flex-[0_0_100%] h-[423px] relative border border-[#deba69] rounded-[32px] overflow-hidden mx-2">
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-[#f1e7da]"></div>
                  <img src="/figma/imgBackground.png" alt="" className="absolute w-full h-full object-cover mix-blend-multiply opacity-50" />
                  <div className="absolute inset-y-0 right-0 w-[60%] flex items-center justify-center">
                    <img src="/figma/imgObject.png" alt="" className="w-full h-full object-contain object-right opacity-80" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f1e7da] from-[40%] to-transparent"></div>
                </div>

                <div className="relative z-10 w-full md:w-[547px] h-full flex flex-col justify-center px-8 md:px-[60px] py-8">
                  <div className="flex gap-[16px] items-center justify-center overflow-clip relative shrink-0 mb-6">
                    <div className="h-0 relative shrink-0 w-[63px]">
                      <div className="absolute inset-[-5.77px_-9.16%_-5.77px_0]">
                        <img alt="" className="block max-w-none size-full" src="/figma/imgLine4.svg" />
                      </div>
                    </div>
                    <span className="font-['Inter'] font-semibold leading-normal not-italic relative shrink-0 text-[14px] text-[#120f0b] whitespace-nowrap">Promo</span>
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
                  <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-[#120f0b] capitalize leading-tight mb-6">
                    Designed for People Who Expect Clarity
                  </h2>
                  <p className="font-sans text-lg text-[#120f0b] mb-8">
                    If you value evidence, privacy, and a structured plan, we're ready to support your next phase.
                  </p>
                  <button className="bg-gradient-to-r from-[#e5be80] via-[#edd8ab] to-[#e5be80] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-[#503d1c] font-serif font-semibold text-lg hover:opacity-90 transition-opacity w-fit">
                    View Offers
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 self-end px-4">
          <button onClick={scrollPrev} className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center hover:bg-[#f1e7da] transition-colors cursor-pointer z-10 shadow-sm border border-[#deba69]">
             <img src="/figma/imgSystemUiconsArrowLeft.svg" alt="Previous" className="w-[26px] h-[26px] text-[#503d1c]" />
          </button>
          <button onClick={scrollNext} className="w-[52px] h-[52px] rounded-full bg-[#66533b] flex items-center justify-center hover:bg-[#503d1c] transition-colors cursor-pointer z-10 shadow-sm">
             <img src="/figma/imgSystemUiconsArrowLeft1.svg" alt="Next" className="w-[26px] h-[26px] rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}
