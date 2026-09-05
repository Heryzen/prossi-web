import type { Metadata } from "next";
import { directusFetch } from "@/lib/directus";
import { PromoPageContent, type PromoItem } from "@/components/PromoPageContent";

export const metadata: Metadata = {
  title: "Promo",
  description: "Promo dan penawaran terbaru dari Prossi Clinic untuk program slimming dan skin treatment.",
};

type CmsSiteSettings = { whatsapp_number: string | null };

export default async function PromoPage() {
  const [promos, siteSettings] = await Promise.all([
    directusFetch<PromoItem[]>(
      "/items/promos?filter[status][_eq]=published&fields=title,description,image,cta_link,valid_until,category"
    ),
    directusFetch<CmsSiteSettings>("/items/site_settings?fields=whatsapp_number"),
  ]);

  return (
    <main className="min-h-screen bg-[#f4ece4] flex flex-col pt-[79px]">
      {/* ── Hero ── */}
      <div className="relative w-full overflow-hidden h-[320px] md:h-[440px] rounded-b-[100px]">
        <img
          src="/figma/imgContactHero-4f95a9.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, rgba(105,85,56,0) 30%, rgba(105,85,56,0.6) 41%, rgba(105,85,56,0.82) 53%, rgba(105,85,56,1) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-4 px-6 pt-[100px] md:px-0 md:pt-[200px]" style={{ maxWidth: 711 }}>
          <h1
            className="font-['Source_Serif_4',serif] font-normal leading-tight md:pl-[100px]"
            style={{
              fontSize: "clamp(28px, 7vw, 45px)",
              background:
                "linear-gradient(270deg, rgba(251,232,166,1) 0%, rgba(235,210,151,1) 41%, rgba(251,232,166,1) 67%, rgba(251,232,166,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Promo
          </h1>
          <p
            className="font-['Lato',sans-serif] font-normal text-white md:pl-[100px]"
            style={{ fontSize: "clamp(14px, 4vw, 18px)", lineHeight: "1.6" }}
          >
            Penawaran spesial dari Prossi Clinic untuk perjalanan kesehatan dan kecantikanmu.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-[100px] py-[60px] md:py-[80px]">
        <div className="max-w-[1240px] mx-auto flex flex-col items-center">
          <PromoPageContent promos={promos ?? []} waNumber={siteSettings?.whatsapp_number} />
        </div>
      </div>
    </main>
  );
}
