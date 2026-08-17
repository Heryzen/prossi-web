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

      <div className="relative flex flex-col items-center" style={{ gap: 18 }}>
        {/* Wordmark with sweeping gold shimmer */}
        <h1
          className="prossi-loader-word"
          style={{
            fontFamily: "'Source Serif 4', 'Source Serif Pro', serif",
            fontWeight: 600,
            fontSize: "clamp(48px, 9vw, 80px)",
            letterSpacing: "0.04em",
            lineHeight: 1,
            backgroundImage:
              "linear-gradient(100deg, #8a6a22 0%, #b59637 28%, #f6e6b4 50%, #b59637 72%, #8a6a22 100%)",
            backgroundSize: "220% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          PROSSI
        </h1>

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

        {/* CLINIC, letter-spaced reveal */}
        <span
          className="prossi-loader-sub"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.62em",
            textIndent: "0.62em",
            color: "#7c6033",
            textTransform: "uppercase",
          }}
        >
          Clinic
        </span>
      </div>
    </div>
  );
}
