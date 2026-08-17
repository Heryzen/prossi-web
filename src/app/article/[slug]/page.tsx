import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, relatedArticles, type Article } from "../articles";
import { MoreToRead } from "../MoreToRead";
import { directusFetch, assetUrl } from "@/lib/directus";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type CmsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  date_created: string;
  author: { name: string } | null;
};

async function fetchCmsArticleBySlug(slug: string): Promise<CmsArticle | null> {
  const results = await directusFetch<CmsArticle[]>(
    `/items/articles?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1&fields=id,slug,title,excerpt,content,cover_image,date_created,author.name`
  );
  return results?.[0] ?? null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const isNumeric = /^\d+$/.test(slug);

  if (isNumeric) {
    const article = getArticle(Number(slug));
    if (!article) return {};
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: { title: article.title, description: article.excerpt, images: [article.img], type: "article" },
    };
  }

  const cms = await fetchCmsArticleBySlug(slug);
  if (!cms) return {};
  const image = cms.cover_image ? assetUrl(cms.cover_image) : "/figma/imgFrame1984078116.webp";
  return {
    title: cms.title,
    description: cms.excerpt,
    alternates: { canonical: `/article/${cms.slug}` },
    openGraph: {
      title: cms.title,
      description: cms.excerpt,
      images: [image],
      type: "article",
      publishedTime: cms.date_created,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // CMS-first: slug → Directus; numeric → static pool fallback
  let article: Article | undefined;
  let htmlContent: string | null = null;
  let related: Article[] = [];
  let publishedISO: string | null = null;

  const isNumeric = /^\d+$/.test(slug);
  if (!isNumeric) {
    const cms = await fetchCmsArticleBySlug(slug);
    if (cms) {
      article = {
        id: cms.id,
        slug: cms.slug,
        title: cms.title,
        excerpt: cms.excerpt,
        img: cms.cover_image ? assetUrl(cms.cover_image) : "/figma/imgFrame1984078116.webp",
        date: formatDate(cms.date_created),
        author: cms.author?.name ?? "Prossi Clinic",
        publishedAt: formatDate(cms.date_created),
        body: [],
      };
      htmlContent = cms.content;
      publishedISO = cms.date_created;

      const others = await directusFetch<CmsArticle[]>(
        `/items/articles?filter[status][_eq]=published&filter[id][_neq]=${cms.id}&limit=7&fields=id,slug,title,excerpt,cover_image,date_created`
      );
      related =
        others?.map((o) => ({
          id: o.id,
          slug: o.slug,
          title: o.title,
          excerpt: o.excerpt,
          img: o.cover_image ? assetUrl(o.cover_image) : "/figma/imgFrame1984078116.webp",
          date: formatDate(o.date_created),
          author: "",
          publishedAt: "",
          body: [],
        })) ?? [];
    }
  } else {
    article = getArticle(Number(slug));
    if (article) related = relatedArticles(article.id, 7);
  }

  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        image: article.img,
        author: { "@type": "Organization", name: article.author || "Prossi Clinic" },
        publisher: { "@type": "Organization", name: "Prossi Clinic" },
        ...(publishedISO ? { datePublished: publishedISO } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Insight & Inspiration", item: `${SITE_URL}/article` },
          { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/article/${article.slug ?? article.id}` },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col pt-[79px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ── */}
      <div className="bg-white">
        <div
          className="relative w-full overflow-hidden h-[320px] md:h-[440px] rounded-b-[100px]"
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
            className="relative z-10 flex flex-col gap-4 px-6 pt-[100px] md:pl-[100px] md:pt-[200px]"
            style={{ maxWidth: 711 }}
          >
            <h1
              className="font-['Source_Serif_4',serif] font-normal leading-tight"
              style={{
                fontSize: "clamp(28px, 7vw, 45px)",
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
              style={{ fontSize: "clamp(14px, 4vw, 18px)", lineHeight: "1.6" }}
            >
              Lebih Dari Sekadar Klinik Estetika. Di Prossi, kami percaya bahwa
              perawatan bukan hanya tentang penampilan tetapi tentang bagaimana
              seseorang merasa lebih sehat, lebih percaya diri, dan lebih nyaman
              dengan dirinya sendiri.
            </p>
          </div>
        </div>
      </div>

      {/* ── Article header ── */}
      <div
        className="flex flex-col justify-center gap-3 bg-white px-6 pt-10 pb-5 md:px-[160px] md:pt-[80px] md:pb-[20px]"
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 flex-wrap">
          <Link
            href="/"
            className="font-['Inter',sans-serif] font-medium text-[#11151C] hover:underline"
            style={{ fontSize: 16, lineHeight: "24px" }}
          >
            Home
          </Link>
          <ChevronRight className="text-[#11151C]" />
          <Link
            href="/article"
            className="font-['Inter',sans-serif] font-medium text-[#11151C] hover:underline"
            style={{ fontSize: 16, lineHeight: "24px" }}
          >
            Insight &amp; Inspiration
          </Link>
          <ChevronRight className="text-[#11151C]" />
          <span
            className="font-['Inter',sans-serif] font-medium text-[#4A576F] truncate max-w-[360px]"
            style={{ fontSize: 16, lineHeight: "24px" }}
          >
            {article.title}
          </span>
        </nav>

        {/* Title */}
        <h2
          className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#11151C]"
          style={{ fontSize: "clamp(22px, 6vw, 36px)", lineHeight: "1.3", letterSpacing: "0.0069em" }}
        >
          {article.title}
        </h2>

        {/* Excerpt */}
        <p
          className="font-['Inter',sans-serif] font-medium text-[#4A576F]"
          style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
        >
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 flex-wrap">
          <span
            className="font-['Inter',sans-serif] font-medium text-[#4A576F]"
            style={{ fontSize: 16, lineHeight: "24px" }}
          >
            {article.author}
          </span>
          <span
            className="rounded-full shrink-0"
            style={{ width: 8, height: 8, background: "#DEE0E5" }}
          />
          <span
            className="font-['Inter',sans-serif] font-bold text-[#2444B9]"
            style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
          >
            {article.publishedAt}
          </span>
        </div>
      </div>

      {/* ── Article body ── */}
      <div
        className="flex flex-col gap-10 bg-white px-6 py-10 md:pl-[160px] md:pr-[360px] md:pt-[40px] md:pb-[80px]"
      >
        <div
          className="rounded-[20px] overflow-hidden w-full"
          style={{ maxWidth: 860, height: "auto", minHeight: 220, aspectRatio: "860/481", background: "#FFE3E7" }}
        >
          <img
            src={article.img}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-5" style={{ maxWidth: 860 }}>
          {htmlContent ? (
            <div
              className="font-['Inter',sans-serif] font-medium text-[#4A576F] flex flex-col gap-5 [&_p]:leading-6"
              style={{ fontSize: 16, letterSpacing: "0.0094em" }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            article.body.map((p, i) => (
              <p
                key={i}
                className="font-['Inter',sans-serif] font-medium text-[#4A576F]"
                style={{
                  fontSize: 16,
                  lineHeight: "24px",
                  letterSpacing: "0.0094em",
                }}
              >
                {p}
              </p>
            ))
          )}
        </div>
      </div>

      {/* ── More to read ── */}
      <MoreToRead articles={related} />
    </div>
  );
}
