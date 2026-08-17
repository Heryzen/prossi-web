"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { assetUrl } from "@/lib/directus";

const GOLD_RING =
  "linear-gradient(270deg, rgba(222,186,105,1) 0%, rgba(235,210,151,1) 30%, rgba(251,232,166,1) 50%, rgba(235,210,151,1) 70%, rgba(222,186,105,1) 100%)";
const GOLD_BUTTON =
  "linear-gradient(129deg, rgba(229,190,128,1) 0%, rgba(237,216,171,1) 50%, rgba(229,190,128,1) 100%)";

export type PromoItem = {
  title: string;
  description: string;
  image: string | null;
  cta_link: string | null;
  valid_until: string | null;
  category: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  sp_gk: "Promo Sp.GK",
  sp_dve: "Promo Sp.DVE",
  dokter_estetika: "Promo Dokter Estetika",
};
const CATEGORY_ORDER = ["sp_gk", "sp_dve", "dokter_estetika"];

function buildWaLink(waNumber: string | null | undefined, title: string) {
  const digits = (waNumber ?? "").replace(/\D/g, "");
  if (!digits) return "/contact";
  const message = `Halo Prossi Clinic! Saya tertarik dengan promo "${title}". Mohon info lebih lanjut ya, terima kasih!`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function formatValidUntil(iso: string, style: "short" | "long") {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: style === "short" ? "short" : "long",
    year: style === "short" ? undefined : "numeric",
  });
}

function PromoMediaFallback() {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f4ece4 0%, #e8d9bd 55%, #ddc48a 100%)" }}
    >
      <span className="absolute -right-6 -bottom-8 font-serif font-bold text-[140px] leading-none text-[#b59637] opacity-[0.15] select-none">
        %
      </span>
      <span className="relative font-serif font-semibold text-[26px] tracking-wide text-[#8a6a2f]">PROSSI</span>
    </div>
  );
}

function ValidUntilBadge({ validUntil }: { validUntil: string | null }) {
  if (!validUntil) return null;
  return (
    <span
      className="absolute top-4 right-4 rounded-full px-3 py-1.5 text-[12px] font-['Inter'] font-semibold text-[#503d1c] shadow-md"
      style={{ background: GOLD_BUTTON }}
    >
      Berlaku s/d {formatValidUntil(validUntil, "short")}
    </span>
  );
}

function PromoCard({ promo, onOpen }: { promo: PromoItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-[24px] p-[1px] w-full h-full transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
      style={{ background: GOLD_RING, boxShadow: "0px 12px 28px rgba(74,49,34,0.12)" }}
    >
      <div className="bg-[#fff8f2] rounded-[23px] overflow-hidden flex flex-col h-full">
        <div className="relative w-full aspect-[4/5] shrink-0">
          {promo.image ? (
            <img src={assetUrl(promo.image)} alt={promo.title} className="w-full h-full object-cover" />
          ) : (
            <PromoMediaFallback />
          )}
          <ValidUntilBadge validUntil={promo.valid_until} />
        </div>
        <div className="flex flex-col gap-2 p-6 flex-1">
          <h3 className="font-['Lato'] font-semibold text-[19px] text-[#120f0b] leading-tight">{promo.title}</h3>
          <p className="font-['Inter'] text-[14px] text-[#120f0b]/70 leading-relaxed line-clamp-2 flex-1">
            {promo.description}
          </p>
          <span className="font-['Inter'] font-semibold text-[14px] text-[#b59637] mt-2">Lihat Detail →</span>
        </div>
      </div>
    </button>
  );
}

function PromoDetailModal({
  promo,
  waNumber,
  onClose,
}: {
  promo: PromoItem;
  waNumber: string | null | undefined;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const ctaHref = promo.cta_link || buildWaLink(waNumber, promo.title);
  const isExternal = !promo.cta_link;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="rounded-[32px] p-[1px] max-w-[840px] w-full my-auto"
        style={{ background: GOLD_RING, boxShadow: "0px 20px 40px rgba(74,49,34,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#f4ece4] rounded-[31px] overflow-hidden relative flex flex-col md:flex-row">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white text-lg leading-none cursor-pointer transition-colors"
          >
            ✕
          </button>
          <div className="relative w-full md:w-[320px] aspect-[4/5] md:aspect-auto shrink-0">
            {promo.image ? (
              <img src={assetUrl(promo.image)} alt={promo.title} className="w-full h-full object-cover" />
            ) : (
              <PromoMediaFallback />
            )}
          </div>
          <div className="flex flex-col gap-5 p-8 md:p-10 flex-1">
            <h2 className="font-['Lato'] font-semibold text-[26px] md:text-[32px] text-[#120f0b] leading-tight">
              {promo.title}
            </h2>
            {promo.valid_until && (
              <p className="font-['Inter'] font-semibold text-[14px] text-[#b59637]">
                Berlaku sampai {formatValidUntil(promo.valid_until, "long")}
              </p>
            )}
            <p className="font-['Inter'] text-[16px] text-[#120f0b]/85 leading-relaxed">{promo.description}</p>
            <Link
              href={ctaHref}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="mt-auto self-start rounded-full px-9 py-[16px] text-[#503d1c] font-['Inter'] font-semibold text-[16px] border border-[#ecd5a5] hover:opacity-90 transition-opacity"
              style={{ background: GOLD_BUTTON }}
            >
              {isExternal ? "Chat via WhatsApp" : "View Offers"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PromoPageContent({
  promos,
  waNumber,
}: {
  promos: PromoItem[];
  waNumber: string | null | undefined;
}) {
  const tabs = useMemo(() => {
    const grouped = CATEGORY_ORDER.map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      items: promos.filter((p) => p.category === key),
    })).filter((g) => g.items.length > 0);
    const uncategorized = promos.filter((p) => !p.category || !CATEGORY_ORDER.includes(p.category));
    return uncategorized.length > 0 ? [...grouped, { key: "lainnya", label: "Promo Lainnya", items: uncategorized }] : grouped;
  }, [promos]);

  const [activeKey, setActiveKey] = useState<string | undefined>(tabs[0]?.key);
  const [selected, setSelected] = useState<PromoItem | null>(null);
  const activeTab = tabs.find((t) => t.key === activeKey) ?? tabs[0];

  if (tabs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <p className="font-sans text-lg text-[#503d1c]/70">
          Belum ada promo aktif saat ini. Pantau terus penawaran spesial dari Prossi Clinic.
        </p>
        <Link
          href="/"
          className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <div className="flex flex-wrap justify-center gap-3">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab?.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveKey(tab.key)}
              className={`rounded-full px-6 py-3 font-['Inter'] font-semibold text-[14px] md:text-[15px] transition-colors cursor-pointer ${
                isActive
                  ? "text-[#503d1c] border border-[#ecd5a5]"
                  : "text-[#503d1c]/60 border border-transparent hover:text-[#503d1c] hover:bg-[#f1e7da]"
              }`}
              style={isActive ? { background: GOLD_BUTTON } : undefined}
            >
              {tab.label}
              <span className="ml-2 opacity-60">{tab.items.length}</span>
            </button>
          );
        })}
      </div>

      <div
        className="grid gap-6 md:gap-8 w-full justify-center"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 300px))" }}
      >
        {activeTab?.items.map((p) => (
          <PromoCard key={p.title} promo={p} onOpen={() => setSelected(p)} />
        ))}
      </div>

      {selected && <PromoDetailModal promo={selected} waNumber={waNumber} onClose={() => setSelected(null)} />}
    </div>
  );
}
