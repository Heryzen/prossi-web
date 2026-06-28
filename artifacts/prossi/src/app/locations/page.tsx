"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { branches } from "@/components/locations-data";

const MapSection = dynamic(
  () => import("@/components/MapSection").then((m) => m.MapSection),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#e9e4dc] animate-pulse" />,
  }
);

function DirectionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.7 11.3 12.7 2.3a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4ZM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LocationsPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col pt-[79px]">
      {/* ── Hero ── */}
      <div className="bg-white">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 440, borderRadius: "0 0 100px 100px" }}
        >
          <img
            src="/figma/imgContactHero-4f95a9.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-right"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(270deg, rgba(105,85,56,0) 30%, rgba(105,85,56,0.6) 41%, rgba(105,85,56,0.82) 53%, rgba(105,85,56,1) 100%)",
            }}
          />
          <div
            className="relative z-10 flex flex-col gap-4"
            style={{ paddingLeft: 100, paddingTop: 200, maxWidth: 711 }}
          >
            <h1
              className="font-['Source_Serif_4',serif] font-bold leading-tight"
              style={{
                fontSize: 45,
                background:
                  "linear-gradient(270deg, rgba(251,232,166,1) 0%, rgba(235,210,151,1) 41%, rgba(251,232,166,1) 67%, rgba(251,232,166,1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Prossi Location
            </h1>
            <p
              className="font-['Inter',sans-serif] font-normal text-white"
              style={{ fontSize: 18 }}
            >
              Kami Hadir di 34 Provinsi di Seluruh Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* ── Map + branch list ── */}
      <div className="relative w-full bg-white" style={{ height: 680 }}>
        {/* Map */}
        <div className="absolute inset-0">
          <MapSection selectedBranch={selected} onSelectBranch={setSelected} />
        </div>

        {/* Floating branch panel */}
        <div
          className="absolute top-8 left-4 md:left-20 bottom-8 z-[500] flex flex-col bg-white rounded-[8px] overflow-hidden"
          style={{
            width: 480,
            maxWidth: "calc(100% - 2rem)",
            boxShadow:
              "0px 0px 1px rgba(0,10,55,0.31), 0px 3px 12px rgba(0,10,55,0.18)",
          }}
        >
          {/* Header */}
          <div className="flex flex-col gap-1 border-b border-[#f3f3f3]" style={{ padding: "40px 40px 20px" }}>
            <h2
              className="font-['Lato',sans-serif] font-bold text-[#292929]"
              style={{ fontSize: 24, lineHeight: "28px", letterSpacing: "0.0417em" }}
            >
              Cabang Prossi Klinik
            </h2>
            <p
              className="font-['Readex_Pro','Inter',sans-serif] font-semibold text-[#292929]"
              style={{ fontSize: 18, lineHeight: "26px" }}
            >
              Temukan Cabang Prossi Terdekat Disini
            </p>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3" style={{ padding: "20px 40px" }}>
            {branches.map((b, i) => {
              const active = i === selected;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  className="text-left flex flex-col gap-3 rounded-[6px] border bg-white transition-colors"
                  style={{
                    padding: 20,
                    borderColor: active ? "#b59637" : "#dbdbdb",
                    boxShadow: active ? "0 0 0 1px #b59637" : "none",
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-['Lato',sans-serif] font-semibold text-[#292929]" style={{ fontSize: 14, lineHeight: "20px" }}>
                      {b.name}
                    </span>
                    <span className="font-['Lato',sans-serif] font-bold text-[#292929]" style={{ fontSize: 12, lineHeight: "18px" }}>
                      {b.address}
                    </span>
                    <span className="font-['Lato',sans-serif] text-[#b59637]" style={{ fontSize: 12, lineHeight: "18px" }}>
                      <span className="font-normal">OPEN: Monday – Friday </span>
                      <span className="font-bold">08:00 AM–09:00 PM</span>
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2">
                    <a
                      href={b.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 rounded-full bg-[#c5a855] text-white font-['Lato',sans-serif] font-bold uppercase hover:bg-[#b59637] transition-colors"
                      style={{ padding: "4px 12px", fontSize: 14, lineHeight: "20px" }}
                    >
                      <DirectionIcon />
                      Direction
                    </a>
                    <Link
                      href="/contact"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center rounded-full border-2 border-[#b59637] text-[#b59637] font-['Lato',sans-serif] font-bold uppercase hover:bg-[#b59637] hover:text-white transition-colors"
                      style={{ padding: "3px 12px", fontSize: 14, lineHeight: "20px" }}
                    >
                      Reservation
                    </Link>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
