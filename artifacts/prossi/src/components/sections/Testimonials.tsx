import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import imgLine4 from "@/assets/figma/imgLine4.svg";
import imgLine2 from "@/assets/figma/imgLine2.svg";
import imgTestimonials from "@/assets/figma/imgTestimonials.jpg";
import imgStars from "@/assets/figma/imgStars.svg";
import imgImagePlaceholder from "@/assets/figma/imgImagePlaceholder.png";
import imgImagePlaceholder1 from "@/assets/figma/imgImagePlaceholder1.png";
import imgFrame1618873278 from "@/assets/figma/imgFrame1618873278.jpg";
import imgFrame1618873277 from "@/assets/figma/imgFrame1618873277.jpg";
import imgFrame1618873279 from "@/assets/figma/imgFrame1618873279.jpg";
import imgSystemUiconsArrowLeft from "@/assets/figma/imgSystemUiconsArrowLeft.svg";
import imgSystemUiconsArrowLeft1 from "@/assets/figma/imgSystemUiconsArrowLeft1.svg";

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const reviews = [
    {
      text: `"What separates this team is they don't chase trends. No one tried to sell me peptides or stacks. They measured, waited for the data, and prescribed exactly three interventions. One year later, those three interventions have changed my trajectory. That's the difference between medicine and marketing."`,
      location: "NEW YORK, USA",
      name: "Camelia H.",
      avatar: imgImagePlaceholder,
      image: imgFrame1618873278
    },
    {
      text: `"I came in feeling fine. I left with a clear understanding of exactly where my biology is headed if I don't intervene. Six months later, my metabolic markers have reversed direction, my sleep is actually restorative, and I've dropped eight pounds without trying. The data didn't lie."`,
      location: "NEW YORK, USA",
      name: "Jessica T.",
      avatar: imgImagePlaceholder,
      image: imgFrame1618873277
    },
    {
      text: `"I've done executive health screenings across three continents. This was the first time a physician spent 90 minutes walking me through my results — not just the numbers, but what they actually mean for how I'll feel in ten years. The imaging revealed what physicals have been missing for decades."`,
      location: "SAN FRANCISCO, USA",
      name: "Michael R.",
      avatar: imgImagePlaceholder1,
      image: imgFrame1618873279
    }
  ];

  return (
    <section className="relative w-full py-[100px] overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#f4ece4]"></div>
        <div className="absolute inset-0 opacity-20 overflow-hidden">
           <img src={imgTestimonials} alt="" className="absolute w-full h-full object-cover mix-blend-multiply" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1440px] w-full flex flex-col items-center gap-[60px] px-6 md:px-[100px]">
        <div className="flex flex-col items-center gap-6 w-full text-center max-w-[1019px]">
          <div className="flex items-center gap-4">
            <img src={imgLine4} alt="" className="w-[63px]" />
            <span className="font-sans font-semibold text-sm text-[#120f0b] tracking-widest uppercase">TESTIMONIALS</span>
            <img src={imgLine2} alt="" className="w-[63px] rotate-180" />
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
              <div key={i} className="flex-[0_0_100%] md:flex-[0_0_608px] pl-6">
                <div className="w-full bg-[#fff8f2] border border-[#deba69] rounded-[24px] p-8 flex flex-col md:flex-row gap-6 h-full">
                  <div className="flex flex-col w-full md:w-[316px] shrink-0 justify-between">
                    <div className="flex flex-col gap-4">
                      <img src={imgStars} alt="5 stars" className="w-[176px] h-[32px]" />
                      <p className="font-sans text-lg leading-relaxed text-[#120f0b]">
                        {review.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-8">
                      <img src={review.avatar} alt={review.name} className="w-[62px] h-[62px] rounded-full object-cover" />
                      <div className="flex flex-col gap-2 text-[#120f0b]">
                        <span className="font-sans font-semibold text-sm opacity-60 uppercase">{review.location}</span>
                        <span className="font-sans font-medium text-base">{review.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 h-[200px] md:h-[338px] rounded-xl overflow-hidden relative">
                    <img src={review.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={scrollPrev} className="w-[52px] h-[52px] rounded-full bg-white/50 flex items-center justify-center hover:bg-white transition-colors cursor-pointer z-10">
             <img src={imgSystemUiconsArrowLeft} alt="Previous" className="w-[26px] h-[26px]" />
          </button>
          <button onClick={scrollNext} className="w-[52px] h-[52px] rounded-full bg-[#66533b] flex items-center justify-center hover:bg-[#503d1c] transition-colors cursor-pointer z-10">
             <img src={imgSystemUiconsArrowLeft1} alt="Next" className="w-[26px] h-[26px] rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}
