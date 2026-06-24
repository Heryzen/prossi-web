export function TreatmentsHero() {
  return (
    <div className="relative w-full h-[440px] overflow-hidden rounded-b-[100px]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/figma/imgProgramImage1.png')" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(270deg, rgba(226,146,51,0) 30%, rgba(226,146,51,0.6) 41%, rgba(226,146,51,0.82) 53%, rgba(226,146,51,1) 100%)"
      }} />
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-[42px] px-6 md:px-[100px] pt-[172px] max-w-[813px]">
        <div className="flex flex-col gap-4">
          <h1 className="font-['Source_Serif_4',serif] font-normal text-[36px] md:text-[45px] leading-tight text-white">
            Perjalanan Menuju Tubuh Ideal Dimulai dari Satu Langkah yang Tepat
          </h1>
          <p className="font-['Inter',sans-serif] text-[16px] md:text-[18px] text-white/90">
            Prossi Clinic mampu membantu pria dan wanita meraih tubuh ideal melalui pendekatan holistik yang dipersonalisasi, didukung oleh dokter profesional dengan hasil nyata.
          </p>
        </div>
      </div>
    </div>
  );
}
