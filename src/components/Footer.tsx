import Link from "next/link";
import { directusFetch } from "@/lib/directus";

type SiteSettings = {
  footer_text: string | null;
  phone: string | null;
  email: string | null;
  social_telegram: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
};

export async function Footer() {
  const s = await directusFetch<SiteSettings>(
    "/items/site_settings?fields=footer_text,phone,email,social_telegram,social_instagram,social_facebook,social_twitter"
  );

  const footerText =
    s?.footer_text ??
    "Perawatan kulit dan program slimming dengan pendekatan yang aman, terarah, dan dapat dipantau.";
  const phone = s?.phone ?? "+(021) 456-7891";
  const email = s?.email ?? "info@prossi.com";
  const socials = [
    { src: "/figma/imgGroup.svg", alt: "Telegram", href: s?.social_telegram ?? "https://t.me/prossiclinic" },
    { src: "/figma/imgRiInstagramLine.svg", alt: "Instagram", href: s?.social_instagram ?? "https://instagram.com/prossiclinic" },
    { src: "/figma/imgGgFacebook.svg", alt: "Facebook", href: s?.social_facebook ?? "https://facebook.com/prossiclinic" },
    { src: "/figma/imgGroup2.svg", alt: "Twitter", href: s?.social_twitter ?? "https://twitter.com/prossiclinic" },
  ];

  return (
    <footer className="bg-[#216d73] pt-[60px] px-6 md:px-[100px] w-full">
      <div className="max-w-[1240px] mx-auto">
        <div className="border-b border-white/30 flex flex-col md:flex-row items-start justify-between pb-10 w-full gap-10">
          <div className="flex flex-col gap-6 w-full md:w-[220px]">
            <img src="/figma/imgUntitledDesign181.webp" alt="Prossi Clinic" className="w-[128px] h-[72px] object-contain brightness-0 invert" />
            <p className="font-normal text-white/80 text-base">
              {footerText}
            </p>
          </div>

          <div className="flex flex-col md:flex-row flex-1 justify-between w-full md:pl-[72px] gap-10">
            <div className="flex flex-col gap-6">
              <h4 className="font-serif font-semibold text-lg text-[#f4ece4]">Treatments</h4>
              <div className="flex flex-col gap-4 text-white/80">
                <Link href="/treatments/slimming-program" className="hover:text-white transition-colors">Slimming Program</Link>
                <Link href="/treatments/skin-treatment" className="hover:text-white transition-colors">Skin Treatment</Link>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-serif font-semibold text-lg text-[#f4ece4]">Tentang Kami</h4>
              <div className="flex flex-col gap-4 text-white/80">
                <Link href="/about" className="hover:text-white transition-colors">Tentang Prossi Clinic</Link>
                <Link href="/doctors" className="hover:text-white transition-colors">Dokter Kami</Link>
                <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-serif font-semibold text-lg text-[#f4ece4]">Contact</h4>
              <div className="flex flex-col gap-4 text-white/80">
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-3 hover:text-white transition-colors">
                  <img src="/figma/imgFluentCall24Filled.svg" alt="Phone" className="w-5 h-5 opacity-80" />
                  <span>{phone}</span>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                  <img src="/figma/imgEmailIcon.svg" alt="Email" className="w-5 h-5 opacity-80" />
                  <span>{email}</span>
                </a>
              </div>
              <div className="flex gap-3 justify-end">
                {socials.map((icon) => (
                  <a key={icon.alt} href={icon.href} target="_blank" rel="noopener noreferrer" className="bg-[#f4ece4] rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors">
                    <img src={icon.src} alt={icon.alt} className="w-4 h-4" style={{filter: 'brightness(0) saturate(100%) invert(35%) sepia(21%) saturate(1450%) hue-rotate(143deg) brightness(88%) contrast(92%)'}} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between py-5 text-white/60 text-sm w-full gap-4">
          <p>© 2026 Prossi. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
