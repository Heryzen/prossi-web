import Link from "next/link";
import { directusFetch, assetUrl } from "@/lib/directus";

const staticArticles = [
  {
    id: null as string | null,
    category: "Spesialis Gizi",
    title: "Panduan nutrisi, slimming, dan kesehatan metabolisme dari dokter Spesialis Gizi Klinik.",
    img: "/figma/imgFrame1984078116.webp",
  },
  {
    id: null as string | null,
    category: "Spesialis Kulit",
    title: "Informasi terpercaya seputar penyakit kulit dan kelamin dari dokter Sp.DVE.",
    img: "/figma/imgFrame1984078117.webp",
  },
  {
    id: null as string | null,
    category: "Dokter Estetika",
    title: "Tips dan insight perawatan kecantikan langsung dari dokter estetika Prossi Clinic.",
    img: "/figma/imgFrame1984078118.webp",
  },
];

type CmsArticle = {
  id: string;
  title: string;
  cover_image: string | null;
  category: { name: string } | null;
};

export async function Blog() {
  const cms = await directusFetch<CmsArticle[]>(
    "/items/articles?filter[status][_eq]=published&sort=-date_created&limit=3&fields=id,title,cover_image,category.name"
  );

  const articles =
    cms && cms.length > 0
      ? cms.map((a, i) => ({
          id: a.id,
          category: a.category?.name ?? "Artikel",
          title: a.title,
          img: a.cover_image ? assetUrl(a.cover_image) : staticArticles[i % staticArticles.length].img,
        }))
      : staticArticles;

  return (
    <section className="bg-[#f4ece4] w-full py-12 lg:py-[100px] px-6 lg:px-[100px] flex flex-col items-center">
      <div className="max-w-[1240px] w-full flex flex-col items-center gap-[42px]">
        <div className="flex flex-col items-center gap-6 w-full text-center max-w-[1030px]">
          <h2 className="font-serif font-semibold text-[32px] md:text-[40px] text-[#120f0b] capitalize">
            The Prossi Journal
          </h2>
          <p className="font-sans text-lg text-[#120f0b] max-w-[816px]">
            Artikel dari dokter Prossi Clinic untuk membantu Anda memahami kondisi kulit dan tubuh, sebelum memulai perawatan yang tepat.
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-6">
          {articles.map((article, i) => (
            <Link
              key={i}
              href={article.id ? `/article/${article.id}` : "/article"}
              className="flex-1 bg-[#fff8f2] rounded-[24px] overflow-hidden flex flex-col pb-8 hover:shadow-md transition-shadow"
            >
              <div className="w-full h-[260px] relative mb-6">
                <img src={article.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="px-8 flex flex-col gap-6">
                <div className="flex items-center gap-2.5">
                  <img src="/figma/imgTablerTagFilled.svg" alt="Tag" className="w-5 h-5" />
                  <span className="font-sans font-medium text-sm text-[#503d1c]">{article.category}</span>
                </div>
                <h3 className="font-serif font-semibold text-[26px] text-[#120f0b] leading-tight">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/article" className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity">
          Read More
        </Link>
      </div>
    </section>
  );
}
