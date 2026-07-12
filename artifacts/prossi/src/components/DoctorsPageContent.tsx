"use client";

import Link from "next/link";
import { useState } from "react";
import type { Doctor } from "@/components/doctors-data";

const GOLD_RING =
  "linear-gradient(270deg, rgba(222,186,105,1) 0%, rgba(235,210,151,1) 30%, rgba(251,232,166,1) 50%, rgba(235,210,151,1) 70%, rgba(222,186,105,1) 100%)";
const HEADING_GRADIENT =
  "linear-gradient(270deg, rgba(251,232,166,1) 0%, rgba(235,210,151,1) 41%, rgba(251,232,166,1) 67%, rgba(251,232,166,1) 100%)";

function Eyebrow({ text }: { text: string }) {
  return (
    <div className="flex gap-4 items-center justify-center">
      <div
        className="h-[2px] w-[63px]"
        style={{ background: "linear-gradient(270deg, rgba(177,143,82,1) 0%, rgba(177,143,82,0) 100%)" }}
      />
      <span className="font-['Inter'] font-semibold text-[14px] text-[#120f0b] whitespace-nowrap">{text}</span>
      <div
        className="h-[2px] w-[63px]"
        style={{ background: "linear-gradient(90deg, rgba(177,143,82,1) 0%, rgba(177,143,82,0) 100%)" }}
      />
    </div>
  );
}

function DoctorModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="rounded-[32px] p-[1px] max-w-[1000px] w-full my-auto"
        style={{ background: GOLD_RING, boxShadow: "0px 9px 20px rgba(74,49,34,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#f4ece4] rounded-[31px] p-6 md:p-16 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-6 w-9 h-9 flex items-center justify-center rounded-full text-[#503d1c] text-xl leading-none cursor-pointer hover:bg-[#503d1c]/10 hover:text-[#b59637] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Photo + name */}
            <div className="flex flex-col gap-6 md:w-[360px] shrink-0">
              <div
                className="p-[1px] w-full max-w-[320px] mx-auto md:mx-0"
                style={{ background: GOLD_RING, borderRadius: "50000px 50000px 24px 24px" }}
              >
                <div
                  className="overflow-hidden aspect-[397/428]"
                  style={{ borderRadius: "50000px 50000px 23px 23px" }}
                >
                  <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="flex flex-col gap-3 text-center md:text-left">
                <h3 className="font-['Lato'] font-semibold text-[28px] md:text-[36px] text-[#120f0b] capitalize leading-tight">
                  {doctor.name}
                </h3>
                <p className="font-['Inter'] font-semibold text-[15px] text-[#503d1c] uppercase">
                  {doctor.specialty}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-8 flex-1">
              <div className="h-[1px] w-full" style={{ background: "rgba(124,96,51,0.3)" }} />
              <div className="flex flex-col gap-4">
                <h4 className="font-serif font-semibold text-[24px] text-[#120f0b]">Tentang Dokter</h4>
                <p className="font-['Inter'] text-[16px] text-[#120f0b] leading-relaxed">{doctor.bio}</p>
              </div>
              <div className="h-[1px] w-full" style={{ background: "rgba(124,96,51,0.3)" }} />
              <div className="flex flex-col gap-4">
                <h4 className="font-serif font-semibold text-[24px] text-[#120f0b]">Jadwal Praktik</h4>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#503d1c] shrink-0" />
                    <span className="font-['Inter'] text-[16px] text-[#120f0b]">
                      <strong>Hari:</strong> {doctor.schedule}
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#503d1c] shrink-0" />
                    <span className="font-['Inter'] text-[16px] text-[#120f0b]">
                      <strong>Jam:</strong> {doctor.hours}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4 mt-auto">
                <Link
                  href="/contact"
                  className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[16px] text-white font-['Lato'] font-semibold text-[16px] capitalize text-center hover:opacity-90 transition-opacity w-full md:w-auto md:self-start"
                >
                  Reservasi
                </Link>
                <p className="font-['Inter'] text-[14px] text-[#503d1c] leading-[1.6]">
                  Availability subject to clinician schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Article = { id: string; img: string; tag: string; title: string };

export function DoctorsPageContent({
  eyebrow,
  heroGradientRgb,
  doctors,
  articles,
}: {
  eyebrow: string;
  /** e.g. "205,114,79" (terracotta) or "63,109,112" (teal) */
  heroGradientRgb: string;
  doctors: Doctor[];
  articles: Article[];
}) {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const rgb = heroGradientRgb;

  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[420px] md:h-[600px] overflow-hidden rounded-b-[60px] md:rounded-b-[100px]">
        <img
          src="/figma/imgDoctorsHero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, rgba(${rgb},1) 0%, rgba(${rgb},0.82) 47%, rgba(${rgb},0.6) 59%, rgba(${rgb},0) 70%)`,
          }}
        />
        <div className="relative z-10 flex flex-col gap-5 md:gap-[42px] max-w-[611px] px-6 md:pl-[100px] pt-[120px] md:pt-[200px]">
          <div className="flex flex-col gap-4 items-start">
            <span
              className="bg-[#b59637] text-white font-['Inter'] font-semibold text-[13px] md:text-[14px] px-[14px] py-2 rounded-full"
              style={{
                boxShadow:
                  "0px 4px 4px -4px rgba(79,81,89,0.32), 0px 2px 5px -2px rgba(79,81,89,0.03), 0px 0px 0px 1px rgba(188,189,194,0.25), 0px 1px 1px rgba(188,189,194,0.2)",
              }}
            >
              {eyebrow}
            </span>
            <h1
              className="font-serif font-normal leading-tight bg-clip-text text-transparent"
              style={{ backgroundImage: HEADING_GRADIENT, fontSize: "clamp(28px, 6vw, 45px)" }}
            >
              Perawatan yang Tepat untuk Kulit Sehat & Tubuh Ideal
            </h1>
            <p className="font-['Inter'] text-white" style={{ fontSize: "clamp(14px, 4vw, 18px)" }}>
              Mulai dari program slimming hingga perawatan kulit, semua treatment dirancang berdasarkan diagnosis
              dokter untuk hasil yang aman dan terarah.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="bg-[#fff8f2] w-full py-[60px] md:py-[100px] px-6 md:px-[100px]">
        <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-[40px] md:gap-[60px]">
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow text="OUR DOCTORS" />
            <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-[#120f0b] capitalize">
              Tim Dokter Kami
            </h2>
            <p className="font-['Inter'] text-[16px] md:text-[18px] text-[#120f0b] max-w-[816px]">
              Setiap pasien ditangani langsung oleh dokter spesialis, memastikan diagnosis yang tepat dan perawatan
              yang sesuai dengan kondisi Anda.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-6 w-full">
            {doctors.map((doc) => (
              <div
                key={doc.name}
                className="flex flex-col items-center gap-8 w-full md:w-[calc(33.333%-16px)] max-w-[397px]"
              >
                <div
                  className="p-[1px] rounded-full w-[260px] h-[260px] md:w-[322px] md:h-[322px]"
                  style={{ background: GOLD_RING }}
                >
                  <div className="rounded-full overflow-hidden w-full h-full">
                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 text-center flex-1">
                  <h3 className="font-serif font-semibold text-[24px] md:text-[26px] text-[#120f0b] capitalize leading-tight">
                    {doc.name}
                  </h3>
                  <p className="font-['Inter'] font-semibold text-[16px] md:text-[18px] text-[#503d1c] uppercase">
                    {doc.specialty}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(doc)}
                  className="mt-auto bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[16px] md:py-[18px] text-white font-serif font-semibold text-[17px] md:text-[18px] hover:opacity-90 transition-opacity w-full max-w-[322px] cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-white w-full py-[60px] md:py-[100px] px-6 md:px-[100px]">
        <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-[40px] md:gap-[60px]">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-[#120f0b] capitalize">
              Articles
            </h2>
            <p className="font-['Inter'] text-[16px] md:text-[18px] text-[#120f0b] max-w-[816px]">
              Artikel dari dokter Prossi Clinic untuk membantu Anda memahami kondisi kulit dan tubuh, sebelum memulai
              perawatan yang tepat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/article/${a.id}`}
                className="bg-[#fff8f2] rounded-[24px] overflow-hidden pb-8 flex flex-col gap-6 hover:opacity-90 transition-opacity"
              >
                <div className="w-full h-[220px] md:h-[260px]">
                  <img src={a.img} alt={a.tag} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-6 px-6 md:px-8">
                  <div className="flex items-center gap-[10px]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#503d1c">
                      <path d="M11.172 2a3 3 0 0 1 2.121.879l7.71 7.71a3.41 3.41 0 0 1 0 4.822l-5.592 5.592a3.41 3.41 0 0 1-4.822 0l-7.71-7.71A3 3 0 0 1 2 11.172V5a3 3 0 0 1 3-3zM7.5 6a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3" />
                    </svg>
                    <span className="font-['Inter'] font-medium text-[14px] text-[#503d1c]">{a.tag}</span>
                  </div>
                  <h3 className="font-serif font-semibold text-[20px] md:text-[24px] text-[#120f0b] leading-snug">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/article"
            className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-[18px] hover:opacity-90 transition-opacity"
          >
            Read More
          </Link>
        </div>
      </section>

      {selected && <DoctorModal doctor={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
