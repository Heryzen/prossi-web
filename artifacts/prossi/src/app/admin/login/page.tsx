"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Password salah"); return; }
      localStorage.setItem("prossi_admin_token", json.token);
      router.push("/admin/orders");
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-8">
          <p className="font-['Inter',sans-serif] text-[11px] font-semibold tracking-widest uppercase text-[#b59637] mb-1">
            Prossi Clinic
          </p>
          <h1 className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[22px] text-[#11151c]">
            Admin Panel
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[16px] border border-[#e6ecf7] px-6 py-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="pw" className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#3b4963]">
              Password Admin
            </label>
            <input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="border border-[#dde3f0] rounded-[10px] px-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#11151c] outline-none focus:border-[#b59637] transition-colors"
            />
          </div>
          {error && (
            <p className="font-['Inter',sans-serif] text-[13px] text-[#a8312a] bg-[#fdf0ee] rounded-[8px] px-4 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="bg-[#b59637] rounded-[100px] py-3 text-white font-['Inter',sans-serif] font-semibold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
