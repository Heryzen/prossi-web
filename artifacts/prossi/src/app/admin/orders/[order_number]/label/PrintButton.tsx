"use client";

import { useEffect } from "react";

export default function PrintButton({ hasTracking }: { hasTracking: boolean }) {
  useEffect(() => {
    if (!hasTracking) {
      // No barcode to wait for — print immediately
      window.print();
      return;
    }

    // Wait for barcode to be ready, with 3s fallback
    let fired = false;
    const doPrint = () => {
      if (fired) return;
      fired = true;
      window.print();
    };

    const timeout = setTimeout(doPrint, 3000);
    window.addEventListener("barcode-ready", doPrint, { once: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("barcode-ready", doPrint);
    };
  }, [hasTracking]);

  return null;
}
