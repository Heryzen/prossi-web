"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Fade out after the intro plays (instant if already seen this session).
  useEffect(() => {
    const seen = sessionStorage.getItem("prossiLoaderSeen");
    sessionStorage.setItem("prossiLoaderSeen", "1");
    const t = setTimeout(() => setHidden(true), seen ? 0 : 2100);
    return () => clearTimeout(t);
  }, []);

  // Unmount once the fade-out transition finishes.
  useEffect(() => {
    if (!hidden) return;
    const t = setTimeout(() => setRemoved(true), 700);
    return () => clearTimeout(t);
  }, [hidden]);

  if (removed) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background:
          "radial-gradient(120% 120% at 50% 35%, #fbf4ea 0%, #f4ece4 45%, #ecdcc8 100%)",
        opacity: hidden ? 0 : 1,
        transition: "opacity 650ms cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      {/* soft glow accent */}
      <div
        className="absolute"
        style={{
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(181,150,55,0.16) 0%, rgba(181,150,55,0) 65%)",
          filter: "blur(8px)",
          animation: "prossiBreathe 3.4s ease-in-out infinite",
        }}
      />

      <div className="relative flex flex-col items-center prossi-loader-word" style={{ gap: 18 }}>
        <img
          src="/figma/imgUntitledDesign181.webp"
          alt="Prossi Clinic"
          className="w-[160px] h-[90px] object-contain"
        />

        {/* Drawing gold divider */}
        <div
          className="prossi-loader-line"
          style={{
            height: 1.5,
            width: 200,
            background:
              "linear-gradient(90deg, rgba(124,96,51,0) 0%, #b59637 50%, rgba(124,96,51,0) 100%)",
          }}
        />
      </div>
    </div>
  );
}
