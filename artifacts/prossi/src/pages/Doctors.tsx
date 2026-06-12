import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import imgLine4 from "@/assets/figma/imgLine4.svg";
import imgLine2 from "@/assets/figma/imgLine2.svg";
import imgLine6 from "@/assets/figma/imgLine6.svg";
import imgTeamMemberImage from "@/assets/figma/imgTeamMemberImage.png";
import imgTeamMemberImage1 from "@/assets/figma/imgTeamMemberImage1.png";
import imgTeamMemberImage2 from "@/assets/figma/imgTeamMemberImage2.png";
import imgBackground1 from "@/assets/figma/imgBackground1.png";
import imgPremium187273551 from "@/assets/figma/imgPremium187273551.svg";
import imgLayer2 from "@/assets/figma/imgLayer2.svg";
import imgShield131932661 from "@/assets/figma/imgShield131932661.svg";

const doctors = [
  {
    img: imgTeamMemberImage,
    name: "dr. Reina Kartika, Sp.GK",
    specialty: "Spesialis Gizi Klinik",
    tag: "Sp.GK",
    bio: "Dokter spesialis gizi klinik berpengalaman dalam merancang program slimming berbasis medis yang personal, aman, dan berkelanjutan untuk setiap pasien.",
    schedule: "Senin – Jumat",
    hours: "09.00 – 17.00",
    borderColor: "border-[#c26345]",
  },
  {
    img: imgTeamMemberImage1,
    name: "dr. Desiree Ayu, Sp.DVE",
    specialty: "Spesialis Kulit & Estetika",
    tag: "Sp.DVE",
    bio: "Spesialis Dermatologi, Venereologi & Estetika yang menangani berbagai kondisi kulit dan kelamin dengan pendekatan klinis dan teknologi terkini seperti IPL dan Laser.",
    schedule: "Selasa – Sabtu",
    hours: "10.00 – 18.00",
    borderColor: "border-[#396b72]",
  },
  {
    img: imgTeamMemberImage2,
    name: "dr. Fajar Nugroho",
    specialty: "Dokter Estetika",
    tag: "Estetika",
    bio: "Dokter estetika Prossi Clinic yang berfokus pada perawatan kecantikan sehari-hari, mulai dari perawatan wajah hingga HIFU, dengan hasil natural dan terarah.",
    schedule: "Senin – Sabtu",
    hours: "09.00 – 16.00",
    borderColor: "border-[#deba69]",
  },
];

const credentials = [
  { icon: imgPremium187273551, value: "10+", label: "Tahun Pengalaman" },
  { icon: imgLayer2, value: "15,000+", label: "Pasien Ditangani" },
  { icon: imgShield131932661, value: "92%", label: "Patient Satisfaction" },
];

