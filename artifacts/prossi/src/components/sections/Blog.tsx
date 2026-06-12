import React from "react";
import imgLine4 from "@/assets/figma/imgLine4.svg";
import imgLine2 from "@/assets/figma/imgLine2.svg";
import imgFrame1984078116 from "@/assets/figma/imgFrame1984078116.png";
import imgFrame1984078117 from "@/assets/figma/imgFrame1984078117.png";
import imgFrame1984078118 from "@/assets/figma/imgFrame1984078118.png";
import imgTablerTagFilled from "@/assets/figma/imgTablerTagFilled.svg";

export function Blog() {
  const articles = [
    {
      category: "Spesialis Gizi",
      title: "Panduan nutrisi, slimming, dan kesehatan metabolisme dari dokter Spesialis Gizi Klinik.",
      img: imgFrame1984078116
    },
    {
      category: "Spesialis Kulit",
      title: "Informasi terpercaya seputar penyakit kulit dan kelamin dari dokter Sp.DVE.",
      img: imgFrame1984078117
    },
    {
      category: "Dokter Estetika",
      title: "Tips dan insight perawatan kecantikan langsung dari dokter estetika Prossi Clinic.",
      img: imgFrame1984078118
    }
  ];

  return (
    <section className="bg-[#f4ece4] w-full py-[100px] px-6 md:px-[100px] flex flex-col items-center">
      <div className="max-w-[1240px] w-full flex flex-col items-center gap-[60px]">
        <div className="flex flex-col items-center gap-6 w-full text-center max-w-[1030px]">
          <div className="flex items-center gap-4">
            <img src={imgLine4} alt="" className="w-[63px]" />
            <span className="font-sans font-semibold text-sm text-[#120f0b] tracking-widest uppercase">BLOG & ARTICLES</span>
            <img src={imgLine2} alt="" className="w-[63px] rotate-180" />
          </div>
          <h2 className="font-serif font-semibold text-[32px] md:text-[40px] text-[#120f0b] capitalize">
            The Prossi Journal
          </h2>
          <p className="font-sans text-lg text-[#120f0b] max-w-[816px]">
            Artikel dari dokter Prossi Clinic untuk membantu Anda memahami kondisi kulit dan tubuh, sebelum memulai perawatan yang tepat.
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-6">
          {articles.map((article, i) => (
            <div key={i} className="flex-1 bg-[#fff8f2] rounded-[24px] overflow-hidden flex flex-col pb-8">
              <div className="w-full h-[260px] relative mb-6">
                <img src={article.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="px-8 flex flex-col gap-6">
                <div className="flex items-center gap-2.5">
                  <img src={imgTablerTagFilled} alt="Tag" className="w-5 h-5" />
                  <span className="font-sans font-medium text-sm text-[#503d1c]">{article.category}</span>
                </div>
                <h3 className="font-serif font-semibold text-[26px] text-[#120f0b] leading-tight">
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <button className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity">
          Read More
        </button>
      </div>
    </section>
  );
}
