"use client";

import { useMemo, useState } from "react";

const CARD_BORDER =
  "linear-gradient(270deg, rgba(222,186,105,1) 0%, rgba(235,210,151,1) 30%, rgba(251,232,166,1) 50%, rgba(235,210,151,1) 70%, rgba(222,186,105,1) 100%)";
const CARD_BG = "linear-gradient(180deg, #ffffff 0%, #fff9eb 100%)";

const CATEGORY_LABELS: Record<string, string> = {
  facial: "Facial",
  laser: "Laser",
  konsultasi: "Konsultasi",
  "body-treatment": "Body Treatment",
  injeksi: "Injeksi",
};

function categoryLabel(value: string): string {
  return CATEGORY_LABELS[value] ?? value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export type ChildItem = {
  name: string;
  slug: string;
  description: string;
  content: string | null;
  image: string | null;
  category: string | null;
};

function ChildItemCard({ item, accent, onOpen }: { item: ChildItem; accent: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="rounded-[24px] p-[1px] flex-1 hover:opacity-90 transition-opacity text-left cursor-pointer"
      style={{ background: CARD_BORDER }}
    >
      <div
        className="rounded-[23px] flex flex-col h-full"
        style={{ background: CARD_BG, padding: "12px 12px 32px" }}
      >
        <div className="w-full h-[180px] shrink-0 rounded-[20px] overflow-hidden bg-[#f4ece4]">
          {item.image && (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex flex-col gap-3 px-4 pt-6">
          {item.category && (
            <span
              className="self-start px-3 py-1 rounded-full font-['Lato',sans-serif] font-semibold text-[11px] uppercase text-white"
              style={{ background: accent }}
            >
              {categoryLabel(item.category)}
            </span>
          )}
          <h3 className="font-['Lato',sans-serif] font-semibold text-[18px] text-[#120f0b] leading-tight">
            {item.name}
          </h3>
          <p className="font-['Lato',sans-serif] font-normal text-[14px] text-[#120f0b] leading-relaxed line-clamp-3">
            {item.description}
          </p>
          <span
            className="font-['Lato',sans-serif] font-semibold text-[14px] underline underline-offset-2"
            style={{ color: accent }}
          >
            Lihat Detail
          </span>
        </div>
      </div>
    </button>
  );
}

function ItemDetailModal({ item, accent, onClose }: { item: ChildItem; accent: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full flex flex-col overflow-hidden bg-white"
        style={{ maxWidth: 700, maxHeight: "85vh", borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#120f0b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="overflow-y-auto">
          {item.image && (
            <div className="w-full h-[240px] shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-col gap-4 p-6 md:p-8">
            {item.category && (
              <span
                className="self-start px-3 py-1 rounded-full font-['Lato',sans-serif] font-semibold text-[11px] uppercase text-white"
                style={{ background: accent }}
              >
                {categoryLabel(item.category)}
              </span>
            )}
            <h2 className="font-['Lato',sans-serif] font-semibold text-[24px] text-[#120f0b]">
              {item.name}
            </h2>
            {item.content ? (
              <div
                className="font-['Lato',sans-serif] text-[15px] text-[#3b4963] leading-relaxed flex flex-col gap-3"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ) : (
              <p className="font-['Lato',sans-serif] text-[15px] text-[#3b4963] leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChildItemsList({ items, accent }: { items: ChildItem[]; accent: string }) {
  const [selected, setSelected] = useState<ChildItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter((c): c is string => !!c))),
    [items]
  );

  const filtered = activeCategory ? items.filter((i) => i.category === activeCategory) : items;

  if (items.length === 0) {
    return (
      <div className="w-full rounded-[24px] border border-dashed border-white/40 px-6 py-16 flex items-center justify-center">
        <p className="font-['Lato',sans-serif] text-[16px] text-white/80 text-center">
          Detail perawatan akan segera tersedia untuk program ini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full font-['Lato',sans-serif] font-medium text-[13px] uppercase cursor-pointer transition-colors ${
              activeCategory === null ? "bg-white text-[#120f0b]" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-full font-['Lato',sans-serif] font-medium text-[13px] uppercase cursor-pointer transition-colors ${
                activeCategory === c ? "bg-white text-[#120f0b]" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {categoryLabel(c)}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filtered.map((item) => (
          <ChildItemCard key={item.slug} item={item} accent={accent} onOpen={() => setSelected(item)} />
        ))}
      </div>

      {selected && <ItemDetailModal item={selected} accent={accent} onClose={() => setSelected(null)} />}
    </div>
  );
}
