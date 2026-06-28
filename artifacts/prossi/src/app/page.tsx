import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { TreatmentServices } from "@/components/sections/TreatmentServices";
import { Team } from "@/components/sections/Team";
import { Blog } from "@/components/sections/Blog";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal><Philosophy /></Reveal>
      <Reveal><TreatmentServices /></Reveal>
      <Reveal><Team /></Reveal>
      <Reveal><Blog /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><CTA /></Reveal>
    </>
  );
}
