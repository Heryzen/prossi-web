export function TreatmentsHero() {
  return (
    <div className="relative w-full overflow-hidden rounded-b-[100px] h-[400px] md:h-[560px]">
      {/* Background image — stretch to fill like Figma */}
      <img
        src="/figma/imgHeroTreatments-31d3d2.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-right"
      />
      {/* Gradient overlay — solid amber on left, transparent on right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(226,146,51,0) 30%, rgba(226,146,51,0.6) 41%, rgba(226,146,51,0.82) 53%, rgba(226,146,51,1) 100%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 px-6 pt-[120px] pb-12 md:pl-[100px] md:pr-10 md:pt-[172px] md:pb-[60px]" style={{ maxWidth: "813px" }}>
        <h1
          className="font-['Source_Serif_4',serif] font-normal text-white leading-tight"
          style={{ fontSize: "clamp(26px, 7vw, 45px)" }}
        >
          Perjalanan Menuju Tubuh Ideal Dimulai dari Satu Langkah yang Tepat
        </h1>
        <p
          className="font-['Inter',sans-serif] text-white"
          style={{ fontSize: "clamp(14px, 4vw, 18px)", lineHeight: "1.6" }}
        >
          Prossi Clinic mampu membantu pria dan wanita meraih tubuh ideal melalui pendekatan holistik yang dipersonalisasi, didukung oleh dokter profesional dengan hasil nyata.
        </p>
      </div>
    </div>
  );
}
