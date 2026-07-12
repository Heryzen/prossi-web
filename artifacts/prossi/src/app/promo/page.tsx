import Link from "next/link";
import type { Metadata } from "next";
import { directusFetch, assetUrl } from "@/lib/directus";

export const metadata: Metadata = {
  title: "Promo",
  description: "Promo dan penawaran terbaru dari Prossi Clinic untuk program slimming dan skin treatment.",
};

const GOLD_RING =
  "linear-gradient(270deg, rgba(222,186,105,1) 0%, rgba(235,210,151,1) 30%, rgba(251,232,166,1) 50%, rgba(235,210,151,1) 70%, rgba(222,186,105,1) 100%)";

type CmsPromo = {
  title: string;
  description: string;
  image: string | null;
  cta_link: string | null;
  valid_until: string | null;
};

export default async function PromoPage() {
  const promos = await directusFetch<CmsPromo[]>(
    "/items/promos?filter[status][_eq]=published&fields=title,description,image,cta_link,valid_until"
  );

  return (
    <main className="min-h-screen bg-[#f4ece4] px-6 md:px-[100px] pt-[160px] pb-[80px]">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-serif font-semibold text-[36px] md:text-[48px] text-[#503d1c]">Promo</h1>
          <p className="font-sans text-lg text-[#503d1c]/70 max-w-[600px]">
            Penawaran spesial dari Prossi Clinic untuk perjalanan kesehatan dan kecantikanmu.
          </p>
        </div>

        {promos && promos.length > 0 ? (
          <div className="flex flex-col gap-8 w-full">
            {promos.map((p) => (
              <div key={p.title} className="rounded-[32px] p-[1px] w-full" style={{ background: GOLD_RING }}>
                <div className="bg-[#f1e7da] rounded-[31px] overflow-hidden flex flex-col md:flex-row">
                  <div className="flex flex-col gap-6 p-8 md:p-[60px] md:max-w-[547px] justify-center">
                    <div className="flex flex-col gap-4">
                      <h2 className="font-['Lato'] font-semibold text-[28px] md:text-[40px] text-[#120f0b] leading-tight">
                        {p.title}
                      </h2>
                      <p className="font-['Inter'] text-[16px] md:text-[18px] text-[#120f0b]">{p.description}</p>
                      {p.valid_until && (
                        <p className="font-['Inter'] font-semibold text-[14px] text-[#b59637]">
                          Berlaku sampai{" "}
                          {new Date(p.valid_until).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <Link
                      href={p.cta_link || "/contact"}
                      className="self-start rounded-full px-9 py-[18px] text-[#503d1c] font-serif font-semibold text-[18px] border border-[#ecd5a5] hover:opacity-90 transition-opacity"
                      style={{
                        background:
                          "linear-gradient(129deg, rgba(229,190,128,1) 0%, rgba(237,216,171,1) 50%, rgba(229,190,128,1) 100%)",
                      }}
                    >
                      View Offers
                    </Link>
                  </div>
                  {p.image && (
                    <div className="flex-1 min-h-[240px]">
                      <img src={assetUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </main>
  );
}
