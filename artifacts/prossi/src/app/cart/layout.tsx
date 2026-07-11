import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keranjang Belanja | Prossi Clinic",
  robots: "noindex, nofollow",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
