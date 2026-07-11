import { TreatmentsHero } from "@/components/sections/treatments/TreatmentsHero";
import { CoreServices } from "@/components/sections/treatments/CoreServices";
import { BeforeAfter } from "@/components/sections/treatments/BeforeAfter";
import { CompareSection } from "@/components/sections/treatments/CompareSection";

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
