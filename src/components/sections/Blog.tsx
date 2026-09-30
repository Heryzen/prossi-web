import Link from "next/link";
import { directusFetch, assetUrl } from "@/lib/directus";

const staticArticles = [
  {
    id: null as string | null,
    slug: null as string | null,
    category: "Spesialis Gizi",
    title: "Panduan nutrisi, slimming, dan kesehatan metabolisme dari dokter Spesialis Gizi Klinik.",
    img: null as string | null,
  },
  {
    id: null as string | null,
    slug: null as string | null,
    category: "Spesialis Kulit",
    title: "Informasi terpercaya seputar penyakit kulit dan kelamin dari dokter Sp.DVE.",
    img: null as string | null,
  },
  {
    id: null as string | null,
    slug: null as string | null,
    category: "Dokter Estetika",
    title: "Tips dan insight perawatan kecantikan langsung dari dokter estetika Prossi Clinic.",
    img: null as string | null,
  },
];

function ArticleImageFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "linear-gradient(160deg, #f4ece4 0%, #e8d9bd 55%, #ddc48a 100%)" }}
    >
      <span className="font-sans font-semibold text-[22px] tracking-wide text-[#8a6a2f]">PROSSI</span>
    </div>
  );
}

type CmsArticle = {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  category: { name: string } | null;
};

export async function Blog() {
  const cms = await directusFetch<CmsArticle[]>(
    "/items/articles?filter[status][_eq]=published&sort=-date_created&limit=3&fields=id,slug,title,cover_image,category.name"
  );

  const articles =
    cms && cms.length > 0
      ? cms.map((a) => ({
          id: a.id,
          slug: a.slug as string | null,
          category: a.category?.name ?? "Artikel",
          title: a.title,
          img: a.cover_image ? assetUrl(a.cover_image) : null,
        }))
      : staticArticles;

  return (
    <section className="bg-white w-full py-12 lg:py-[100px] px-6 lg:px-[100px] flex flex-col items-center">
      <div className="max-w-[1240px] w-full flex flex-col items-center gap-[42px]">
        <div className="flex flex-col items-center gap-6 w-full text-center max-w-[1030px]">
          <h2 className="font-sans font-semibold text-[32px] md:text-[40px] text-[#120f0b] capitalize">
            Articles
          </h2>
          <p className="font-sans text-lg text-[#120f0b] max-w-[816px]">
            Artikel dari dokter Prossi Clinic untuk membantu Anda memahami kondisi kulit dan tubuh, sebelum memulai perawatan yang tepat.
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-6">
          {articles.map((article, i) => (
            <Link
              key={i}
              href={article.slug ?? article.id ? `/article/${article.slug ?? article.id}` : "/article"}
              className="flex-1 bg-[#fff8f2] rounded-[24px] overflow-hidden flex flex-col pb-8 hover:shadow-md transition-shadow"
            >
              <div className="w-full h-[260px] relative mb-6">
                {article.img ? (
                  <img src={article.img} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ArticleImageFallback />
                )}
              </div>
              <div className="px-8 flex flex-col gap-6">
                <div className="flex items-center gap-2.5">
                  <img src="/figma/imgTablerTagFilled.svg" alt="Tag" className="w-5 h-5" />
                  <span className="font-sans font-medium text-sm text-[#503d1c]">{article.category}</span>
                </div>
                <h3 className="font-sans font-semibold text-[26px] text-[#120f0b] leading-tight">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/article" className="bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-sans font-semibold text-lg hover:opacity-90 transition-opacity">
          Read More
        </Link>
      </div>
    </section>
  );
}
