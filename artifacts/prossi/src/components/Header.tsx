"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", dropdown: false },
  { label: "Treatments", href: null, dropdown: true },
  { label: "Doctors", href: "/doctors", dropdown: true },
  { label: "About", href: null, dropdown: true },
  { label: "Promo", href: null, dropdown: false },
  { label: "Shop", href: null, dropdown: false },
  { label: "Locations", href: null, dropdown: false },
];

const treatmentItems = [
  "Slimming Program by Sp.GK",
  "Skin Treatment by Sp.DVE",
  "Skin Treatment by Dokter Estetika",
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTreatmentsDesktopOpen, setIsTreatmentsDesktopOpen] = useState(false);
  const [isDoctorsDesktopOpen, setIsDoctorsDesktopOpen] = useState(false);
  const [isAboutDesktopOpen, setIsAboutDesktopOpen] = useState(false);
  const [isTreatmentsMobileOpen, setIsTreatmentsMobileOpen] = useState(false);
  const [activeTreatment, setActiveTreatment] = useState(treatmentItems[0]);
  const location = usePathname();
  const showBar = location === "/contact";

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      {/* ── Announcement bar — only on /contact ── */}
      {showBar && (
        <div className="bg-[#120f0b] h-[40px] px-6 md:px-[100px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/figma/imgMdiClockOutline.svg"
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
              { src: "/figma/imgGroup.svg", alt: "Telegram" },
              { src: "/figma/imgRiInstagramLine.svg", alt: "Instagram" },
              { src: "/figma/imgGgFacebook.svg", alt: "Facebook" },
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
      )}

      {/* ── Main nav bar ── */}
      <div className="bg-[#f4ece4] px-6 md:px-[100px] py-4 shadow-[0px_18px_9px_rgba(56,0,30,0.03),0px_5px_5px_rgba(56,0,30,0.04)]">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          <Link href="/">
            <img
              src="/figma/imgUntitledDesign181.png"
              alt="Prossi Clinic"
              className="w-[128px] h-[72px] object-contain cursor-pointer"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const hasDropdown = item.dropdown;
              const isOpen =
                item.label === "Treatments" ? isTreatmentsDesktopOpen :
                item.label === "Doctors" ? isDoctorsDesktopOpen :
                item.label === "About" ? isAboutDesktopOpen : false;

              return (
                <div key={item.label} className="relative">
                  {hasDropdown ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (item.label === "Treatments") setIsTreatmentsDesktopOpen(!isTreatmentsDesktopOpen);
                        else if (item.label === "Doctors") setIsDoctorsDesktopOpen(!isDoctorsDesktopOpen);
                        else if (item.label === "About") setIsAboutDesktopOpen(!isAboutDesktopOpen);
                      }}
                      className="flex items-center gap-0.5 text-[16px] font-medium text-[#120f0b] hover:text-[#b59637] transition-colors"
                    >
                      {item.label}
                      <img
                        src="/figma/imgIconamoonArrowUp2Fill.svg"
                        alt=""
                        className={`w-5 h-5 transition-transform ${isOpen ? "rotate-0" : "rotate-180"}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="text-[16px] font-medium text-[#120f0b] hover:text-[#b59637] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                  {hasDropdown && isOpen && (
                    <div className="absolute left-1/2 top-[calc(100%+14px)] -translate-x-1/2 w-[300px] rounded-[20px] bg-white p-4 shadow-[0px_10px_30px_rgba(18,15,11,0.12)] z-50">
                      <div className="flex flex-col gap-2">
                        {item.label === "Treatments" && ["Slimming Program", "Skin Treatment"].map((treatment) => (
                          <Link
                            key={treatment}
                            href={`/treatments/${treatment.toLowerCase().replace(/\s+/g, '-')}`}
                            className="w-full text-left rounded-lg px-4 py-3 text-[15px] text-[#120f0b] hover:bg-[#f4ece4] hover:text-[#b59637] transition-colors"
                            onClick={() => setIsTreatmentsDesktopOpen(false)}
                          >
                            {treatment}
                          </Link>
                        ))}
                        {item.label === "Doctors" && ["Dokter Spesialis Gizi Klinik", "Dokter Spesialis Dermatologi, Venereologi, dan Estetika", "Dokter Umum"].map((doctor) => (
                          <Link
                            key={doctor}
                            href={`/doctors/${doctor.toLowerCase().replace(/\s+/g, '-')}`}
                            className="w-full text-left rounded-lg px-4 py-3 text-[15px] text-[#120f0b] hover:bg-[#f4ece4] hover:text-[#b59637] transition-colors"
                            onClick={() => setIsDoctorsDesktopOpen(false)}
                          >
                            {doctor}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <Link
            href="/contact"
            className="hidden lg:flex bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity items-center justify-center"
          >
            Reservation
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 z-50 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`block w-6 h-0.5 bg-[#120f0b] transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#120f0b] transition-opacity ${isOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#120f0b] transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 flex flex-col gap-4 pb-2">
            {navItems.map((item) => (
              <div key={item.label} className="cursor-pointer hover:text-[#b59637] transition-colors font-medium text-[#120f0b]">
                {item.label}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-3 text-white font-serif font-semibold text-base mt-1 text-center"
            >
              Reservation
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
