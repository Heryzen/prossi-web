import { SkinHero } from "@/components/sections/treatments/SkinHero";
import { SkinCoreServices } from "@/components/sections/treatments/SkinCoreServices";
import { BeforeAfter } from "@/components/sections/treatments/BeforeAfter";
import { CompareSection } from "@/components/sections/treatments/CompareSection";

export default function SkinTreatmentPage() {
  return (
    <>
      <div className="bg-[#426b6a]">
        <SkinHero />
        <SkinCoreServices />
      </div>
      <BeforeAfter category="skin" />
      <CompareSection />
    </>
  );
}
