"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ReservationModal } from "@/components/ReservationModal";

const MapSection = dynamic(
  () => import("@/components/MapSection").then((m) => m.MapSection),
  { ssr: false }
);

const branches = [
  {
    name: "Prossi Clinic – Sudirman",
    address:
      "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.1, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selatan, DKI Jakarta 12190",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2256,
    lng: 106.8044,
    mapsUrl: "https://maps.google.com/?q=Sudirman+SCBD+Jakarta",
  },
  {
    name: "Prossi Clinic – Kemang",
    address:
      "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.1, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selatan, DKI Jakarta 12190",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2615,
    lng: 106.8115,
    mapsUrl: "https://maps.google.com/?q=Kemang+Jakarta",
  },
  {
    name: "Prossi Clinic – BSD",
    address:
      "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.1, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selatan, DKI Jakarta 12190",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2917,
    lng: 106.6655,
    mapsUrl: "https://maps.google.com/?q=BSD+Tangerang+Selatan",
  },
];

const whatsappRows = [
  {
    label: "Reservasi & Informasi Bersama Rossi",
    phone: "0828118951181",
    href: "https://wa.me/0828118951181",
  },
  {
    label: "Prossi Consult+ Sp GK & Sp DVE (Konsultasi Online)",
    phone: "0828118951181",
    href: "https://wa.me/0828118951181",
  },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <circle cx="32" cy="32" r="32" fill="#25D366" />
      <path
        d="M46.2 17.8A19.3 19.3 0 0 0 32 12C21.5 12 13 20.5 13 31a18.5 18.5 0 0 0 2.6 9.5L13 47l6.8-2.5A19 19 0 0 0 32 47c10.5 0 19-8.5 19-19a18.5 18.5 0 0 0-4.8-10.2Zm-14.2 28.5a15.5 15.5 0 0 1-7.9-2.2l-.6-.3-5.8 1.5 1.6-5.6-.4-.6A15.4 15.4 0 0 1 16.6 31a15.4 15.4 0 1 1 30.8 0 15.4 15.4 0 0 1-15.4 15.3Zm8.5-11.6c-.5-.2-2.8-1.4-3.2-1.5-.5-.2-.7-.2-1 .2-.3.5-1.2 1.5-1.5 1.8-.3.3-.5.3-1 .1-.5-.2-2-.7-3.8-2.3a14.3 14.3 0 0 1-2.6-3.3c-.3-.5 0-.7.2-1 .2-.2.5-.6.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.9-.2-.2-1-2.5-1.4-3.4-.4-.9-.8-.8-1-.8-.3 0-.6 0-.9 0a1.8 1.8 0 0 0-1.3.6c-.4.5-1.7 1.7-1.7 4s1.7 4.7 2 5c.2.3 3.4 5.2 8.2 7.3 1.2.5 2 .8 2.7 1 1.2.4 2.2.3 3 .2.9-.1 2.8-1.2 3.2-2.3.4-1.1.4-2 .3-2.2-.1-.2-.4-.3-1-.6Z"
        fill="white"
      />
    </svg>
  );
}

