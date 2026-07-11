"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Step = "register" | "verify" | "done";

const inputCls =
  "w-full h-10 bg-white border border-[#dbdbdb] rounded px-[9px] font-['Readex_Pro',sans-serif] text-[16px] text-[#292929] placeholder:text-[#aeafaf] outline-none focus:border-[#b59637] transition-colors";

const CODE_LENGTH = 6;

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

  const [registeredPhone, setRegisteredPhone] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step !== "verify" || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step, secondsLeft]);

  const requestCode = async (): Promise<boolean> => {
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
        return false;
      }
      setRegisteredPhone(json.phone);
      setSecondsLeft(json.expiresInSeconds ?? 300);
      setDigits(Array(CODE_LENGTH).fill(""));
      setVerifyError(null);
      return true;
    } catch {
      setError("Tidak bisa terhubung ke server.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (await requestCode()) setStep("verify");
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || submitting) return;
    await requestCode();
  };

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < clean.length && index + i < CODE_LENGTH; i++) {
        next[index + i] = clean[i];
      }
      return next;
    });
    const nextIndex = Math.min(index + clean.length, CODE_LENGTH - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== CODE_LENGTH) {
      setVerifyError("Masukkan 6 digit kode.");
      return;
    }
    setVerifying(true);
    setVerifyError(null);
    try {
      const res = await fetch("/api/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: registeredPhone, code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setVerifyError(json.error ?? "Kode salah, coba lagi.");
        return;
      }
      localStorage.setItem(
        "prossi_member",
        JSON.stringify({ id: json.id, full_name: json.full_name, email: json.email, phone: json.phone })
      );
      setStep("done");
    } catch {
      setVerifyError("Tidak bisa terhubung ke server.");
    } finally {
      setVerifying(false);
    }
  };

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
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

      {/* ── Step 2: Verifikasi kode 6 digit via WhatsApp — modal over scrim ── */}
      {step === "verify" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div
            className="bg-white rounded-[8px] w-full max-w-[661px] px-6 py-10 md:px-12 md:py-[45px] flex flex-col items-center gap-[49px] my-auto text-center"
            style={{ boxShadow: "0 0 1px rgba(0,10,55,0.31), 0 3px 5px rgba(0,10,55,0.2)" }}
          >
            <div className="flex flex-col gap-[5px] w-full">
              <h1 className="font-['Readex_Pro',sans-serif] font-semibold text-[26px] md:text-[30px] leading-[42px] text-[#292929]">
                Verifikasi Nomor Anda
              </h1>
              <p className="font-['Readex_Pro',sans-serif] text-[16px] md:text-[18px] leading-[26px] text-[#292929]">
                Masukkan 6 digit kode yang kami kirim melalui WhatsApp ke <strong>{registeredPhone}</strong>
              </p>
            </div>

            <div className="flex gap-3 w-full justify-center">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={CODE_LENGTH}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-[56px] h-[64px] md:w-[70px] md:h-[70px] text-center border border-[#b6b7b7] rounded-lg font-['MADE_Outer_Sans',sans-serif] font-bold text-[32px] text-[#292929] outline-none focus:border-[#b59637] transition-colors"
                />
              ))}
            </div>

            {verifyError && (
              <p className="font-['Readex_Pro',sans-serif] text-[14px] text-red-600 -mt-6">{verifyError}</p>
            )}

            <p className="font-['Readex_Pro',sans-serif] text-[16px] md:text-[18px] text-[#292929] -mt-6">
              {secondsLeft > 0 ? (
                `Kirim ulang kode dalam ${formatCountdown(secondsLeft)}`
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={submitting}
                  className="text-[#4d66d7] font-medium hover:underline cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Mengirim ulang..." : "Kirim Ulang Kode"}
                </button>
              )}
            </p>

            <div className="flex flex-col gap-3 w-full max-w-[426px]">
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying}
                className="w-full bg-[#b59637] rounded-[20px] px-4 py-3 text-white font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {verifying ? "Memverifikasi..." : "Lanjutkan"}
              </button>
              <button
                type="button"
                onClick={() => setStep("register")}
                className="w-full bg-transparent border-2 border-[#b59637] rounded-[30px] px-4 py-3 text-[#b59637] font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:bg-[#b59637]/10 transition-colors cursor-pointer"
              >
                Ganti Nomor Telepon
              </button>
            </div>

            <HelpFooter />
          </div>
        </div>
      )}

      {/* ── Success ── */}
      {step === "done" && (
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
