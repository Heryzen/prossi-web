import type { Metadata } from "next";
import { TreatmentsHero } from "@/components/sections/treatments/TreatmentsHero";
import { CoreServices } from "@/components/sections/treatments/CoreServices";
import { BeforeAfter } from "@/components/sections/treatments/BeforeAfter";
import { CompareSection, type Advantage } from "@/components/sections/treatments/CompareSection";
import { getPageContent } from "@/lib/pageContent";
import { directusFetch } from "@/lib/directus";

type CmsAdvantage = { title: string; description: string };

export const metadata: Metadata = {
  title: "Slimming Program by Sp.GK",
  description:
    "Program slimming berbasis medis Prossi Clinic, ditangani langsung oleh dokter Spesialis Gizi Klinik (Sp.GK) dengan supervisi dan evaluasi berkala.",
};

export default async function SlimmingProgramPage() {
  const [pc, cmsAdvantages] = await Promise.all([
    getPageContent([
      "treatment.slimming.hero",
      "treatment.slimming.choose",
      "treatment.slimming.beforeafter",
      "treatment.slimming.compare",
    ]),
    directusFetch<CmsAdvantage[]>(
      "/items/treatment_advantages?filter[category][_eq]=slimming&filter[status][_eq]=published&sort=sort&fields=title,description"
    ),
  ]);

  const advantages: Advantage[] | undefined =
    cmsAdvantages && cmsAdvantages.length > 0
      ? cmsAdvantages.map((a) => ({ title: a.title, desc: a.description }))
      : undefined;

  return (
    <>
      <div className="bg-[#cd724f]">
        <TreatmentsHero content={pc["treatment.slimming.hero"]} />
        <CoreServices content={pc["treatment.slimming.choose"]} />
      </div>
      <BeforeAfter category="slimming" content={pc["treatment.slimming.beforeafter"]} />
      <CompareSection content={pc["treatment.slimming.compare"]} advantages={advantages} />
    </>
  );
}
