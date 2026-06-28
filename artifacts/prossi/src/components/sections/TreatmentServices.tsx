import Link from "next/link";

const cards = [
  {
    title: "Slimming Program by Sp.GK",
    desc: "Support recovery, energy, and long-term cellular resilience.",
    img: "/figma/imgCoreSlimming.webp",
    borderGradient: "linear-gradient(270deg, rgba(194,99,69,1) 0%, rgba(222,186,105,1) 100%)",
  },
  {
    title: "Skin Treatment by Sp.DVE",
    desc: "Support recovery, energy, and long-term cellular resilience.",
    img: "/figma/imgCoreSkin.webp",
    borderGradient: "linear-gradient(270deg, rgba(57,107,114,1) 0%, rgba(222,186,105,1) 100%)",
  },
];

export function TreatmentServices() {
  return (
    <section className="bg-[#f4ece4] w-full py-[80px] px-6 md:px-[100px]">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-[60px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[878px]">
          <h2 className="font-['Source_Serif_4',serif] font-semibold text-[46px] leading-tight text-[#120f0b] uppercase">
            Perawatan Sesuai Kebutuhan Anda
          </h2>
          <p className="font-['Lato',sans-serif] font-normal text-[18px] text-black">
            Setiap program, baik untuk kulit maupun slimming, dirancang berdasarkan kondisi tubuh Anda, bukan pendekatan yang sama untuk semua pasien.
          </p>
        </div>

        {/* 2 Cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          {cards.map((card) => (
            /* Gradient border wrapper */
            <div
              key={card.title}
              className="rounded-[24px] p-[4px] flex-1 max-w-[610px]"
              style={{ background: card.borderGradient }}
            >
              {/* Inner card */}
              <div
                className="rounded-[20px] overflow-hidden flex flex-col h-full"
                style={{ background: "linear-gradient(180deg, #ffffff 0%, #fff9eb 100%)" }}
              >
                {/* Image */}
                <div className="w-full h-[295px] overflow-hidden rounded-[20px]">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                </div>
                {/* Content */}
                <div className="flex flex-col items-center gap-6 py-8 px-4">
                  <div className="flex flex-col items-center gap-4 w-full">
                    <h3 className="font-['Lato',sans-serif] font-semibold text-[26px] text-[#120f0b] text-center uppercase">
                      {card.title}
                    </h3>
                    {/* Divider */}
                    <div
                      className="h-px w-[290px]"
                      style={{
                        background: "linear-gradient(90deg, rgba(124,96,51,0) 0%, rgba(124,96,51,1) 50%, rgba(124,96,51,0) 100%)",
                      }}
                    />
                    <p className="font-['Inter',sans-serif] text-[16px] text-[#120f0b] text-center">
                      {card.desc}
                    </p>
                  </div>
                  <Link
                    href="/doctors"
                    className="rounded-full px-9 py-[18px] text-white font-['Source_Serif_4',serif] font-semibold text-[18px] bg-[#b59637] hover:opacity-90 transition-opacity"
                    style={{
                      border: "1px solid rgba(236,213,165,1)",
                    }}
                  >
                    View Doctors
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
