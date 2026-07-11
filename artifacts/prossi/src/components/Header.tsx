"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const navItems = [
  { label: "Home", href: "/", dropdown: false },
  { label: "Treatments", href: "/treatments", dropdown: true },
  { label: "Doctors", href: "/doctors", dropdown: false },
  { label: "Promo", href: "/promo", dropdown: false },
  { label: "Article", href: "/article", dropdown: false },
  { label: "Shop", href: "/shop", dropdown: false },
  { label: "Locations", href: "/locations", dropdown: false },
];

export type HeaderTopBar = {
  openHours: string;
  telegram: string;
  instagram: string;
  facebook: string;
};

export function Header({ topBar }: { topBar?: HeaderTopBar }) {
  const openHours = topBar?.openHours ?? "Open Daily · 9:00 AM – 8:00 PM";
  const socialLinks = [
    { src: "/figma/imgGroup.svg", alt: "Telegram", href: topBar?.telegram ?? "https://t.me/prossiclinic" },
    { src: "/figma/imgRiInstagramLine.svg", alt: "Instagram", href: topBar?.instagram ?? "https://instagram.com/prossiclinic" },
    { src: "/figma/imgGgFacebook.svg", alt: "Facebook", href: topBar?.facebook ?? "https://facebook.com/prossiclinic" },
  ];
  const { count: cartCount } = useCart();
  const [memberName, setMemberName] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"treatments" | "cart" | "account" | null>(null);
  const treatmentsOpen = openMenu === "treatments";
  const location = usePathname();

  const isTreatments = location.startsWith("/treatments");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("prossi_member");
      setMemberName(raw ? JSON.parse(raw).full_name ?? null : null);
    } catch {
      setMemberName(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("prossi_member");
    setMemberName(null);
  };

  const showTopBar = scrolled;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Top bar — slides in on scroll ── */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${showTopBar ? "max-h-[32px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div
          className={`h-[32px] px-4 lg:px-[100px] flex items-center justify-between ${isTreatments ? "bg-[#b59637]" : "bg-[#120f0b]"}`}
        >
          <div className="flex items-center gap-1.5">
            <img
              src="/figma/imgMdiClockOutline.svg"
              alt=""
              className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.8 }}
            />
            <span className="text-white/80 font-['Inter'] text-[11px] lg:text-[13px] whitespace-nowrap">
              {openHours}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {socialLinks.map((icon) => (
              <a
                key={icon.alt}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className="w-3.5 h-3.5"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <div className={`transition-all duration-500 ease-in-out ${scrolled ? "lg:px-[100px] py-2" : "px-0 py-0"}`}>
        {/* Background bar morphs full-width → centered pill … */}
        <div
          className="bg-[#f4ece4] mx-auto transition-all duration-500 ease-in-out"
          style={{
            borderRadius: scrolled ? "9999px" : "0px",
            maxWidth: scrolled ? "1240px" : "100%",
            boxShadow: "0px 5px 10px rgba(56,0,30,0.04), 0px 18px 18px rgba(56,0,30,0.03), 0px 41px 25px rgba(56,0,30,0.02), 0px 73px 29px rgba(56,0,30,0.01)",
          }}
        >
          {/* … while the content keeps a constant 1240px width so the menu
              never reflows/spreads during the morph. */}
          <div
            className="flex items-center justify-between w-full max-w-[1240px] mx-auto transition-all duration-500 ease-in-out"
            style={{ padding: scrolled ? "8px 32px" : "10px 20px" }}
          >
          {/* Logo */}
          <Link href="/">
            <img
              src="/figma/imgUntitledDesign181.webp"
              alt="Prossi Clinic"
              className="w-[72px] h-[40px] lg:w-[128px] lg:h-[72px] object-contain"
              style={{ filter: "none" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isOpen = item.label === "Treatments" && treatmentsOpen;
              const textColor = "text-[#120f0b]";
              const isActive = location === item.href;

              return (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    <button
                      type="button"
                      onClick={() => setOpenMenu(treatmentsOpen ? null : "treatments")}
                      className={`flex items-center gap-0.5 text-[16px] ${isActive ? "font-semibold" : "font-medium"} ${textColor} hover:text-[#b59637] transition-colors`}
                    >
                      {item.label}
                      <img
                        src="/figma/imgIconamoonArrowUp2Fill.svg"
                        alt=""
                        className={`w-5 h-5 transition-transform ${isOpen ? "rotate-0" : "rotate-180"} `}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className={`text-[16px] ${isActive ? "font-semibold" : "font-medium"} ${textColor} hover:text-[#b59637] transition-colors`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown panel */}
                  {item.dropdown && isOpen && (
                    <div className="absolute left-1/2 top-[calc(100%+14px)] -translate-x-1/2 w-[260px] rounded-[20px] bg-white p-4 shadow-[0px_10px_30px_rgba(18,15,11,0.12)] z-50">
                      <div className="flex flex-col gap-1">
                        {item.label === "Treatments" && [
                          { label: "Slimming Program", href: "/treatments/slimming-program" },
                          { label: "Skin Treatment", href: "/treatments/skin-treatment" },
                        ].map((t) => (
                          <Link
                            key={t.label}
                            href={t.href}
                            className="rounded-lg px-4 py-3 text-[15px] text-[#120f0b] hover:bg-[#f4ece4] hover:text-[#b59637] transition-colors"
                            onClick={() => setOpenMenu(null)}
                          >
                            {t.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {/* Login / Account */}
            {memberName ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === "account" ? null : "account")}
                  aria-label="Menu akun"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f4ece4] hover:bg-[#ecd5a5] transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM4 20.5c1.4-3.6 4.6-5.5 8-5.5s6.6 1.9 8 5.5" stroke="#120f0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {openMenu === "account" && (
                  <div className="absolute right-0 top-[calc(100%+14px)] w-[200px] rounded-[20px] bg-white p-4 shadow-[0px_10px_30px_rgba(18,15,11,0.12)] z-50">
                    <div className="flex flex-col gap-1">
                      <span className="px-4 py-2 text-[14px] font-semibold text-[#120f0b] truncate">
                        Halo, {memberName.split(" ")[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          handleLogout();
                        }}
                        className="text-left rounded-lg px-4 py-3 text-[15px] text-[#868787] hover:bg-[#f4ece4] hover:text-[#b59637] transition-colors cursor-pointer"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-[14px] font-medium text-[#120f0b] hover:text-[#b59637] transition-colors">
                Masuk
              </Link>
            )}

            {/* Cart icon + dropdown (Keranjang / Pesanan Saya) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === "cart" ? null : "cart")}
                aria-label="Menu keranjang"
                className="relative flex items-center justify-center w-9 h-9 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" stroke="#120f0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#b59637] text-white text-[10px] font-semibold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {openMenu === "cart" && (
                <div className="absolute right-0 top-[calc(100%+14px)] w-[220px] rounded-[20px] bg-white p-4 shadow-[0px_10px_30px_rgba(18,15,11,0.12)] z-50">
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/cart"
                      onClick={() => setOpenMenu(null)}
                      className="rounded-lg px-4 py-3 text-[15px] text-[#120f0b] hover:bg-[#f4ece4] hover:text-[#b59637] transition-colors"
                    >
                      Keranjang{cartCount > 0 ? ` (${cartCount})` : ""}
                    </Link>
                    {memberName && (
                      <Link
                        href="/shop/orders"
                        onClick={() => setOpenMenu(null)}
                        className="rounded-lg px-4 py-3 text-[15px] text-[#120f0b] hover:bg-[#f4ece4] hover:text-[#b59637] transition-colors"
                      >
                        Pesanan Saya
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="flex bg-[#b59637] rounded-full px-7 h-11 text-white font-medium text-[15px] hover:opacity-90 transition-opacity items-center justify-center whitespace-nowrap"
            >
              Reservation
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 z-50 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`block w-6 h-0.5 transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""} bg-[#120f0b]`} />
            <span className={`block w-6 h-0.5 transition-opacity ${mobileOpen ? "opacity-0" : ""} bg-[#120f0b]`} />
            <span className={`block w-6 h-0.5 transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""} bg-[#120f0b]`} />
          </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 flex flex-col gap-1 bg-[#f4ece4] rounded-2xl px-4 py-4">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown && item.label === "Treatments" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenMenu(treatmentsOpen ? null : "treatments")}
                      className="flex items-center justify-between w-full py-2 font-medium text-[#120f0b] hover:text-[#b59637] transition-colors"
                    >
                      <span>Treatments</span>
                      <img
                        src="/figma/imgIconamoonArrowUp2Fill.svg"
                        alt=""
                        className={`w-4 h-4 transition-transform ${treatmentsOpen ? "rotate-0" : "rotate-180"}`}
                      />
                    </button>
                    {treatmentsOpen && (
                      <div className="flex flex-col gap-1 pl-4 pb-2">
                        {[
                          { label: "Slimming Program", href: "/treatments/slimming-program" },
                          { label: "Skin Treatment", href: "/treatments/skin-treatment" },
                        ].map((t) => (
                          <Link
                            key={t.label}
                            href={t.href}
                            onClick={() => setMobileOpen(false)}
                            className="py-2 text-[15px] text-[#120f0b]/80 hover:text-[#b59637] transition-colors"
                          >
                            {t.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || "#"}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 font-medium text-[#120f0b] hover:text-[#b59637] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-3 text-white font-['Source_Serif_Pro',serif] font-semibold text-base mt-2 text-center"
            >
              Reservation
            </Link>
          </div>
        )}
      </div>
    </header>

  );
}
