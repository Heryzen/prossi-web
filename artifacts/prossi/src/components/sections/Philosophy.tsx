import React from "react";
import imgImage from "@/assets/figma/imgImage.png";
import imgImage1 from "@/assets/figma/imgImage1.jpg";
import imgImage2 from "@/assets/figma/imgImage2.jpg";

export function Philosophy() {
  return (
    <section className="bg-[#c26345] w-full py-20 md:py-[130px] px-6 md:px-[100px] text-white">
      <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
        <div className="relative w-full lg:w-[624px] h-[400px] md:h-[660px] shrink-0">
          <div className="absolute w-[60%] md:w-[381px] h-[80%] md:h-[537px] left-2 top-2 rounded-[24px] overflow-hidden">
             <img src={imgImage} alt="Philosophy 1" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="absolute w-[40%] md:w-[260px] h-[50%] md:h-[338px] right-0 top-[10%] rounded-[24px] overflow-hidden">
             <img src={imgImage1} alt="Philosophy 2" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="absolute w-[40%] md:w-[260px] h-[50%] md:h-[338px] right-[15%] bottom-0 rounded-[24px] overflow-hidden">
             <img src={imgImage2} alt="Philosophy 3" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="flex flex-col items-start w-full lg:w-[559px] shrink-0">
          <div className="flex flex-col gap-6 w-full">
            <h2 className="font-serif text-[40px] md:text-[64px] leading-none text-white">
              Slimming Glowing No <span className="font-['Arizonia'] text-[46px] md:text-[70px]">Pusing</span>
            </h2>
            <p className="font-sans text-base md:text-lg leading-relaxed text-white whitespace-pre-wrap">
              Prossi Clinic menghadirkan solusi kesehatan dan kecantikan yang komprehensif.
              <br/><br/>
              Dari program slimming berbasis medis bersama dokter Spesialis Gizi Klinik (Sp.GK), penanganan berbagai penyakit kulit dan kelamin oleh dokter Spesialis Dermatologi, Venereologi & Estetika (Sp.DVE), hingga perawatan estetika kulit sehari-hari bersama dokter estetika berpengalaman.
              <br/><br/>
              Dilengkapi dengan teknologi canggih seperti IPL, Laser, dan HIFU, serta program gizi lengkap dengan suplemen sehat, semua dirancang personal sesuai kebutuhan tubuh dan kulitmu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
