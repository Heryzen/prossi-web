import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import imgContactHero from "@/assets/figma/imgContactHero.png";
import imgGoogleMaps from "@/assets/figma/imgGoogleMaps.png";
import imgGroup from "@/assets/figma/imgGroup.svg";
import imgRiInstagramLine from "@/assets/figma/imgRiInstagramLine.svg";
import imgGgFacebook from "@/assets/figma/imgGgFacebook.svg";
import imgMdiClockOutline from "@/assets/figma/imgMdiClockOutline.svg";

const branches = [
  {
    name: "Prossi Clinic – Sudirman",
    address: "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.3, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selata...",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
  },
  {
    name: "Prossi Clinic – Kemang",
    address: "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.3, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selata...",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
  },
  {
    name: "Prossi Clinic – BSD",
    address: "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.3, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selata...",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
  },
];

const whatsappRows = [
  {
    label: "Reservasi & Informasi Bersama Rossi",
    phone: "0828118951181",
  },
  {
    label: "Prossi Consult+ Sp GK & Sp DVE (Konsultasi Online)",
    phone: "0828118951181",
  },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="19" cy="19" r="19" fill="#25D366" />
      <path
        d="M27.5 10.5A11.44 11.44 0 0 0 19 7C12.92 7 8 11.92 8 18a10.94 10.94 0 0 0 1.53 5.61L8 27l3.52-1.5A11 11 0 0 0 19 27c6.08 0 11-4.92 11-11a10.93 10.93 0 0 0-2.5-7.5Zm-8.5 16.9a9.14 9.14 0 0 1-4.66-1.27l-.33-.2-3.44.9.92-3.35-.22-.35A9.09 9.09 0 0 1 9.82 18a9.18 9.18 0 1 1 18.36 0 9.18 9.18 0 0 1-9.18 9.4Zm5.04-6.87c-.28-.14-1.64-.8-1.89-.9-.25-.1-.44-.14-.62.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.24-1.38a8.4 8.4 0 0 1-1.55-1.92c-.16-.28 0-.43.12-.57.12-.13.28-.33.42-.5.14-.17.18-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.47-.16 0-.35-.02-.54-.02a1.04 1.04 0 0 0-.75.35c-.26.28-1 .97-1 2.37s1.02 2.75 1.17 2.94c.14.19 2.01 3.07 4.87 4.3.68.3 1.21.47 1.62.6.68.22 1.3.19 1.79.12.55-.08 1.68-.69 1.92-1.35.24-.66.24-1.22.17-1.35-.07-.13-.25-.2-.53-.33Z"
        fill="white"
      />
    </svg>
  );
}

