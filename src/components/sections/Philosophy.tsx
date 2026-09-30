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

  return (
    <section className="bg-[#c26345] w-full py-12 lg:py-[130px] px-6 lg:px-[100px] text-white">
      <div className="max-w-[1240px] mx-auto flex flex-col items-start">
        <div className="flex flex-col gap-6 w-full max-w-[800px]">
          <h2 className="font-['Lato',sans-serif] font-semibold text-3xl lg:text-[64px] leading-tight text-white text-left">
            {heading}
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed text-white whitespace-pre-wrap text-left">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
