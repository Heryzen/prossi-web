export function Services() {
  const services = [
    {
      titleTop: "Slimming Program by",
      titleBottom: "Sp.GK",
      desc: "Support recovery, energy, and long-term cellular resilience.",
      img: "/figma/imgProgramImage2.png",
      borderColor: "border-[#c26345]"
    },
    {
      titleTop: "Skin Treatment by",
      titleBottom: "Sp.DVE",
      desc: "Support recovery, energy, and long-term cellular resilience.",
      img: "/figma/imgProgramImage.png",
      borderColor: "border-[#396b72]"
    },
    {
      titleTop: "Skin Treatment by",
      titleBottom: "Dokter Estetika",
      desc: "Support recovery, energy, and long-term cellular resilience.",
      img: "/figma/imgProgramImage1.png",
      borderColor: "border-[#deba69]"
    }
  ];

  return (
    <section className="bg-[#f4ece4] w-full py-20 md:py-[100px] px-6 text-center relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center">
        <h2 className="font-serif font-semibold text-[32px] md:text-[46px] text-[#120f0b] mb-4 md:mb-[58px]">
          Perawatan Sesuai Kebutuhan Anda
        </h2>
        <p className="font-sans text-base md:text-lg text-black max-w-[878px] mb-[100px]">
          Setiap program, baik untuk kulit maupun slimming, dirancang berdasarkan kondisi tubuh Anda, bukan pendekatan yang sama untuk semua pasien.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {services.map((svc, i) => (
            <div key={i} className={`bg-gradient-to-b from-white to-[#fff9eb] border-4 ${svc.borderColor} rounded-[24px] p-3 pb-6 flex flex-col items-center gap-8`}>
              <div className="w-full h-[295px] rounded-[24px] overflow-hidden relative shrink-0">
                <img src={svc.img} alt={svc.titleTop} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex flex-col items-center gap-4 px-4 w-full">
                <h3 className="font-['Lato'] font-semibold text-[22px] md:text-[26px] text-[#120f0b] text-center capitalize leading-tight">
                  {svc.titleTop}<br/>{svc.titleBottom}
                </h3>
                <div className="w-[290px] h-0 relative">
                  <img src="/figma/imgLine5.svg" alt="" className="absolute w-full" />
                </div>
                <p className="font-sans text-base text-[#120f0b] text-center">
                  {svc.desc}
                </p>
              </div>
              <button className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg mt-auto hover:opacity-90 transition-opacity">
                View Doctors
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
