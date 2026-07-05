import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header, type HeaderTopBar } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { directusFetch } from "@/lib/directus";

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

type SiteSettings = {
  open_hours_text: string | null;
  social_telegram: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await directusFetch<SiteSettings>(
    "/items/site_settings?fields=open_hours_text,social_telegram,social_instagram,social_facebook"
  );
  const topBar: HeaderTopBar | undefined = s
    ? {
        openHours: s.open_hours_text ?? "Open Daily · 9:00 AM – 8:00 PM",
        telegram: s.social_telegram ?? "https://t.me/prossiclinic",
        instagram: s.social_instagram ?? "https://instagram.com/prossiclinic",
        facebook: s.social_facebook ?? "https://facebook.com/prossiclinic",
      }
    : undefined;

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
          <PageLoader />
          <div className="min-h-screen bg-[#f4ece4] flex flex-col font-sans text-[#120f0b] overflow-x-hidden relative">
            <Header topBar={topBar} />
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
