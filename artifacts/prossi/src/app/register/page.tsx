"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Step = "register" | "verify";

const inputCls =
  "w-full h-10 bg-white border border-[#dbdbdb] rounded px-[9px] font-['Readex_Pro',sans-serif] text-[16px] text-[#292929] placeholder:text-[#aeafaf] outline-none focus:border-[#b59637] transition-colors";

function HelpFooter() {
  return (
    <div className="flex items-center justify-center gap-[10px] flex-wrap">
      <span className="font-['Readex_Pro',sans-serif] text-[16px] md:text-[18px] text-[#292929]">Need help?</span>
      <Link href="/contact" className="font-['Readex_Pro',sans-serif] font-medium text-[16px] md:text-[18px] text-[#4d66d7] hover:underline">
        Contact Prossi Help Center
      </Link>
    </div>
  );
}

export default function Register() {
  const [step, setStep] = useState<Step>("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [waLink, setWaLink] = useState("");
  const [registeredPhone, setRegisteredPhone] = useState("");
  const [done, setDone] = useState(false);

  // polling status verifikasi selama step verify
  useEffect(() => {
    if (step !== "verify" || done) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/register/status?phone=${encodeURIComponent(registeredPhone)}`);
        const json = await res.json();
        if (json.status === "active") setDone(true);
      } catch {
        /* keep polling */
      }
    }, 3000);
    return () => clearInterval(t);
  }, [step, done, registeredPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, phone, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Terjadi kesalahan, coba lagi.");
        return;
      }
      setCode(json.code);
      setWaLink(json.waLink);
      setRegisteredPhone(json.phone);
      setStep("verify");
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Homepage backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#f4ece4]">
        <img
          src="/figma/imgRegisterHero-5effb0.png"
          alt=""
          className="absolute left-0 top-0 h-full w-full md:w-[calc(100%-646px)] object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(244,236,228,1) 14%, rgba(244,236,228,0.85) 48%, rgba(244,236,228,0) 62%)",
          }}
        />
      </div>

      {/* ── Step 1: Register form — right-side panel over homepage ── */}
      {step === "register" && (
        <div className="relative z-10 flex justify-end min-h-screen">
          <div className="bg-white w-full md:w-[646px] min-h-screen px-6 md:px-[72px] pt-[120px] pb-16 flex flex-col justify-center" style={{ boxShadow: "-10px 0 40px rgba(0,10,55,0.15)" }}>
            <h1 className="font-['Readex_Pro',sans-serif] font-semibold text-[26px] md:text-[30px] leading-[42px] text-[#292929] mb-8 md:mb-12">
              Register
            </h1>

            <form className="flex flex-col gap-9" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] text-black">Full name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] text-black">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prossi@yahoo.com"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] text-black">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-between gap-1 w-[105px] h-10 bg-white border border-[#dbdbdb] rounded px-[9px] shrink-0">
                    <span className="font-['Readex_Pro',sans-serif] text-[16px] text-[#292929]">🇮🇩 +62</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#292929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter Phone Number"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] text-black">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] text-black">Confirm Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className={inputCls}
                />
              </div>

              {error && (
                <p className="font-['Readex_Pro',sans-serif] text-[14px] text-red-600">{error}</p>
              )}

              <p className="font-['Readex_Pro',sans-serif] text-[14px] leading-[20px] text-[#292929]">
                By signing up, you are agreeing to our{" "}
                <Link href="/privacy" className="text-[#607dff] underline">
                  Privacy Policy &amp; Term of Use
                </Link>
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#b59637] rounded-[20px] px-4 py-3 text-white font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Memproses..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Step 2: Reverse OTP via WhatsApp — modal over scrim ── */}
      {step === "verify" && !done && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-[8px] w-full max-w-[661px] px-6 py-10 md:px-12 md:py-[45px] flex flex-col items-center gap-8 my-auto text-center" style={{ boxShadow: "0 0 1px rgba(0,10,55,0.31), 0 3px 5px rgba(0,10,55,0.2)" }}>
            <div className="flex flex-col gap-[5px]">
              <h1 className="font-['Readex_Pro',sans-serif] font-semibold text-[26px] md:text-[30px] leading-[42px] text-[#292929]">
                Verifikasi via WhatsApp
              </h1>
              <p className="font-['Readex_Pro',sans-serif] text-[16px] md:text-[18px] leading-[26px] text-[#292929]">
                Kirim kode di bawah ini dari nomor <strong>{registeredPhone}</strong> ke WhatsApp resmi Prossi Clinic
              </p>
            </div>

            {/* Kode verifikasi */}
            <div className="bg-[#f4ece4] border-2 border-dashed border-[#b59637] rounded-[12px] px-8 py-5">
              <span className="font-mono font-bold text-[28px] md:text-[36px] text-[#503d1c] tracking-wider">
                {code}
              </span>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[426px] bg-[#25D366] rounded-[20px] px-4 py-3 text-white font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2a10 10 0 0 0-8.53 15.23L2 22l4.9-1.44A10 10 0 1 0 12 2m0 2a8 8 0 1 1-4.29 14.77l-.31-.19-2.9.85.87-2.82-.2-.32A8 8 0 0 1 12 4m-3.15 3.9c-.2 0-.5.07-.77.36-.26.29-1 1-1 2.43s1.03 2.82 1.17 3.01c.14.19 2 3.19 4.93 4.35 2.44.96 2.94.77 3.47.72.53-.05 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34-.29-.14-1.7-.84-1.97-.93-.26-.1-.46-.14-.65.14-.19.29-.74.94-.91 1.13-.17.19-.34.22-.62.07-.29-.14-1.21-.44-2.3-1.42-.85-.75-1.42-1.69-1.59-1.97-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49z" />
              </svg>
              Buka WhatsApp &amp; Kirim Kode
            </a>

            {/* Status menunggu */}
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full border-2 border-[#b59637] border-t-transparent animate-spin" />
              <span className="font-['Readex_Pro',sans-serif] text-[14px] md:text-[16px] text-[#868787]">
                Menunggu verifikasi... halaman akan lanjut otomatis setelah kode diterima
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep("register")}
              className="w-full max-w-[426px] bg-transparent border-2 border-[#b59637] rounded-[30px] px-4 py-3 text-[#b59637] font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:bg-[#b59637]/10 transition-colors cursor-pointer"
            >
              Ubah Data / Nomor
            </button>

            <HelpFooter />
          </div>
        </div>
      )}

      {/* ── Success ── */}
      {done && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-[8px] w-full max-w-[661px] px-6 py-10 md:px-12 md:py-[60px] flex flex-col items-center gap-8 text-center my-auto" style={{ boxShadow: "0 0 1px rgba(0,10,55,0.31), 0 3px 5px rgba(0,10,55,0.2)" }}>
            <div className="w-16 h-16 rounded-full bg-[#b59637] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-['Readex_Pro',sans-serif] font-semibold text-[26px] md:text-[30px] text-[#292929]">
                Registration Complete
              </h1>
              <p className="font-['Readex_Pro',sans-serif] text-[16px] md:text-[18px] text-[#292929]">
                Selamat datang di Prossi Clinic, {fullName.split(" ")[0] || "there"}!
              </p>
            </div>
            <Link
              href="/"
              className="bg-[#b59637] rounded-[20px] px-8 py-3 text-white font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
