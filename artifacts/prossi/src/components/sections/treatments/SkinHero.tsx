export function SkinHero() {
  return (
    <div className="relative w-full overflow-hidden rounded-b-[100px] h-[400px] md:h-[560px]">
      <img
        src="/figma/imgSkinHeroFull.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="relative z-10 flex flex-col gap-4 px-6 pt-[120px] pb-12 md:pl-[100px] md:pr-10 md:pt-[172px] md:pb-[60px]" style={{ maxWidth: 813 }}>
        <h1
          className="font-['Source_Serif_4',serif] font-normal text-white leading-tight"
          style={{ fontSize: "clamp(26px, 7vw, 45px)" }}
        >
          Perawatan yang Tepat Untuk Kulit yang Sehat
        </h1>
        <p
          className="font-['Inter',sans-serif] font-normal text-white"
          style={{ fontSize: "clamp(14px, 4vw, 18px)", lineHeight: "1.6" }}
        >
          Prossi Clinic membantu pria dan wanita mendapatkan kulit sehat dan terawat melalui pendekatan medis yang dipersonalisasi, ditangani langsung oleh Dokter Sp.DVE dengan hasil nyata, aman, dan terarah.
        </p>
      </div>
    </div>
  );
}
