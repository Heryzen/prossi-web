"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full h-10 bg-white border border-[#dbdbdb] rounded px-[9px] font-['Readex_Pro',sans-serif] text-[16px] text-[#292929] placeholder:text-[#aeafaf] outline-none focus:border-[#b59637] transition-colors";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal masuk, coba lagi.");
        return;
      }
      localStorage.setItem("prossi_member", JSON.stringify(json));
      router.push("/");
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Homepage backdrop — konsisten dengan /register */}
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

      <div className="relative z-10 flex justify-end min-h-screen">
        <div className="bg-white w-full md:w-[646px] min-h-screen px-6 md:px-[72px] pt-[120px] pb-16 flex flex-col justify-center" style={{ boxShadow: "-10px 0 40px rgba(0,10,55,0.15)" }}>
          <h1 className="font-['Readex_Pro',sans-serif] font-semibold text-[26px] md:text-[30px] leading-[42px] text-[#292929] mb-8 md:mb-12">
            Masuk
          </h1>

          <form className="flex flex-col gap-9" onSubmit={handleSubmit}>
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
              <label className="font-['Readex_Pro',sans-serif] text-[14px] text-black">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className={inputCls}
              />
            </div>

            {error && <p className="font-['Readex_Pro',sans-serif] text-[14px] text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#b59637] rounded-[20px] px-4 py-3 text-white font-['Lato'] font-medium text-[16px] uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Memproses..." : "Masuk"}
            </button>

            <p className="font-['Readex_Pro',sans-serif] text-[14px] leading-[20px] text-[#292929] text-center">
              Belum punya akun?{" "}
              <Link href="/register" className="text-[#607dff] underline">
                Register di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
