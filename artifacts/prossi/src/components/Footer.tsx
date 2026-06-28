import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#216d73] pt-[60px] px-6 md:px-[100px] w-full">
      <div className="max-w-[1240px] mx-auto">
        <div className="border-b border-white/30 flex flex-col md:flex-row items-start justify-between pb-10 w-full gap-10">
          <div className="flex flex-col gap-6 w-full md:w-[220px]">
            <img src="/figma/imgUntitledDesign181.webp" alt="Prossi Clinic" className="w-[128px] h-[72px] object-contain brightness-0 invert" />
            <p className="font-normal text-white/80 text-base">
              Perawatan kulit dan program slimming dengan pendekatan yang aman, terarah, dan dapat dipantau.
            </p>
            <div className="flex gap-3">
              {[
                { src: "/figma/imgGroup.svg", alt: "Telegram", href: "https://t.me/prossiclinic" },
                { src: "/figma/imgRiInstagramLine.svg", alt: "Instagram", href: "https://instagram.com/prossiclinic" },
                { src: "/figma/imgGgFacebook.svg", alt: "Facebook", href: "https://facebook.com/prossiclinic" },
                { src: "/figma/imgGroup2.svg", alt: "Twitter", href: "https://twitter.com/prossiclinic" },
              ].map((icon) => (
                <a key={icon.alt} href={icon.href} target="_blank" rel="noopener noreferrer" className="bg-[#f4ece4] rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors">
                  <img src={icon.src} alt={icon.alt} className="w-4 h-4" style={{filter: 'brightness(0) saturate(100%) invert(35%) sepia(21%) saturate(1450%) hue-rotate(143deg) brightness(88%) contrast(92%)'}} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row flex-1 justify-between w-full md:pl-[72px] gap-10">
            <div className="flex flex-col gap-6">
              <h4 className="font-serif font-semibold text-lg text-[#f4ece4]">Treatments</h4>
              <div className="flex flex-col gap-4 text-white/80">
                <Link href="/treatments/slimming-program" className="hover:text-white transition-colors">Slimming Program</Link>
                <Link href="/treatments/skin-treatment" className="hover:text-white transition-colors">Acne & Skin Treatment</Link>
                <Link href="/treatments/skin-treatment" className="hover:text-white transition-colors">Brightening & Glow</Link>
                <Link href="/treatments/skin-treatment" className="hover:text-white transition-colors">Laser & Rejuvenation</Link>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h4 className="font-serif font-semibold text-lg text-[#f4ece4]">Tentang Kami</h4>
              <div className="flex flex-col gap-4 text-white/80">
                <Link href="/about" className="hover:text-white transition-colors">Tentang Prossi Clinic</Link>
                <Link href="/doctors" className="hover:text-white transition-colors">Dokter Kami</Link>
                <Link href="/about" className="hover:text-white transition-colors">Prossi Journal</Link>
                <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h4 className="font-serif font-semibold text-lg text-[#f4ece4]">Contact</h4>
              <div className="flex flex-col gap-4 text-white/80">
                <a href="tel:+0214567891" className="flex items-center gap-3 hover:text-white transition-colors">
                  <img src="/figma/imgFluentCall24Filled.svg" alt="Phone" className="w-5 h-5 opacity-80" />
                  <span>+(021) 456-7891</span>
                </a>
                <a href="mailto:info@prossi.com" className="flex items-center gap-3 hover:text-white transition-colors">
                  <img src="/figma/imgEmailIcon.svg" alt="Email" className="w-5 h-5 opacity-80" />
                  <span>info@prossi.com</span>
                </a>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-[304px]">
              <h4 className="font-serif font-semibold text-lg text-[#f4ece4]">Newsletter</h4>
              <div className="flex flex-col gap-3 w-full">
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  className="bg-white/15 border border-white/20 rounded-full px-6 py-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white"
                />
                <button className="bg-gradient-to-r from-[#e5be80] via-[#edd8ab] to-[#e5be80] text-[#503d1c] font-serif font-semibold text-lg rounded-full px-9 py-4 hover:opacity-90 transition-opacity">
                  Subscribe Now
                </button>
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
