import type { Metadata } from "next";
import { SkinHero } from "@/components/sections/treatments/SkinHero";
import { SkinCoreServices } from "@/components/sections/treatments/SkinCoreServices";
import { BeforeAfter } from "@/components/sections/treatments/BeforeAfter";
import { CompareSection } from "@/components/sections/treatments/CompareSection";
import { getPageContent } from "@/lib/pageContent";

export const metadata: Metadata = {
  title: "Skin Treatment by Sp.DVE",
  description:
    "Perawatan kulit Prossi Clinic oleh dokter Spesialis Dermatologi, Venereologi & Estetika (Sp.DVE) dengan teknologi IPL, Laser, dan HIFU.",
};

export default async function SkinTreatmentPage() {
  const pc = await getPageContent([
    "treatment.skin.hero",
    "treatment.skin.choose",
    "treatment.skin.beforeafter",
    "treatment.skin.compare",
  ]);

  return (
    <>
      <div className="bg-[#426b6a]">
        <SkinHero content={pc["treatment.skin.hero"]} />
        <SkinCoreServices content={pc["treatment.skin.choose"]} />
      </div>
      <BeforeAfter category="skin" content={pc["treatment.skin.beforeafter"]} />
      <CompareSection content={pc["treatment.skin.compare"]} />
    </>
  );
}
