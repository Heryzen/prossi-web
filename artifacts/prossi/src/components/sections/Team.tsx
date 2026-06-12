import React from "react";
import imgLine4 from "@/assets/figma/imgLine4.svg";
import imgLine2 from "@/assets/figma/imgLine2.svg";
import imgTeamMemberImage from "@/assets/figma/imgTeamMemberImage.png";
import imgTeamMemberImage1 from "@/assets/figma/imgTeamMemberImage1.png";
import imgTeamMemberImage2 from "@/assets/figma/imgTeamMemberImage2.png";

export function Team() {
  const team = [
    { title: "Spesialis Gizi Klinis", img: imgTeamMemberImage },
    { title: "spesialis Kulit & Estetika", img: imgTeamMemberImage1 },
    { title: "Dokter Umum", img: imgTeamMemberImage2 }
  ];

  return (
    <section className="bg-[#b59637] w-full py-[100px] px-6 md:px-[100px] flex flex-col items-center">
      <div className="max-w-[1240px] w-full flex flex-col items-center gap-[60px]">
        <div className="flex flex-col items-center gap-6 w-full text-center">
          <div className="flex items-center gap-4">
            <img src={imgLine4} alt="" className="w-[63px]" />
            <span className="font-sans font-semibold text-sm text-white tracking-widest uppercase">OUR DOCTORS</span>
            <img src={imgLine2} alt="" className="w-[63px] rotate-180" />
          </div>
          <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-white capitalize">
            Ditangani oleh Dokter Spesialis yang Berpengalaman
          </h2>
          <p className="font-sans text-lg text-white max-w-[816px]">
            Setiap pasien ditangani langsung oleh dokter spesialis, memastikan diagnosis yang tepat dan perawatan yang sesuai dengan kondisi Anda.
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-6">
          {team.map((member, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-6">
              <div className="w-full h-[428px] border border-[#deba69] rounded-t-[50000px] overflow-hidden relative">
                <img src={member.img} alt={member.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <h3 className="font-serif font-semibold text-[26px] text-white text-center capitalize">
                {member.title}
              </h3>
              <button className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity">
                View Doctors
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
