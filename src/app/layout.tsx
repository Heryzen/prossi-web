import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prossi Clinic",
    template: "%s | Prossi Clinic",
  },
  description:
    "Prossi Clinic — Perawatan kulit dan program slimming dengan pendekatan medis yang tepat.",
  robots: "index, follow",
  openGraph: {
    title: "Prossi Clinic",
    description:
      "Prossi Clinic — Perawatan kulit dan program slimming dengan pendekatan medis yang tepat.",
    type: "website",
    locale: "id_ID",
    images: ["/opengraph.jpg"],
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Prossi Clinic",
  url: SITE_URL,
  logo: `${SITE_URL}/figma/imgUntitledDesign181.webp`,
  image: `${SITE_URL}/opengraph.jpg`,
  telephone: "+0214567891",
  email: "info@prossi.com",
  medicalSpecialty: ["Dermatology", "Weight Management", "Aesthetic Medicine"],
  sameAs: [
    "https://www.tiktok.com/@prossi.clinic",
    "https://instagram.com/prossiclinic",
    "https://facebook.com/prossiclinic",
    "https://www.threads.net/@prossi.clinic",
    "https://www.linkedin.com/company/prossiclinic",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@400;500;600;700&family=Arizonia&family=Lato:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
      </head>
      <body>
        <Providers>
          <PageLoader />
          <div className="min-h-screen bg-[#f4ece4] flex flex-col font-sans text-[#120f0b] overflow-x-hidden relative">
            <Header />
            <main className="flex-1 flex flex-col w-full">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
