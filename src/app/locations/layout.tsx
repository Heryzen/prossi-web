import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lokasi Cabang",
  description: "Daftar cabang Prossi Clinic di seluruh Indonesia lengkap dengan alamat, jam buka, dan peta lokasi.",
};

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
