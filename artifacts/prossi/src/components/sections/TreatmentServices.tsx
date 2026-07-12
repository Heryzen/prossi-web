import Link from "next/link";
import { directusFetch, assetUrl } from "@/lib/directus";

type Settings = {
  home_slimming_desc: string | null;
  home_slimming_image: string | null;
  home_skin_desc: string | null;
  home_skin_image: string | null;
};

export async function TreatmentServices() {
  const s = await directusFetch<Settings>(
    "/items/site_settings?fields=home_slimming_desc,home_slimming_image,home_skin_desc,home_skin_image"
  );

  const cards = [
    {
      title: "Slimming Program by Sp.GK",
      desc: s?.home_slimming_desc ?? "Support recovery, energy, and long-term cellular resilience.",
      img: s?.home_slimming_image ? assetUrl(s.home_slimming_image) : "/figma/imgCoreSlimming.webp",
      borderGradient: "linear-gradient(270deg, rgba(194,99,69,1) 0%, rgba(222,186,105,1) 100%)",
      category: "slimming",
    },
    {
      title: "Skin Treatment by Sp.DVE",
      desc: s?.home_skin_desc ?? "Support recovery, energy, and long-term cellular resilience.",
      img: s?.home_skin_image ? assetUrl(s.home_skin_image) : "/figma/imgCoreSkin.webp",
      borderGradient: "linear-gradient(270deg, rgba(57,107,114,1) 0%, rgba(222,186,105,1) 100%)",
      category: "skin",
    },
  ];

  return (
    <section className="bg-[#f4ece4] w-full py-12 lg:py-[80px] px-6 lg:px-[100px]">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-[60px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[878px]">
          <h2 className="font-['Source_Serif_4',serif] font-semibold text-3xl lg:text-[46px] leading-tight text-[#120f0b] uppercase">
            Perawatan Sesuai Kebutuhan Anda
          </h2>
          <p className="font-['Lato',sans-serif] font-normal text-[18px] text-black">
            Setiap program, baik untuk kulit maupun slimming, dirancang berdasarkan kondisi tubuh Anda, bukan pendekatan yang sama untuk semua pasien.
          </p>
        </div>

        {/* 2 Cards */}
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-center">
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
                    href={`/doctors?category=${card.category}`}
                    className="rounded-full px-9 py-[18px] text-white font-['Source_Serif_4',serif] font-semibold text-[18px] bg-[#b59637] hover:bg-[#a3852f] hover:shadow-lg hover:scale-[1.04] transition-all duration-200"
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
