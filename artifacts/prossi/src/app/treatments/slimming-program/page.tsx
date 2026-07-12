import type { Metadata } from "next";
import { TreatmentsHero } from "@/components/sections/treatments/TreatmentsHero";
import { CoreServices } from "@/components/sections/treatments/CoreServices";
import { BeforeAfter } from "@/components/sections/treatments/BeforeAfter";
import { CompareSection } from "@/components/sections/treatments/CompareSection";

export const metadata: Metadata = {
  title: "Slimming Program by Sp.GK",
  description:
    "Program slimming berbasis medis Prossi Clinic, ditangani langsung oleh dokter Spesialis Gizi Klinik (Sp.GK) dengan supervisi dan evaluasi berkala.",
};

export default function SlimmingProgramPage() {
  return (
    <>
      <div className="bg-[#cd724f]">
        <TreatmentsHero />
        <CoreServices />
      </div>
      <BeforeAfter category="slimming" />
      <CompareSection />
    </>
  );
}
