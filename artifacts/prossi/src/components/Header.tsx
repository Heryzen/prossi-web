import React, { useState } from "react";
import { Link } from "wouter";
import imgUntitledDesign181 from "@/assets/figma/imgUntitledDesign181.png";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/">
          <div className="cursor-pointer">
            <img src={imgUntitledDesign181} alt="Prossi Clinic" className="w-[128px] h-[72px] object-contain" />
          </div>
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden flex flex-col gap-1.5 z-50 p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`block w-6 h-0.5 bg-[#120f0b] transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-[#120f0b] transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-[#120f0b] transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md py-6 px-6 flex flex-col gap-6 md:hidden">
          <Link href="/treatments"><span className="cursor-pointer hover:text-[#b59637] transition-colors font-medium">Treatments</span></Link>
          <Link href="/about"><span className="cursor-pointer hover:text-[#b59637] transition-colors font-medium">Tentang Kami</span></Link>
          <Link href="/journal"><span className="cursor-pointer hover:text-[#b59637] transition-colors font-medium">Journal</span></Link>
          <button className="w-full px-6 py-3 rounded-full border border-[#deba69] text-[#120f0b] font-medium text-sm hover:bg-[#deba69] hover:text-white transition-colors mt-2">
            Book Appointment
          </button>
        </div>
      )}
      
      <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#120f0b]">
        <Link href="/treatments"><span className="cursor-pointer hover:text-[#b59637] transition-colors">Treatments</span></Link>
        <Link href="/about"><span className="cursor-pointer hover:text-[#b59637] transition-colors">Tentang Kami</span></Link>
        <Link href="/journal"><span className="cursor-pointer hover:text-[#b59637] transition-colors">Journal</span></Link>
      </nav>
      
      <div className="hidden md:flex items-center gap-4">
        <button className="px-6 py-2 rounded-full border border-[#deba69] text-[#120f0b] font-medium text-sm hover:bg-[#deba69] hover:text-white transition-colors">
          Book Appointment
        </button>
      </div>
    </header>
  );
}
