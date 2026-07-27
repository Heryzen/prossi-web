"use client";

import { useState } from "react";

export default function PayButton({ orderNumber }: { orderNumber: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      if (process.env.NEXT_PUBLIC_PAYMENT_MOCK === "true") {
        const res = await fetch("/api/payment/mock-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_number: orderNumber }),
        });
        if (!res.ok) {
          const j = await res.json();
          setError(j.error ?? "Gagal memproses pembayaran.");
          return;
        }
        window.location.reload();
        return;
      }

      // Real Midtrans snap
      const midRes = await fetch("/api/payment/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: orderNumber }),
      });
      const midJson = await midRes.json();
      if (!midRes.ok) {
        setError(midJson.error ?? "Gagal memulai pembayaran.");
        return;
      }
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(midJson.snap_token, {
        onSuccess: () => window.location.reload(),
        onPending: () => window.location.reload(),
        onError: () => setError("Pembayaran gagal. Silakan coba lagi."),
        onClose: () => {},
      });
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-fit bg-[#b59637] rounded-[100px] px-9 py-3 text-white font-['Inter',sans-serif] font-semibold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>
      {error && (
        <p className="font-['Inter',sans-serif] text-[13px] text-[#a8312a]">{error}</p>
      )}
    </div>
  );
}
