import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prossi Journal",
  description:
    "Artikel dari dokter Prossi Clinic seputar kesehatan kulit, program slimming, dan perawatan medis terpercaya.",
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
