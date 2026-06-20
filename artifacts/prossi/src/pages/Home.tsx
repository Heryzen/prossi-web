import React from "react";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
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
      <Services />
      <Team />
      <Blog />
      <Testimonials />
      <CTA />
    </>
  );
}