function Eyebrow({ text, light = false }: { text: string; light?: boolean }) {
  const textColor = light ? "text-white" : "text-[#120f0b]";
  return (
    <div className="flex gap-[16px] items-center justify-center overflow-clip relative shrink-0">
      <div className="h-0 relative shrink-0 w-[63px]">
        <div className="absolute inset-[-5.77px_-9.16%_-5.77px_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine4} />
        </div>
      </div>
      <span className={`font-['Inter'] font-semibold leading-normal not-italic relative shrink-0 text-[14px] ${textColor} whitespace-nowrap`}>
        {text}
      </span>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-0 relative w-[63px]">
            <div className="absolute inset-[-5.77px_-9.16%_-5.77px_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex flex-row items-center self-stretch">
      <div className="flex h-full items-center justify-center relative shrink-0 w-0" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none w-[100cqh]">
          <div className="h-0 relative w-full">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine6} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Doctors() {
  return (
    <div className="min-h-screen bg-[#f4ece4] flex flex-col font-sans text-[#120f0b] overflow-x-hidden">
      <Header />

      {/* Hero banner */}
      <section className="relative w-full h-[420px] flex items-end justify-center pb-0 overflow-hidden">
        <div className="absolute inset-0">
          <img src={imgBackground1} alt="" className="absolute h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4ece4] from-[10%] via-[#f4ece4]/80 via-[45%] to-transparent to-[70%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f4ece4] from-[0%] to-transparent to-[40%]" />
        </div>
        <div className="relative z-10 max-w-[816px] w-full flex flex-col items-center gap-6 px-6 text-center pb-12 mt-[79px]">
          <Eyebrow text="OUR DOCTORS" />
          <h1 className="font-['Lato'] font-semibold text-[40px] md:text-[56px] text-[#120f0b] capitalize leading-tight">
            Ditangani oleh Dokter{" "}
            <span className="font-['Arizonia'] text-[#b59637]">Spesialis</span>
          </h1>
          <p className="font-sans text-lg text-[#503d1c] max-w-[660px]">
            Setiap pasien ditangani langsung oleh dokter spesialis, memastikan diagnosis yang tepat dan perawatan yang sesuai dengan kondisi Anda.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="w-full flex justify-center px-6 -mt-2 mb-12 relative z-10">
        <div className="max-w-[1240px] w-full backdrop-blur-[11px] bg-[rgba(255,248,242,0.85)] rounded-[32px] px-[64px] py-[32px] shadow-[0px_18px_40px_rgba(56,0,30,0.08)]">
          <div className="flex items-center justify-between w-full">
            {credentials.map((c, i) => (
              <React.Fragment key={i}>
                <div className="flex gap-[20px] items-center shrink-0">
                  <div className="relative shrink-0 size-[54px]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={c.icon} />
                  </div>
                  <div className="flex flex-col items-start leading-[100%]">
                    <span className="font-serif font-semibold text-[40px] text-[#503d1c] capitalize leading-none">{c.value}</span>
                    <span className="font-sans font-normal opacity-80 text-[18px] text-[#120f0b] mt-1">{c.label}</span>
                  </div>
                </div>
                {i < credentials.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor cards */}
      <section className="w-full py-[60px] md:py-[100px] px-6 md:px-[100px] flex flex-col items-center">
        <div className="max-w-[1240px] w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doc, i) => (
            <div key={i} className={`bg-gradient-to-b from-white to-[#fff9eb] border-4 ${doc.borderColor} rounded-[32px] overflow-hidden flex flex-col`}>
              {/* Photo */}
              <div className="relative w-full h-[360px] shrink-0">
                <div className="absolute inset-0 overflow-hidden">
                  <img src={doc.img} alt={doc.name} className="absolute w-full h-full object-cover object-top" />
                </div>
                {/* Specialty tag */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#b59637] border border-[#ecd5a5] text-white font-['Inter'] font-semibold text-[13px] px-5 py-2 rounded-full whitespace-nowrap">
                    {doc.tag}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col items-center gap-5 px-7 pt-6 pb-8 flex-1">
                <div className="flex flex-col items-center gap-2 text-center">
                  <h3 className="font-serif font-semibold text-[22px] text-[#120f0b] capitalize leading-tight">
                    {doc.name}
                  </h3>
                  <p className="font-['Inter'] font-medium text-[15px] text-[#503d1c]">{doc.specialty}</p>
                </div>

                {/* Divider line */}
                <div className="w-[200px] h-0 relative shrink-0">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img alt="" className="block max-w-none size-full" src={imgLine6} />
                  </div>
                </div>

                <p className="font-sans text-[15px] text-[#120f0b]/80 text-center leading-relaxed flex-1">
                  {doc.bio}
                </p>

                {/* Schedule */}
                <div className="w-full bg-[#f4ece4] rounded-[16px] px-5 py-3 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-['Inter'] font-semibold text-[12px] text-[#503d1c] uppercase tracking-wider">Jadwal</span>
                    <span className="font-sans text-[14px] text-[#120f0b]">{doc.schedule}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-right">
                    <span className="font-['Inter'] font-semibold text-[12px] text-[#503d1c] uppercase tracking-wider">Jam</span>
                    <span className="font-sans text-[14px] text-[#120f0b]">{doc.hours}</span>
                  </div>
                </div>

                <button className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[14px] text-white font-serif font-semibold text-[17px] hover:opacity-90 transition-opacity w-full mt-auto">
                  Book Konsultasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-[#b59637] w-full py-[60px] px-6 md:px-[100px] flex flex-col items-center gap-6">
        <Eyebrow text="PROSSI CLINIC" light />
        <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-white capitalize text-center leading-tight max-w-[700px]">
          Siap Mulai Perjalanan Kesehatanmu?
        </h2>
        <p className="font-sans text-lg text-white/90 text-center max-w-[600px]">
          Konsultasikan kondisimu langsung dengan dokter spesialis Prossi Clinic.
        </p>
        <button className="bg-gradient-to-r from-[#e5be80] via-[#edd8ab] to-[#e5be80] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-[#503d1c] font-serif font-semibold text-lg hover:opacity-90 transition-opacity">
          Book Consultation
        </button>
      </section>

      <Footer />
    </div>
  );
}
