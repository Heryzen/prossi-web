import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    <div className="min-h-screen bg-[#f4ece4] flex flex-col font-sans text-[#120f0b] overflow-x-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col items-center w-full">
        <Hero />
        <Philosophy />
        <Stats />
        <Services />
        <Team />
        <Blog />
        <Testimonials />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
}
