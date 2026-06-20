import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import imgLine4 from "@/assets/figma/imgLine4.svg";
import imgLine2 from "@/assets/figma/imgLine2.svg";
import imgFluentCall24Filled from "@/assets/figma/imgFluentCall24Filled.svg";
import imgEmailIcon from "@/assets/figma/imgEmailIcon.svg";
import imgMdiClockOutline from "@/assets/figma/imgMdiClockOutline.svg";
import imgFaqPlus from "@/assets/figma/imgFaqPlus.svg";
import imgFaqMinus from "@/assets/figma/imgFaqMinus.svg";
import imgGoogleMaps from "@/assets/figma/imgGoogleMaps.png";
import imgContactHero from "@/assets/figma/imgContactHero.png";

function Eyebrow({ text }: { text: string }) {
  return (
    <div className="flex gap-[16px] items-center justify-center overflow-clip relative shrink-0">
      <div className="h-0 relative shrink-0 w-[63px]">
        <div className="absolute inset-[-5.77px_-9.16%_-5.77px_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine4} />
        </div>
      </div>
      <span className="font-['Inter'] font-semibold leading-normal not-italic relative shrink-0 text-[14px] text-[#120f0b] whitespace-nowrap">
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

const faqs = [
  {
    q: "Apakah perlu membuat janji terlebih dahulu?",
    a: "Ya, kami sangat menyarankan untuk membuat janji sebelum kunjungan agar dokter dapat mempersiapkan konsultasi yang optimal sesuai kebutuhan Anda.",
  },
  {
    q: "Berapa lama durasi konsultasi pertama?",
    a: "Konsultasi pertama umumnya berlangsung 30–45 menit. Dokter akan melakukan asesmen menyeluruh sebelum merancang program perawatan yang sesuai.",
  },
  {
    q: "Apakah tersedia konsultasi online?",
    a: "Saat ini kami hanya melayani konsultasi tatap muka di klinik. Ini memastikan dokter dapat melakukan pemeriksaan langsung untuk hasil diagnosis yang akurat.",
  },
  {
    q: "Metode pembayaran apa yang diterima?",
    a: "Kami menerima pembayaran tunai, kartu debit/kredit (Visa, Mastercard), serta transfer bank. Beberapa layanan juga dapat dikover oleh asuransi kesehatan tertentu.",
  },
  {
    q: "Apakah program slimming aman untuk semua orang?",
    a: "Program slimming kami dirancang dokter spesialis gizi klinik dan disesuaikan secara individual. Asesmen medis awal dilakukan untuk memastikan keamanan dan kesesuaian program bagi setiap pasien.",
  },
];

const services = [
  "Slimming Program",
  "Acne & Skin Treatment",
  "Brightening & Glow",
  "Laser & Rejuvenation",
  "Konsultasi Dokter Umum",
  "Konsultasi Gizi Klinik",
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#deba69]/60 last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-['Lato'] font-semibold text-[18px] text-[#120f0b] leading-snug group-hover:text-[#b59637] transition-colors">
          {question}
        </span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-[#b59637] flex items-center justify-center">
          <img
            src={open ? imgFaqMinus : imgFaqPlus}
            alt={open ? "Tutup" : "Buka"}
            className="w-4 h-4"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </span>
      </button>
      {open && (
        <p className="pb-5 font-sans text-[16px] text-[#503d1c] leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f4ece4] flex flex-col font-sans text-[#120f0b] overflow-x-hidden">
      <Header />

      {/* ── Hero ── */}
      <section className="relative w-full h-[400px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imgContactHero}
            alt=""
            className="absolute h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4ece4] from-[8%] via-[#f4ece4]/75 via-[40%] to-transparent to-[65%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f4ece4] from-[0%] to-transparent to-[35%]" />
        </div>
        <div className="relative z-10 max-w-[816px] w-full flex flex-col items-center gap-5 px-6 text-center pb-10 mt-[79px]">
          <Eyebrow text="BOOK APPOINTMENT" />
          <h1 className="font-['Lato'] font-semibold text-[40px] md:text-[52px] text-[#120f0b] capitalize leading-tight">
            Konsultasi dengan Dokter{" "}
            <span className="font-['Arizonia'] text-[#b59637]">Spesialis</span>
          </h1>
          <p className="font-sans text-[17px] text-[#503d1c] max-w-[580px]">
            Isi formulir di bawah dan tim kami akan menghubungi Anda untuk konfirmasi jadwal.
          </p>
        </div>
      </section>

      {/* ── Contact Info Strip ── */}
      <section className="w-full flex justify-center px-6 md:px-[100px] py-10">
        <div className="max-w-[1240px] w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: imgFluentCall24Filled,
              label: "Telepon",
              value: "+(021) 456-7891",
              sub: "Senin – Sabtu, 09.00 – 18.00",
            },
            {
              icon: imgEmailIcon,
              label: "Email",
              value: "info@prossi.com",
              sub: "Balasan dalam 1×24 jam",
            },
            {
              icon: imgMdiClockOutline,
              label: "Jam Operasional",
              value: "Senin – Sabtu",
              sub: "09.00 – 18.00 WIB",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/70 border border-[#deba69]/50 rounded-[24px] px-7 py-6 flex items-start gap-5"
            >
              <div className="shrink-0 w-11 h-11 rounded-full bg-[#b59637]/10 flex items-center justify-center">
                <img src={item.icon} alt={item.label} className="w-5 h-5" style={{ filter: "invert(62%) sepia(51%) saturate(601%) hue-rotate(1deg) brightness(88%) contrast(84%)" }} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-['Inter'] font-semibold text-[12px] uppercase tracking-wider text-[#b59637]">
                  {item.label}
                </span>
                <span className="font-['Lato'] font-semibold text-[17px] text-[#120f0b]">
                  {item.value}
                </span>
                <span className="font-sans text-[14px] text-[#503d1c]/80">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking Form + Map ── */}
      <section className="w-full px-6 md:px-[100px] py-[60px] flex justify-center">
        <div className="max-w-[1240px] w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Form */}
          <div className="bg-white/80 border border-[#deba69]/50 rounded-[32px] p-8 md:p-12 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Eyebrow text="FORMULIR BOOKING" />
              <h2 className="font-['Lato'] font-semibold text-[28px] md:text-[34px] text-[#120f0b] capitalize leading-tight text-center mt-3">
                Buat Janji Konsultasi
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Inter'] font-semibold text-[13px] text-[#503d1c] uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    className="bg-[#f4ece4] border border-[#deba69]/50 rounded-[14px] px-5 py-3.5 text-[15px] text-[#120f0b] placeholder:text-[#120f0b]/40 focus:outline-none focus:border-[#b59637] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Inter'] font-semibold text-[13px] text-[#503d1c] uppercase tracking-wider">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    placeholder="08xx-xxxx-xxxx"
                    className="bg-[#f4ece4] border border-[#deba69]/50 rounded-[14px] px-5 py-3.5 text-[15px] text-[#120f0b] placeholder:text-[#120f0b]/40 focus:outline-none focus:border-[#b59637] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] font-semibold text-[13px] text-[#503d1c] uppercase tracking-wider">
                  Layanan yang Diminati
                </label>
                <div className="relative">
                  <select className="w-full appearance-none bg-[#f4ece4] border border-[#deba69]/50 rounded-[14px] px-5 py-3.5 text-[15px] text-[#120f0b] focus:outline-none focus:border-[#b59637] transition-colors cursor-pointer">
                    <option value="">Pilih layanan...</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#b59637]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="#b59637" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] font-semibold text-[13px] text-[#503d1c] uppercase tracking-wider">
                  Tanggal Kunjungan
                </label>
                <input
                  type="date"
                  className="bg-[#f4ece4] border border-[#deba69]/50 rounded-[14px] px-5 py-3.5 text-[15px] text-[#120f0b] focus:outline-none focus:border-[#b59637] transition-colors cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] font-semibold text-[13px] text-[#503d1c] uppercase tracking-wider">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={4}
                  placeholder="Ceritakan keluhan atau kebutuhan Anda..."
                  className="bg-[#f4ece4] border border-[#deba69]/50 rounded-[14px] px-5 py-3.5 text-[15px] text-[#120f0b] placeholder:text-[#120f0b]/40 focus:outline-none focus:border-[#b59637] transition-colors resize-none"
                />
              </div>

              <button className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[16px] text-white font-serif font-semibold text-[18px] hover:opacity-90 transition-opacity w-full mt-2">
                Kirim Permintaan
              </button>
            </div>
          </div>

          {/* Map + Address */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[32px] overflow-hidden border border-[#deba69]/50 shadow-sm">
              <img
                src={imgGoogleMaps}
                alt="Lokasi Prossi Clinic"
                className="w-full object-cover"
                style={{ maxHeight: "420px", objectPosition: "center" }}
              />
            </div>
            <div className="bg-white/80 border border-[#deba69]/50 rounded-[24px] px-7 py-6 flex flex-col gap-4">
              <h3 className="font-serif font-semibold text-[20px] text-[#120f0b]">
                Prossi Clinic
              </h3>
              <p className="font-sans text-[15px] text-[#503d1c] leading-relaxed">
                Jl. Sudirman No. 88, Karet Tengsin,<br />
                Tanah Abang, Jakarta Pusat 10220
              </p>
              <div className="flex flex-col gap-2 pt-2 border-t border-[#deba69]/30">
                <div className="flex items-center gap-3 text-[14px] text-[#503d1c]">
                  <img src={imgMdiClockOutline} alt="" className="w-4 h-4 opacity-70" style={{ filter: "invert(39%) sepia(20%) saturate(1200%) hue-rotate(3deg) brightness(82%) contrast(85%)" }} />
                  <span>Senin – Sabtu: 09.00 – 18.00 WIB</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-[#503d1c]">
                  <img src={imgFluentCall24Filled} alt="" className="w-4 h-4 opacity-70" style={{ filter: "invert(39%) sepia(20%) saturate(1200%) hue-rotate(3deg) brightness(82%) contrast(85%)" }} />
                  <span>+(021) 456-7891</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full px-6 md:px-[100px] py-[80px] flex flex-col items-center bg-white/40">
        <div className="max-w-[816px] w-full flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <Eyebrow text="FAQ" />
            <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-[#120f0b] capitalize leading-tight">
              Pertanyaan yang{" "}
              <span className="font-['Arizonia'] text-[#b59637]">Sering</span> Diajukan
            </h2>
          </div>

          <div className="w-full bg-white/70 border border-[#deba69]/50 rounded-[32px] px-8 md:px-12 py-2">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
