import type { Metadata } from "next";
import { TreatmentsHero } from "@/components/sections/treatments/TreatmentsHero";
import { CoreServices } from "@/components/sections/treatments/CoreServices";
import { BeforeAfter } from "@/components/sections/treatments/BeforeAfter";
import { CompareSection } from "@/components/sections/treatments/CompareSection";
import { getPageContent } from "@/lib/pageContent";

export const metadata: Metadata = {
  title: "Slimming Program by Sp.GK",
  description:
    "Program slimming berbasis medis Prossi Clinic, ditangani langsung oleh dokter Spesialis Gizi Klinik (Sp.GK) dengan supervisi dan evaluasi berkala.",
};

export default async function SlimmingProgramPage() {
  const pc = await getPageContent([
    "treatment.slimming.hero",
    "treatment.slimming.choose",
    "treatment.slimming.beforeafter",
    "treatment.slimming.compare",
  ]);

  return (
    <>
      <div className="bg-[#cd724f]">
        <TreatmentsHero content={pc["treatment.slimming.hero"]} />
        <CoreServices content={pc["treatment.slimming.choose"]} />
      </div>
      <BeforeAfter category="slimming" content={pc["treatment.slimming.beforeafter"]} />
      <CompareSection content={pc["treatment.slimming.compare"]} />
    </>
  );
}
