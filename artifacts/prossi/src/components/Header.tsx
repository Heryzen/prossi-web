import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import imgUntitledDesign181 from "@/assets/figma/imgUntitledDesign181.png";
import imgIconamoonArrowUp2Fill from "@/assets/figma/imgIconamoonArrowUp2Fill.svg";
import imgMdiClockOutline from "@/assets/figma/imgMdiClockOutline.svg";
import imgGroup from "@/assets/figma/imgGroup.svg";
import imgRiInstagramLine from "@/assets/figma/imgRiInstagramLine.svg";
import imgGgFacebook from "@/assets/figma/imgGgFacebook.svg";

const navItems = [
  { label: "Home", href: "/", dropdown: false },
  { label: "Treatments", href: null, dropdown: true },
  { label: "Doctors", href: "/doctors", dropdown: true },
  { label: "About", href: null, dropdown: false },
  { label: "Shop", href: null, dropdown: false },
  { label: "Locations", href: null, dropdown: false },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const showBar = location === "/contact";

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      {/* ── Announcement bar — only on /contact ── */}
      {showBar && (
        <div className="bg-[#120f0b] h-[40px] px-6 md:px-[100px] flex items-center justify-between">
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
      )}

      {/* ── Main nav bar ── */}
      <div className={`bg-[#f4ece4] py-4 shadow-[0px_18px_9px_rgba(56,0,30,0.03),0px_5px_5px_rgba(56,0,30,0.04)] ${showBar ? "mx-4 md:mx-6 rounded-[28px] px-6 md:px-10 mt-1" : "px-6 md:px-[100px]"}`}>
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          <Link href="/">
            <img
              src={imgUntitledDesign181}
              alt="Prossi Clinic"
              className="w-[128px] h-[72px] object-contain cursor-pointer"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-0.5 text-[16px] font-medium text-[#120f0b] hover:text-[#b59637] transition-colors"
                >
                  {item.label}
                  {item.dropdown && (
                    <img src={imgIconamoonArrowUp2Fill} alt="" className="w-5 h-5 rotate-180" />
                  )}
                </Link>
              ) : (
                <button
                  key={item.label}
                  className="flex items-center gap-0.5 text-[16px] font-medium text-[#120f0b] hover:text-[#b59637] transition-colors"
                >
                  {item.label}
                  {item.dropdown && (
                    <img src={imgIconamoonArrowUp2Fill} alt="" className="w-5 h-5 rotate-180" />
                  )}
                </button>
              )
            )}
          </nav>

          <Link
            href="/contact"
            className="hidden lg:flex bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity items-center justify-center"
          >
            Book Consultation
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
            {navItems.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="cursor-pointer hover:text-[#b59637] transition-colors font-medium text-[#120f0b]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="cursor-pointer hover:text-[#b59637] transition-colors font-medium text-[#120f0b]"
                >
                  {item.label}
                </span>
              )
            )}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-3 text-white font-serif font-semibold text-base mt-1 text-center"
            >
              Book Consultation
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