export default function Contact() {
  const [selectedBranch, setSelectedBranch] = useState(0);

  return (
    <div className="min-h-screen bg-[#f4ece4] flex flex-col font-sans text-[#120f0b] overflow-x-hidden">

      {/* ── Top announcement bar — fixed at viewport top, z above header ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#120f0b] h-[40px] px-6 md:px-[100px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={imgMdiClockOutline}
            alt=""
            className="w-3.5 h-3.5"
            style={{ filter: "brightness(0) invert(1)", opacity: 0.8 }}
          />
          <span className="text-white/80 font-['Inter'] text-[13px]">
            Open Daily · 9:00 AM – 8:00 PM
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[
            { src: imgGroup, alt: "Telegram" },
            { src: imgRiInstagramLine, alt: "Instagram" },
            { src: imgGgFacebook, alt: "Facebook" },
          ].map((icon) => (
            <div
              key={icon.alt}
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-3.5 h-3.5"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Spacer so the relative container starts below the fixed top bar */}
      <div className="relative mt-[40px] flex flex-col flex-1">
      <Header />

      {/* ── Hero card ── */}
      <div className="px-6 md:px-[100px] pt-[100px] pb-8">
        <div className="max-w-[1240px] mx-auto">
          <div
            className="relative w-full rounded-[32px] overflow-hidden flex items-center"
            style={{
              background: "linear-gradient(105deg, #3d2e18 0%, #4a3920 40%, #5a4a2a 100%)",
              minHeight: "240px",
            }}
          >
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptNiA2djZoNnYtNmgtNnptLTEyIDB2Nmg2di02aC02em0xMi02djZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat" />

            {/* Text content */}
            <div className="relative z-10 flex-1 px-10 md:px-14 py-10">
              <h1
                className="font-['Lato'] font-bold capitalize leading-tight mb-3"
                style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#e5be80" }}
              >
                Book Consultation
              </h1>
              <p className="text-white/80 font-sans text-[16px] max-w-[420px] leading-relaxed">
                Mulai dari program slimming hingga perawatan kulit, semua treatment
                dirancang berdasarkan diagnosis dokter untuk hasil yang aman dan terarah.
              </p>
            </div>

            {/* Doctor photo */}
            <div className="relative shrink-0 self-end" style={{ width: "clamp(200px, 30%, 320px)", height: "240px" }}>
              <img
                src={imgContactHero}
                alt="Prossi Clinic Doctor"
                className="absolute bottom-0 right-0 h-full w-full object-cover object-top"
                style={{ maskImage: "linear-gradient(to right, transparent 0%, black 30%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── WhatsApp contact rows ── */}
      <div className="px-6 md:px-[100px] py-6">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-4">
          {whatsappRows.map((row, i) => (
            <a
              key={i}
              href={`https://wa.me/${row.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#e8ddd2] rounded-[20px] px-7 py-5 flex items-center gap-5 hover:border-[#b59637] hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="shrink-0 w-[46px] h-[46px]">
                <WhatsAppIcon />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-['Inter'] font-semibold text-[15px] text-[#120f0b] leading-snug">
                  {row.label}
                </span>
                <span className="font-['Lato'] font-bold text-[18px] text-[#120f0b]">
                  {row.phone}
                </span>
              </div>
              <svg
                className="shrink-0 w-6 h-6 text-[#b59637] group-hover:translate-x-1 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M9 18l6-6-6-6" stroke="#b59637" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── Map section ── */}
      <div className="w-full mt-8" style={{ minHeight: "500px" }}>
        <div className="flex h-full" style={{ minHeight: "500px" }}>

          {/* Left panel */}
          <div
            className="bg-white shrink-0 flex flex-col overflow-hidden"
            style={{ width: "clamp(280px, 30%, 380px)", minHeight: "500px" }}
          >
            <div className="px-7 pt-8 pb-4 border-b border-[#f0e8e0]">
              <h2 className="font-['Lato'] font-bold text-[20px] text-[#120f0b] leading-snug mb-1">
                Reservasi Cabang Prossi Klinik
              </h2>
              <p className="font-sans text-[13px] text-[#503d1c]/70">
                Temukan Cabang Prossi Terdekat Disini
              </p>
            </div>

            <div className="flex flex-col overflow-y-auto flex-1 divide-y divide-[#f0e8e0]">
              {branches.map((branch, i) => (
                <div
                  key={i}
                  className={`px-6 py-5 cursor-pointer transition-colors ${selectedBranch === i ? "bg-[#fdf8f2]" : "hover:bg-[#fdf8f2]"}`}
                  onClick={() => setSelectedBranch(i)}
                >
                  <p className="font-['Lato'] font-bold text-[14px] text-[#120f0b] mb-1">
                    {branch.name}
                  </p>
                  <p className="font-sans text-[12px] text-[#503d1c]/70 leading-snug mb-2">
                    {branch.address}
                  </p>
                  <p className="font-['Inter'] font-semibold text-[11px] text-[#216d73] mb-3">
                    {branch.hours}
                  </p>
                  <div className="flex gap-2">
                    <button className="border border-[#b59637] text-[#b59637] rounded-full px-4 py-1.5 text-[11px] font-['Inter'] font-semibold hover:bg-[#b59637] hover:text-white transition-colors">
                      ⊕ DIRECTION
                    </button>
                    <button className="bg-[#216d73] text-white rounded-full px-4 py-1.5 text-[11px] font-['Inter'] font-semibold hover:opacity-90 transition-opacity">
                      RESERVATION
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map image */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src={imgGoogleMaps}
              alt="Prossi Clinic Locations"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Map pins */}
            {[
              { top: "42%", left: "52%" },
              { top: "62%", left: "38%" },
              { top: "55%", left: "65%" },
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-125 ${selectedBranch === i ? "bg-[#b59637] scale-125" : "bg-[#216d73]"}`}
                style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}
                onClick={() => setSelectedBranch(i)}
              />
            ))}
            {/* Zoom controls */}
            <div className="absolute bottom-5 right-5 flex flex-col bg-white rounded shadow-sm overflow-hidden">
              <button className="w-8 h-8 flex items-center justify-center text-[#120f0b] text-xl font-light border-b border-[#e5e5e5] hover:bg-[#f5f5f5]">
                +
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#120f0b] text-xl font-light hover:bg-[#f5f5f5]">
                −
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      </div>{/* end relative mt-[40px] wrapper */}
    </div>
  );
}
