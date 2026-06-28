"use client";

import Link from "next/link";
import { useState } from "react";
import type { Article } from "./articles";

const VISIBLE = 3;

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <div className="flex flex-col gap-8 flex-1 min-w-0">
      <div
        className="rounded-[20px] overflow-hidden w-full"
        style={{ height: 246, background: "#FFE3E7" }}
      >
        <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-2">
        <p
          className="font-['Inter',sans-serif] font-bold text-[#B41833]"
          style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
        >
          {article.date}
        </p>
        <h3
          className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#0D1F3E]"
          style={{ fontSize: 20, lineHeight: "30px" }}
        >
          {article.title}
        </h3>
        <p
          className="font-['Inter',sans-serif] font-medium text-[#4A576F]"
          style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
        >
          {article.excerpt}
        </p>
      </div>
      <div>
        <Link
          href={`/article/${article.id}`}
          className="inline-flex items-center justify-center rounded-[8px] font-['Inter',sans-serif] font-semibold text-[14px] text-[#11151C] hover:bg-[#f4ece4] transition-colors"
          style={{ padding: "12px 16px", lineHeight: "22px" }}
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export function MoreToRead({ articles }: { articles: Article[] }) {
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, articles.length - VISIBLE);
  const visible = articles.slice(start, start + VISIBLE);

  return (
    <div className="bg-white flex flex-col gap-[47px] px-6 py-12 md:px-[160px] md:py-[100px]">
      <h2
        className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#11151C]"
        style={{ fontSize: 28, lineHeight: "34px" }}
      >
        More to read...
      </h2>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-[30px] items-stretch">
          {visible.map((a) => (
            <RelatedCard key={a.id} article={a} />
          ))}
        </div>

        {/* carousel arrows */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setStart((s) => Math.max(0, s - 1))}
            disabled={start === 0}
            className="flex items-center justify-center rounded-[8px] bg-[#11151C] text-white p-3 transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
            disabled={start >= maxStart}
            className="flex items-center justify-center rounded-[8px] bg-[#11151C] text-white p-3 transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
