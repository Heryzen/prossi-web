import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservasi & Cabang",
  description:
    "Temukan cabang Prossi Clinic terdekat dan buat reservasi untuk konsultasi dengan dokter spesialis kami.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
