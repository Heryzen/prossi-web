import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import imgContactHero from "@/assets/figma/imgContactHero.png";
import imgGroup from "@/assets/figma/imgGroup.svg";
import imgRiInstagramLine from "@/assets/figma/imgRiInstagramLine.svg";
import imgGgFacebook from "@/assets/figma/imgGgFacebook.svg";

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const branches = [
  {
    name: "Prossi Clinic – Sudirman",
    address:
      "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.3, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selata...",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2256,
    lng: 106.8044,
    mapsUrl: "https://maps.google.com/?q=Sudirman+SCBD+Jakarta",
  },
  {
    name: "Prossi Clinic – Kemang",
    address:
      "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.3, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selata...",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2615,
    lng: 106.8115,
    mapsUrl: "https://maps.google.com/?q=Kemang+Jakarta",
  },
  {
    name: "Prossi Clinic – BSD",
    address:
      "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.3, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selata...",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2917,
    lng: 106.6655,
    mapsUrl: "https://maps.google.com/?q=BSD+Tangerang+Selatan",
  },
];

const whatsappRows = [
  { label: "Reservasi & Informasi Bersama Rossi", phone: "0828118951181" },
  { label: "Prossi Consult+ Sp GK & Sp DVE (Konsultasi Online)", phone: "0828118951181" },
];

function makeMarkerIcon(color: string, active: boolean) {
  const size = active ? 16 : 12;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

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

// nav height (79px) + announcement bar (40px) = 119px offset for /contact
const HEADER_OFFSET = "pt-[119px]";

export default function Contact() {
  const [selectedBranch, setSelectedBranch] = useState(0);

  return (
    <div className={`flex flex-col ${HEADER_OFFSET}`}>

      {/* ── Hero banner — full width, rounded bottom ── */}
      <div className="relative overflow-hidden rounded-b-[28px]" style={{ height: "clamp(300px, 38vw, 480px)" }}>
        {/* Background: hero image covers full area incl. header zone */}
        <img
          src={imgContactHero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay — left side darker for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(30,18,4,0.82) 0%, rgba(30,18,4,0.62) 38%, rgba(30,18,4,0.15) 65%, transparent 85%)",
          }}
        />
        {/* Text content — vertically centered in area below header */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col justify-center px-10 md:px-[80px] max-w-[600px]"
          style={{ top: "clamp(120px, 14vw, 160px)", paddingBottom: "clamp(32px, 4vw, 56px)" }}
        >
          <h1
            className="font-['Lato'] font-bold leading-tight mb-3 text-[#e5c97e]"
            style={{ fontSize: "clamp(28px, 3.2vw, 44px)" }}
          >
            Book Consultation
          </h1>
          <p className="text-white/80 font-['Inter'] text-[14px] md:text-[15px] leading-relaxed max-w-[440px]">
            Mulai dari program slimming hingga perawatan kulit, semua treatment
            dirancang berdasarkan diagnosis dokter untuk hasil yang aman dan terarah.
          </p>
        </div>
      </div>

      {/* ── WhatsApp contact rows ── */}
      <div className="px-4 md:px-10 pt-8 pb-6">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-4">
          {whatsappRows.map((row, i) => (
            <a
              key={i}
              href={`https://wa.me/${row.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#ede4d8] rounded-[20px] px-7 py-5 flex items-center gap-5 hover:border-[#b59637] hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="shrink-0 w-[44px] h-[44px]">
                <WhatsAppIcon />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-['Inter'] font-semibold text-[14px] text-[#120f0b] leading-snug">
                  {row.label}
                </span>
                <span className="font-['Lato'] font-bold text-[17px] text-[#120f0b]">
                  {row.phone}
                </span>
              </div>
              {/* Solid arrow → */}
              <svg className="shrink-0 w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="#b59637" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── Interactive Map section ── */}
      <div className="px-4 md:px-10 pb-12">
        <div className="max-w-[1240px] mx-auto">

          {/* Section heading */}
          <div className="mb-5">
            <h2 className="font-['Lato'] font-bold text-[22px] text-[#120f0b] mb-1">
              Reservasi Cabang Prossi Klinik
            </h2>
            <p className="font-['Inter'] text-[13px] text-[#503d1c]/70">
              Temukan Cabang Prossi Terdekat Disini
            </p>
          </div>

          {/* Card container — rounded, clipped */}
          <div
            className="flex overflow-hidden rounded-[20px] border border-[#ede4d8]"
            style={{ height: "460px", boxShadow: "0 4px 24px rgba(56,0,30,0.06)" }}
          >
            {/* Branch sidebar */}
            <div className="bg-[#fdf9f5] flex flex-col shrink-0 overflow-hidden border-r border-[#ede4d8]" style={{ width: "clamp(240px, 26%, 300px)" }}>
              <div className="flex flex-col overflow-y-auto flex-1 divide-y divide-[#f0e8de]">
                {branches.map((branch, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedBranch(i)}
                    className={`px-5 py-5 cursor-pointer transition-colors ${selectedBranch === i ? "bg-[#f4ece4]" : "hover:bg-[#f9f4ef]"}`}
                  >
                    {/* Active indicator */}
                    <div className="flex items-start gap-2 mb-2">
                      <div
                        className="mt-1 shrink-0 w-2 h-2 rounded-full transition-colors"
                        style={{ background: selectedBranch === i ? "#b59637" : "#216d73" }}
                      />
                      <p className="font-['Lato'] font-bold text-[13px] text-[#120f0b] leading-snug">{branch.name}</p>
                    </div>
                    <p className="font-['Inter'] text-[11px] text-[#503d1c]/70 leading-relaxed mb-1 pl-4">{branch.address}</p>
                    <p className="font-['Inter'] font-semibold text-[10px] text-[#216d73] mb-3 pl-4">{branch.hours}</p>
                    <div className="flex gap-2 pl-4">
                      <a
                        href={branch.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="border border-[#b59637] text-[#b59637] rounded-full px-3 py-1 text-[10px] font-['Inter'] font-semibold hover:bg-[#b59637] hover:text-white transition-colors flex items-center gap-1"
                      >
                        <span className="text-[11px]">⊕</span> DIRECTION
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedBranch(i); }}
                        className="bg-[#216d73] text-white rounded-full px-3 py-1 text-[10px] font-['Inter'] font-semibold hover:opacity-90 transition-opacity"
                      >
                        RESERVATION
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Leaflet map */}
            <div className="flex-1 relative">
              <MapContainer
                center={[branches[0].lat, branches[0].lng]}
                zoom={12}
                style={{ width: "100%", height: "100%" }}
                zoomControl={true}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  subdomains="abcd"
                  maxZoom={19}
                />
                <MapFlyTo lat={branches[selectedBranch].lat} lng={branches[selectedBranch].lng} />
                {branches.map((branch, i) => (
                  <Marker
                    key={i}
                    position={[branch.lat, branch.lng]}
                    icon={makeMarkerIcon(selectedBranch === i ? "#b59637" : "#216d73", selectedBranch === i)}
                    eventHandlers={{ click: () => setSelectedBranch(i) }}
                  >
                    <Popup>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, minWidth: 160 }}>
                        <strong style={{ fontSize: 13 }}>{branch.name}</strong>
                        <p style={{ margin: "4px 0 2px", color: "#503d1c", opacity: 0.8, lineHeight: 1.4 }}>{branch.address}</p>
                        <p style={{ color: "#216d73", fontWeight: 600 }}>{branch.hours}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
