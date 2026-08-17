"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** e.g. "10+", "15,000+", "92%" */
  value: string;
  durationMs?: number;
  className?: string;
};

/** Counts up to the numeric part of `value` when scrolled into view, keeping any prefix/suffix. */
export function CountUp({ value, durationMs = 1700, className }: Props) {
  const match = value.match(/^(\D*)([\d.,]+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? "0";
  const suffix = match?.[3] ?? "";
  const hasComma = numStr.includes(",");
  const target = parseFloat(numStr.replace(/,/g, "")) || 0;

  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min((t - t0) / durationMs, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(target * eased);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, durationMs]);

  const rounded = Math.round(n);
  const formatted = hasComma ? rounded.toLocaleString("en-US") : String(rounded);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
