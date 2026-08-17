import type { Metadata } from "next";
import { TreatmentsHero } from "@/components/sections/treatments/TreatmentsHero";
import { CoreServices } from "@/components/sections/treatments/CoreServices";
import { BeforeAfter } from "@/components/sections/treatments/BeforeAfter";
import { CompareSection } from "@/components/sections/treatments/CompareSection";

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Program slimming dan skin treatment Prossi Clinic, ditangani langsung oleh dokter Spesialis Gizi Klinik dan Sp.DVE.",
};

export default function TreatmentsPage() {
  return (
    <>
      <div className="bg-[#cd724f]">
        <TreatmentsHero />
        <CoreServices />
      </div>
      <BeforeAfter />
      <CompareSection />
    </>
  );
}
