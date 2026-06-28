"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  allArticles,
  ITEMS_PER_PAGE,
  TOTAL_PAGES,
  type Article,
} from "./articles";

const categories = ["Spesialis Gizi", "Spesialis Kulit", "Dokter Estetika"];

function ArticleCard({ id, title, date, excerpt, img }: Article) {
  return (
    <article className="flex flex-col md:flex-row items-stretch gap-8 w-full">
      <div
        className="rounded-[20px] overflow-hidden shrink-0 w-full md:w-[440px]"
        style={{ height: 246, background: "#FFE3E7" }}
      >
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-5 flex-1 justify-center">
        <div className="flex flex-col gap-1">
          <h3
            className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#0D1F3E]"
            style={{ fontSize: 20, lineHeight: "30px" }}
          >
            {title}
          </h3>
          <p
            className="font-['Inter',sans-serif] font-bold text-[#11151C]"
            style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
          >
            {date}
          </p>
        </div>
        <p
          className="font-['Inter',sans-serif] font-medium text-[#3B4963]"
          style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
        >
          {excerpt}
        </p>
        <div>
          <Link
            href={`/article/${id}`}
            className="inline-flex items-center justify-center rounded-[8px] font-['Inter',sans-serif] font-semibold text-[14px] text-[#11151C] hover:bg-[#f4ece4] transition-colors"
            style={{ padding: "12px 16px", lineHeight: "22px" }}
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={`flex items-center justify-center rounded-[8px] font-['Inter',sans-serif] text-[18px] leading-[26px] transition-colors ${
        active
          ? "bg-[#11151C] text-white font-semibold"
          : "text-[#11151C] hover:bg-[#f4ece4]"
      } ${disabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"}`}
      style={{ padding: "11px 8px", minWidth: 44 }}
    >
      {children}
    </button>
  );
}

// Returns page numbers with `"…"` gaps around the current page.
function buildPageItems(current: number, total: number): (number | "…")[] {
  const items: (number | "…")[] = [];
  const window = 1; // neighbours on each side of current
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - window && p <= current + window)) {
      items.push(p);
    } else if (items[items.length - 1] !== "…") {
      items.push("…");
    }
  }
  return items;
}

export default function ArticlePage() {
  const [page, setPage] = useState(1);

  const pageArticles = useMemo(
    () => allArticles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [page]
  );
  const pageItems = useMemo(() => buildPageItems(page, TOTAL_PAGES), [page]);

  const goTo = (p: number) => {
    const next = Math.min(Math.max(p, 1), TOTAL_PAGES);
    if (next === page) return;
    setPage(next);
    if (typeof document !== "undefined") {
      document
        .getElementById("article-list")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col pt-[79px]">
      {/* ── Hero ── */}
      <div className="bg-white">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 440, borderRadius: "0 0 100px 100px" }}
        >
          <img
            src="/figma/imgContactHero-4f95a9.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-right"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(270deg, rgba(105,85,56,0) 30%, rgba(105,85,56,0.6) 41%, rgba(105,85,56,0.82) 53%, rgba(105,85,56,1) 100%)",
            }}
          />
          <div
            className="relative z-10 flex flex-col gap-4"
            style={{ paddingLeft: 100, paddingTop: 200, maxWidth: 711 }}
          >
            <h1
              className="font-['Source_Serif_4',serif] font-normal leading-tight"
              style={{
                fontSize: 45,
                background:
                  "linear-gradient(270deg, rgba(251,232,166,1) 0%, rgba(235,210,151,1) 41%, rgba(251,232,166,1) 67%, rgba(251,232,166,1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Prossi Journal
            </h1>
            <p
              className="font-['Lato',sans-serif] font-normal text-white"
              style={{ fontSize: 18, lineHeight: "1.6" }}
            >
              Lebih Dari Sekadar Klinik Estetika. Di Prossi, kami percaya bahwa
              perawatan bukan hanya tentang penampilan tetapi tentang bagaimana
              seseorang merasa lebih sehat, lebih percaya diri, dan lebih nyaman
              dengan dirinya sendiri.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section heading + category filters ── */}
      <div
        className="flex flex-col justify-center gap-3 bg-white"
        style={{ padding: "80px 160px 20px" }}
      >
        <div className="flex gap-3">
          {categories.map((cat, i) => (
            <button
              key={cat}
              type="button"
              className={`flex items-center justify-center rounded-full font-['Inter',sans-serif] font-semibold text-[14px] leading-[22px] transition-colors ${
                i === 0
                  ? "bg-[#B59637] text-white border border-white"
                  : "bg-transparent text-[#11151C] border border-[#11151C] hover:bg-[#B59637] hover:text-white hover:border-[#B59637]"
              }`}
              style={{ padding: "4px 16px" }}
            >
              {cat}
            </button>
          ))}
        </div>
        <h2
          className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#11151C]"
          style={{ fontSize: 36, lineHeight: "44px", letterSpacing: "0.0069em" }}
        >
          Insight &amp; Inspiration
        </h2>
        <p
          className="font-['Inter',sans-serif] font-medium text-[#2A3447]"
          style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
        >
          Stay informed and inspired with the latest articles on Olympiad tips,
          study strategies, and success stories from top participants. Unlock
          your full potential with expert advice!
        </p>
      </div>

      {/* ── Article list ── */}
      <div
        id="article-list"
        className="flex flex-col items-end gap-10 scroll-mt-[100px] bg-white"
        style={{ padding: "40px 160px 80px" }}
      >
        {pageArticles.map((a) => (
          <ArticleCard key={a.id} {...a} />
        ))}

        {/* ── Pagination ── */}
        <div className="flex items-center gap-6 self-end mt-4">
          <PageButton
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            ariaLabel="Previous page"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PageButton>

          {pageItems.map((item, i) =>
            item === "…" ? (
              <span
                key={`ellipsis-${i}`}
                className="flex items-center justify-center text-[#11151C] text-[18px] select-none"
                style={{ minWidth: 44 }}
              >
                …
              </span>
            ) : (
              <PageButton
                key={item}
                active={item === page}
                onClick={() => goTo(item)}
                ariaLabel={`Page ${item}`}
              >
                {item}
              </PageButton>
            )
          )}

          <PageButton
            onClick={() => goTo(page + 1)}
            disabled={page === TOTAL_PAGES}
            ariaLabel="Next page"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PageButton>
        </div>
      </div>
    </div>
  );
}