function PhoneArrowIcon() {
  return (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.9 13.5l-3.5-1.5a1 1 0 0 0-1.1.3l-1.5 2a15.1 15.1 0 0 1-7.2-7.2l2-1.5A1 1 0 0 0 8 4.5L6.5 1a1 1 0 0 0-1.1-.6l-3.5.8A1 1 0 0 0 1 2.2C1.6 11.5 8.5 18.4 17.8 19a1 1 0 0 0 1-.8l.8-3.5a1 1 0 0 0-.7-1.2z"
        stroke="#001334"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HEADER_OFFSET = "pt-[79px]";

export default function Contact() {
  const [selectedBranch, setSelectedBranch] = useState(0);
  const [reservationOpen, setReservationOpen] = useState(false);

  return (
    <>
    <div className={`flex flex-col ${HEADER_OFFSET}`}>

      {/* ── Hero + cards in white wrapper for seamless rounded-corner transition ── */}
      <div className="bg-white">

      {/* ── Hero ── */}
      <div
        className="relative w-full overflow-hidden h-[320px] md:h-[440px] rounded-b-[100px]"
      >
        <img
          src="/figma/imgContactHero-4f95a9.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        {/* Gradient — brownish from left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, rgba(105,85,56,0) 30%, rgba(105,85,56,0.6) 41%, rgba(105,85,56,0.82) 53%, rgba(105,85,56,1) 100%)",
          }}
        />
        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4 px-6 pt-[100px] md:pt-[200px] md:pl-[100px]" style={{ maxWidth: 711 }}>
          <h1
            className="font-['Source_Serif_4',serif] font-bold leading-tight"
            style={{
              fontSize: "clamp(28px, 7vw, 45px)",
              background:
                "linear-gradient(270deg, rgba(251,232,166,1) 0%, rgba(235,210,151,1) 41%, rgba(251,232,166,1) 67%, rgba(251,232,166,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Reservation
          </h1>
          <p
            className="font-['Lato',sans-serif] font-bold text-white"
            style={{ fontSize: "clamp(14px, 4vw, 18px)", lineHeight: "1.6", maxWidth: 611 }}
          >
            Mulai dari program slimming hingga perawatan kulit, semua treatment
            dirancang berdasarkan diagnosis dokter untuk hasil yang aman dan terarah.
          </p>
        </div>
      </div>

      {/* ── WhatsApp contact cards ── */}
      <div className="px-6 py-10 md:px-[160px] md:pt-[40px] md:pb-[80px]">
        <div className="flex flex-col gap-5">
          {whatsappRows.map((row, i) => (
            <a
              key={i}
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center gap-4 hover:shadow-md transition-shadow"
              style={{
                minHeight: 100,
                padding: "20px 16px",
                border: "1px solid #B59637",
                borderRadius: 20,
                background: "#fff",
              }}
            >
              <div className="shrink-0">
                <WhatsAppIcon />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span
                  className="font-['Inter',sans-serif] font-medium text-[#001334]"
                  style={{ fontSize: 16, lineHeight: "24px" }}
                >
                  {row.label}
                </span>
                <span
                  className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#001334]"
                  style={{ fontSize: 20, lineHeight: "30px" }}
                >
                  {row.phone}
                </span>
              </div>
              <div className="shrink-0">
                <PhoneArrowIcon />
              </div>
            </a>
          ))}
        </div>
      </div>

      </div>{/* end bg-white wrapper */}

      {/* ── Map section — single MapSection, panel floats above on desktop, stacks on mobile ── */}
      <div className="relative w-full flex flex-col md:block md:h-[680px]">
        {/* Map — full width, 300px mobile / 680px desktop */}
        <div
          className="w-full md:absolute md:inset-0 order-2 md:order-none h-[300px] md:h-full"
          style={{ isolation: "isolate" }}
        >
          <MapSection selectedBranch={selectedBranch} onSelectBranch={setSelectedBranch} />
        </div>

        {/* Panel — full width on mobile (order-1), absolute overlay on desktop */}
        <div
          className="order-1 md:order-none md:absolute md:inset-0 md:flex md:items-stretch bg-white md:bg-transparent"
          style={{ pointerEvents: "none", zIndex: 10, padding: "0 0 0 0" }}
        >
          <div
            className="flex flex-col w-full md:m-9 md:ml-[80px]"
            style={{
              pointerEvents: "auto",
              background: "#fff",
              border: "1px solid #DBDBDB",
              boxShadow: "0px 0px 1px rgba(0,10,55,0.31), 0px 3px 5px rgba(0,10,55,0.2)",
              maxWidth: 480,
            }}
          >
            {/* Title */}
            <div className="flex flex-col gap-3 shrink-0 px-6 pt-8 pb-4 md:px-10 md:pt-10 md:pb-5" style={{ borderBottom: "1px solid #F3F3F3" }}>
              <h2 className="font-['Lato',sans-serif] font-bold text-[#292929]" style={{ fontSize: 22, lineHeight: "28px", letterSpacing: "0.03em" }}>
                Reservasi Cabang Prossi Klinik
              </h2>
              <p className="font-['Readex_Pro',sans-serif] font-normal text-[#292929]" style={{ fontSize: 16, lineHeight: "24px" }}>
                Temukan Cabang Prossi Terdekat Disini
              </p>
            </div>
            {/* Branch list */}
            <div className="overflow-y-auto flex-1 px-6 py-4 md:px-10">
              <div className="flex flex-col gap-3">
                {branches.map((branch, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedBranch(i)}
                    className="cursor-pointer rounded-md"
                    style={{
                      padding: 16,
                      background: "#fff",
                      border: "1px solid #DBDBDB",
                      outline: selectedBranch === i ? "2px solid #B59637" : "none",
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-['Lato',sans-serif] font-semibold text-[#292929]" style={{ fontSize: 14, lineHeight: "20px" }}>{branch.name}</p>
                      <p className="font-['Lato',sans-serif] font-bold text-[#292929]" style={{ fontSize: 12, lineHeight: "18px" }}>{branch.address}</p>
                      <p className="font-['Readex_Pro',sans-serif] font-semibold" style={{ fontSize: 12, lineHeight: "18px", color: "#B59637" }}>{branch.hours}</p>
                      <div className="flex gap-2 mt-1">
                        <a
                          href={branch.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 font-['Lato',sans-serif] font-bold text-white uppercase rounded-full bg-[#C5A855] hover:bg-[#b59637] transition-colors cursor-pointer"
                          style={{ fontSize: 12, padding: "4px 8px" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1.5A5.5 5.5 0 0 0 2.5 7c0 3 5.5 7.5 5.5 7.5S13.5 10 13.5 7A5.5 5.5 0 0 0 8 1.5Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="white"/>
                          </svg>
                          DIRECTION
                        </a>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedBranch(i); setReservationOpen(true); }}
                          className="font-['Lato',sans-serif] font-bold uppercase rounded-full border-2 border-[#B59637] text-[#B59637] bg-transparent hover:bg-[#B59637] hover:text-white transition-colors cursor-pointer"
                          style={{ fontSize: 12, padding: "4px 8px" }}
                        >
                          RESERVATION
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <ReservationModal isOpen={reservationOpen} onClose={() => setReservationOpen(false)} />
    </>
  );
}
