"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Step = "register" | "choose-method" | "verify" | "done";
type VerifyMethod = "sms" | "wa";

const inputCls =
  "w-full h-10 bg-white border border-[#dbdbdb] rounded px-[9px] font-['Readex_Pro',sans-serif] text-[16px] text-[#292929] placeholder:text-[#aeafaf] outline-none focus:border-[#b59637] transition-colors";

const CODE_LENGTH = 6;

type PendingMember = { id: string; full_name: string; email: string; phone: string };

// Format phone for display: "081234567890" → "+62 81234567890"
function formatPhoneDisplay(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const withoutLeadingZero = digits.startsWith("0") ? digits.slice(1) : digits;
  return `+62 ${withoutLeadingZero}`;
}

function SmsIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.667 4H5.333A2.667 2.667 0 0 0 2.667 6.667v16A2.667 2.667 0 0 0 5.333 25.333h2.667v4l5.333-4h13.334A2.667 2.667 0 0 0 29.333 22.667v-16A2.667 2.667 0 0 0 26.667 4Z" stroke="#292929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.667 14.667h10.666M10.667 10.667h10.666" stroke="#292929" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.05 4.91C18.1332 3.98392 17.0412 3.24967 15.8376 2.75005C14.634 2.25043 13.3431 1.99546 12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91ZM12.04 20.15C10.56 20.15 9.11 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.81 13.46 3.81 11.91C3.81 7.37 7.49 3.69 12.04 3.69C14.24 3.69 16.31 4.55 17.86 6.1C18.6265 6.86354 19.2312 7.77303 19.6388 8.77497C20.0465 9.77691 20.249 10.8509 20.24 11.93C20.26 16.48 16.58 20.15 12.04 20.15ZM16.56 13.99C16.31 13.87 15.09 13.27 14.87 13.18C14.64 13.1 14.48 13.06 14.31 13.3C14.14 13.55 13.67 14.11 13.53 14.27C13.39 14.44 13.24 14.46 12.99 14.33C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.48 11.14 9.6 11.01 9.73 10.88C9.84 10.77 9.98 10.59 10.1 10.45C10.22 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.49 9.77 8.27 9.57 7.77C9.37 7.29 9.16 7.35 9.01 7.34H8.53C8.36 7.34 8.1 7.4 7.87 7.65C7.65 7.9 7 8.5 7 9.72C7 10.94 7.9 12.12 8.02 12.28C8.14 12.45 9.77 14.94 12.25 16.01C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.69 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.03 14.27C16.96 14.16 16.81 14.11 16.56 13.99Z" fill="#292929"/>
    </svg>
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

  const [pendingMember, setPendingMember] = useState<PendingMember | null>(null);
  const [registeredPhone, setRegisteredPhone] = useState("");
  const [waLink, setWaLink] = useState("");
  const [verifyMethod, setVerifyMethod] = useState<VerifyMethod | null>(null);

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [otpId, setOtpId] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // useRef keeps a stable array across renders — fixes stale closure bug of plain array
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(CODE_LENGTH).fill(null));

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

      const message = `Halo, saya ${json.full_name} baru saja mendaftar di Prossi Clinic.`;
      const link = `https://wa.me/${String(json.waNumber ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      setWaLink(link);

      setPendingMember({ id: json.id, full_name: json.full_name, email: json.email, phone: json.phone });
      setRegisteredPhone(json.phone ?? phone);
      setDigits(Array(CODE_LENGTH).fill(""));
      setVerifyError(null);
      setStep("choose-method");
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectMethod = async (method: VerifyMethod) => {
    setVerifyMethod(method);
    setOtpLoading(true);
    setVerifyError(null);

    try {
      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: registeredPhone, channel: method }),
      });
      const json = await res.json();
      if (!res.ok) {
        setVerifyError(json.error ?? "Gagal mengirim OTP, coba lagi.");
        setOtpLoading(false);
        return;
      }
      setOtpId(json.otpId);
    } catch {
      setVerifyError("Tidak bisa terhubung ke server OTP.");
      setOtpLoading(false);
      return;
    }

    setOtpLoading(false);
    setStep("verify");
  };

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/[^a-zA-Z0-9]/g, "");
    setDigits((prev) => {
      const next = [...prev];
      if (!clean) {
        next[index] = "";
        return next;
      }
      for (let i = 0; i < clean.length && index + i < CODE_LENGTH; i++) {
        next[index + i] = clean[i];
      }
      return next;
    });
    if (clean) {
      const nextIndex = Math.min(index + clean.length, CODE_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setVerifyError("Masukkan kode 6 digit yang dikirim.");
      return;
    }

    // SMS: verify via Fazpass
    if (verifyMethod === "sms" && otpId) {
      setVerifying(true);
      setVerifyError(null);
      try {
        const res = await fetch("/api/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otpId, otp: code }),
        });
        const json = await res.json();
        if (!res.ok) {
          setVerifyError(json.error ?? "Kode OTP tidak valid.");
          setVerifying(false);
          return;
        }
      } catch {
        setVerifyError("Tidak bisa terhubung ke server.");
        setVerifying(false);
        return;
      }
      setVerifying(false);
    }

    // WA: kode apapun diterima (verifikasi via chat WA)
    if (pendingMember) {
      localStorage.setItem("prossi_member", JSON.stringify(pendingMember));
    }
    setStep("done");
  };

  const displayPhone = formatPhoneDisplay(registeredPhone || phone);

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

      {/* ── Step 1: Register form ── */}
      {step === "register" && (
        <div className="relative z-10 flex justify-end min-h-screen">
          <div
            className="bg-white w-full md:w-[646px] min-h-screen px-6 md:px-[72px] pt-[120px] pb-16 flex flex-col justify-center"
            style={{ boxShadow: "-10px 0 40px rgba(0,10,55,0.15)" }}
          >
            <h1 className="font-['Readex_Pro',sans-serif] font-semibold text-[26px] md:text-[30px] leading-[42px] text-[#292929] mb-8 md:mb-12">
              Register
            </h1>

            <form className="flex flex-col gap-9" onSubmit={handleSubmit} autoComplete="off">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Readex_Pro',sans-serif] text-[14px] text-black">Full name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  autoComplete="off"
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
                  autoComplete="off"
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
                    placeholder="8xxxxxxxxxx"
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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

      {/* ── Step 2: Choose verification method (Figma 579-9234) ── */}
      {step === "choose-method" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div
            className="bg-white rounded-[8px] w-full max-w-[661px] flex flex-col gap-[49px] my-auto"
            style={{
              padding: "45px 48px",
              boxShadow: "0px 0px 1px 0px rgba(0,10,55,0.31), 0px 3px 5px 0px rgba(0,10,55,0.2)",
            }}
          >
            {/* Header — gap 5px, centered */}
            <div className="flex flex-col gap-[5px] items-center text-center">
              <h1
                className="font-['Readex_Pro',sans-serif] font-semibold text-[#292929]"
                style={{ fontSize: 30, lineHeight: "42px" }}
              >
                Verify Your Number
              </h1>
              <p
                className="font-['Readex_Pro',sans-serif] font-normal text-[#292929]"
                style={{ fontSize: 18, lineHeight: "26px" }}
              >
                Please select an authentication method
              </p>
            </div>

            {/* Method options — gap 16px */}
            <div className="flex flex-col gap-[16px]">
              {/* SMS */}
              <button
                type="button"
                onClick={() => handleSelectMethod("sms")}
                disabled={otpLoading}
                className="flex items-center bg-white border border-[#E7E7E7] rounded-[2px] text-left w-full hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer outline-none focus:outline-none"
                style={{ padding: 12, gap: 12 }}
              >
                <div className="shrink-0"><SmsIcon /></div>
                <div className="flex flex-col justify-center" style={{ gap: 0 }}>
                  <span
                    className="font-['Readex_Pro',sans-serif] font-normal text-[#292929]"
                    style={{ fontSize: 18, lineHeight: "26px" }}
                  >
                    {otpLoading && verifyMethod === "sms" ? "Mengirim kode..." : "Get the code sent by SMS"}
                  </span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span
                      className="font-['Readex_Pro',sans-serif] font-normal text-[#868787]"
                      style={{ fontSize: 14, lineHeight: "20px" }}
                    >
                      Send code to number {displayPhone}
                    </span>
                  </div>
                </div>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => handleSelectMethod("wa")}
                disabled={otpLoading}
                className="flex items-center bg-white border border-[#E7E7E7] rounded-[2px] text-left w-full hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer outline-none focus:outline-none"
                style={{ padding: 12, gap: 12 }}
              >
                <div className="shrink-0"><WhatsAppIcon /></div>
                <div className="flex flex-col justify-center" style={{ gap: 0 }}>
                  <span
                    className="font-['Readex_Pro',sans-serif] font-normal text-[#292929]"
                    style={{ fontSize: 18, lineHeight: "26px" }}
                  >
                    {otpLoading && verifyMethod === "wa" ? "Mengirim kode..." : "Get the code sent by WhatsApp"}
                  </span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span
                      className="font-['Readex_Pro',sans-serif] font-normal text-[#868787]"
                      style={{ fontSize: 14, lineHeight: "20px" }}
                    >
                      Send code to number {displayPhone}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {verifyError && (
              <p className="font-['Readex_Pro',sans-serif] text-[14px] text-red-600 text-center -mt-8">{verifyError}</p>
            )}

            {/* Footer — row, center, gap 10px */}
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: 10 }}
            >
              <span
                className="font-['Readex_Pro',sans-serif] font-normal text-[#292929]"
                style={{ fontSize: 18, lineHeight: "26px" }}
              >
                Need help?
              </span>
              <a
                href="mailto:info@prossi.com"
                className="font-['Readex_Pro',sans-serif] font-medium text-[#4D66D7] hover:underline"
                style={{ fontSize: 18, lineHeight: "26px" }}
              >
                Contact Prossi Help Center
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Input verification code ── */}
      {step === "verify" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div
            className="bg-white rounded-[8px] w-full max-w-[661px] px-6 py-10 md:px-12 md:py-[45px] flex flex-col items-center gap-9 my-auto text-center"
            style={{ boxShadow: "0 0 1px rgba(0,10,55,0.31), 0 3px 5px rgba(0,10,55,0.2)" }}
          >
            <div className="flex flex-col gap-[5px] w-full">
              <h1 className="font-['Readex_Pro',sans-serif] font-semibold text-[26px] md:text-[30px] leading-[42px] text-[#292929]">
                Verifikasi Nomor Anda
              </h1>
              <p className="font-['Readex_Pro',sans-serif] text-[16px] md:text-[18px] leading-[26px] text-[#292929]">
                Masukkan kode yang kami kirim melalui{" "}
                <strong>{verifyMethod === "wa" ? "WhatsApp" : "SMS"}</strong> ke{" "}
                <strong>{displayPhone}</strong>
              </p>
            </div>

            <div className="flex gap-3 w-full justify-center">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={CODE_LENGTH}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-[42px] h-[56px] md:w-[56px] md:h-[64px] text-center border border-[#b6b7b7] rounded-lg font-['MADE_Outer_Sans',sans-serif] font-bold text-[24px] md:text-[32px] text-[#292929] outline-none focus:border-[#b59637] transition-colors"
                />
              ))}
            </div>

            {verifyError && (
              <p className="font-['Readex_Pro',sans-serif] text-[14px] text-red-600 -mt-6">{verifyError}</p>
            )}

            <div className="flex flex-col gap-3 w-full max-w-[426px]">
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying}
                className="w-full bg-[#b59637] rounded-[20px] px-4 py-3 text-white font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {verifying ? "Memverifikasi..." : "Lanjutkan"}
              </button>
              <button
                type="button"
                onClick={() => setStep("choose-method")}
                className="w-full bg-transparent border-2 border-[#b59637] rounded-[30px] px-4 py-3 text-[#b59637] font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:bg-[#b59637]/10 transition-colors cursor-pointer"
              >
                Ganti Metode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Success ── */}
      {step === "done" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div
            className="bg-white rounded-[8px] w-full max-w-[661px] px-6 py-10 md:px-12 md:py-[60px] flex flex-col items-center gap-8 text-center my-auto"
            style={{ boxShadow: "0 0 1px rgba(0,10,55,0.31), 0 3px 5px rgba(0,10,55,0.2)" }}
          >
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
