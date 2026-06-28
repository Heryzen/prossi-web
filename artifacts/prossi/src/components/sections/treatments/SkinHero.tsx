export function SkinHero() {
  return (
    <div className="relative w-full overflow-hidden rounded-b-[100px]" style={{ minHeight: 500 }}>
      <img
        src="/figma/imgSkinHeroFull.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Content — x:100, y:220, width:713 */}
      <div
        className="relative z-10 flex flex-col gap-[16px]"
        style={{ paddingLeft: 100, paddingTop: 172, paddingRight: 40, paddingBottom: 60, maxWidth: 813 }}
      >
        <h1
          className="font-['Source_Serif_4',serif] font-normal text-white leading-tight"
          style={{ fontSize: 45 }}
        >
          Perawatan yang Tepat Untuk Kulit yang Sehat
        </h1>
        <p
          className="font-['Inter',sans-serif] font-normal text-white"
          style={{ fontSize: 18, lineHeight: "1.6" }}
        >
          Prossi Clinic membantu pria dan wanita mendapatkan kulit sehat dan terawat melalui pendekatan medis yang dipersonalisasi, ditangani langsung oleh Dokter Sp.DVE dengan hasil nyata, aman, dan terarah.
        </p>
      </div>
    </div>
  );
}
