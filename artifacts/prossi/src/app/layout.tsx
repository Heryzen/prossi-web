import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Prossi Clinic",
  description:
    "Prossi Clinic — Perawatan kulit dan program slimming dengan pendekatan medis yang tepat.",
  robots: "index, follow",
  openGraph: {
    title: "Prossi Clinic",
    description:
      "Prossi Clinic — Perawatan kulit dan program slimming dengan pendekatan medis yang tepat.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@400;500;600;700&family=Arizonia&family=Lato:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen bg-[#f4ece4] flex flex-col font-sans text-[#120f0b] overflow-x-hidden relative">
            <Header />
            <main className="flex-1 flex flex-col w-full">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
