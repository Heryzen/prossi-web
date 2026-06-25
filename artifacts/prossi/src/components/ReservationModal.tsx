"use client";

import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TREATMENTS = ["Slimming Program", "Skin Treatment"];
const CLINICS = ["Prossi Clinic Jakarta", "Prossi Clinic Bandung", "Prossi Clinic Surabaya"];

export function ReservationModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ fullName: "", treatment: "", clinic: "" });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      {/* Modal — 977×661 */}
      <div
        className="relative flex overflow-hidden w-full"
        style={{ maxWidth: 977, height: 661, borderRadius: 20, background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Left panel — 442px ── */}
        <div
          className="relative hidden md:block flex-none overflow-hidden"
          style={{ width: 442, borderRadius: "20px 0 0 20px" }}
        >
          <img
            src="/figma/imgReservationBanner-15f3a5.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute" style={{ left: 31, top: 45 }}>
            <img
              src="/figma/imgUntitledDesign181.png"
              alt="Prossi Clinic"
              style={{ width: 128, height: 72, objectFit: "contain" }}
            />
          </div>
        </div>

        {/* ── Right panel — 535px ── */}
        <div className="relative flex-1 flex flex-col overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-11 z-10 p-1 hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="#B59637" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Form — y:127 from modal top, centered in right panel */}
          <div
            className="flex flex-col items-center gap-9"
            style={{ paddingTop: 127, paddingLeft: 43, paddingRight: 43 }}
          >
            {/* Fields */}
            <div className="flex flex-col w-full" style={{ maxWidth: 426 }}>
              {/* Full name */}
              <div className="flex flex-col gap-1 mb-4">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] leading-[20px] text-black">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full h-[40px] px-[9px] border border-[#DBDBDB] bg-white outline-none focus:border-[#B59637] transition-colors font-['Readex_Pro',sans-serif] text-[16px] text-[#292929] placeholder-[#AEAFAF]"
                  style={{ borderRadius: 4 }}
                />
              </div>

              {/* Treatment */}
              <div className="flex flex-col gap-1 mb-4">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] leading-[20px] text-black">
                  Treatment
                </label>
                <div className="relative">
                  <select
                    value={form.treatment}
                    onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                    className="w-full h-[40px] px-[9px] border border-[#DBDBDB] bg-white outline-none focus:border-[#B59637] transition-colors font-['Readex_Pro',sans-serif] text-[16px] appearance-none cursor-pointer"
                    style={{ borderRadius: 4, color: form.treatment ? "#292929" : "#AEAFAF" }}
                  >
                    <option value="" disabled>Select Treatment</option>
                    {TREATMENTS.map((t) => (
                      <option key={t} value={t} style={{ color: "#292929" }}>{t}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6L8 10L12 6" stroke="#AEAFAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Clinic */}
              <div className="flex flex-col gap-1">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] leading-[20px] text-black">
                  Clinic
                </label>
                <div className="relative">
                  <select
                    value={form.clinic}
                    onChange={(e) => setForm({ ...form, clinic: e.target.value })}
                    className="w-full h-[40px] px-[9px] border border-[#DBDBDB] bg-white outline-none focus:border-[#B59637] transition-colors font-['Readex_Pro',sans-serif] text-[16px] appearance-none cursor-pointer"
                    style={{ borderRadius: 4, color: form.clinic ? "#292929" : "#AEAFAF" }}
                  >
                    <option value="" disabled>Select Clinic</option>
                    {CLINICS.map((c) => (
                      <option key={c} value={c} style={{ color: "#292929" }}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6L8 10L12 6" stroke="#AEAFAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy text */}
            <div className="flex flex-wrap justify-center gap-x-1" style={{ maxWidth: 426 }}>
              <span className="font-['Readex_Pro',sans-serif] text-[14px] leading-[20px] text-[#292929]">
                By signing up, you are agreeing to our
              </span>
              <a href="#" className="font-['Readex_Pro',sans-serif] text-[14px] leading-[20px] text-[#607DFF] underline">
                Privacy Policy &amp; Term of Use
              </a>
            </div>

            {/* Book Reservation button */}
            <button
              type="button"
              className="font-['Lato',sans-serif] font-medium text-[16px] leading-[22px] text-white hover:opacity-90 transition-opacity"
              style={{ width: 426, padding: "12px 16px", background: "#B59637", borderRadius: 8 }}
            >
              Book Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
