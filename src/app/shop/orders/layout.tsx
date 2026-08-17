import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Pesanan",
  robots: "noindex, nofollow",
};

export default function OrderHistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
