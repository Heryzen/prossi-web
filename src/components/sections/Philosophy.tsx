import { directusFetch } from "@/lib/directus";

const DEFAULT_HEADING = "Slimming Glowing No Pusing";
const DEFAULT_TEXT = [
  "Prossi Clinic menghadirkan solusi kesehatan dan kecantikan yang komprehensif.",
  "Dari program slimming berbasis medis bersama dokter Spesialis Gizi Klinik (Sp.GK), penanganan berbagai penyakit kulit dan kelamin oleh dokter Spesialis Dermatologi, Venereologi & Estetika (Sp.DVE), hingga perawatan estetika kulit sehari-hari bersama dokter estetika berpengalaman.",
  "Dilengkapi dengan teknologi canggih seperti IPL, Laser, dan HIFU, serta program gizi lengkap dengan suplemen sehat, semua dirancang personal sesuai kebutuhan tubuh dan kulitmu.",
].join("\n\n");

type Settings = { philosophy_heading: string | null; philosophy_text: string | null };

export async function Philosophy() {
  const s = await directusFetch<Settings>(
    "/items/site_settings?fields=philosophy_heading,philosophy_text"
  );
  const heading = s?.philosophy_heading ?? DEFAULT_HEADING;
  const text = s?.philosophy_text ?? DEFAULT_TEXT;

  // kata terakhir heading di-styling script (Arizonia) sesuai design
  const words = heading.trim().split(" ");
  const lastWord = words.pop();
  const headingRest = words.join(" ");

  return (
    <section className="bg-[#c26345] w-full py-12 lg:py-[130px] px-6 lg:px-[100px] text-white">
      <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
        <div className="relative w-full lg:w-[624px] h-[400px] md:h-[660px] shrink-0">
          <div className="absolute w-[60%] md:w-[381px] h-[80%] md:h-[537px] left-2 top-2 rounded-[24px] overflow-hidden">
             <img src="/figma/imgImage.webp" alt="Philosophy 1" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="absolute w-[40%] md:w-[260px] h-[50%] md:h-[338px] right-0 top-[10%] rounded-[24px] overflow-hidden">
             <img src="/figma/imgImage1.webp" alt="Philosophy 2" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="absolute w-[40%] md:w-[260px] h-[50%] md:h-[338px] right-[15%] bottom-0 rounded-[24px] overflow-hidden">
             <img src="/figma/imgImage2.webp" alt="Philosophy 3" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="flex flex-col items-start w-full lg:w-[559px] shrink-0">
          <div className="flex flex-col gap-6 w-full">
            <h2 className="font-serif text-3xl lg:text-[64px] leading-none text-white">
              {headingRest} <span className="font-['Arizonia'] text-[36px] lg:text-[70px]">{lastWord}</span>
            </h2>
            <p className="font-sans text-base md:text-lg leading-relaxed text-white whitespace-pre-wrap">
              {text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
