"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";

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

if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

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

export function MapSection({
  selectedBranch,
  onSelectBranch,
}: {
  selectedBranch: number;
  onSelectBranch: (index: number) => void;
}) {
  return (
    <MapContainer
      center={[branches[0].lat, branches[0].lng]}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <ZoomControl position="bottomright" />
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
          eventHandlers={{ click: () => onSelectBranch(i) }}
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
  );
}
