import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Philosophy } from "@/components/sections/Philosophy";
import { TreatmentServices } from "@/components/sections/TreatmentServices";
import { Team } from "@/components/sections/Team";
import { Blog } from "@/components/sections/Blog";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Philosophy />
      <TreatmentServices />
      <Team />
      <Blog />
      <Testimonials />
      <CTA />
    </>
  );
}
