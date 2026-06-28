import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, relatedArticles } from "../articles";
import { MoreToRead } from "../MoreToRead";

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

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticle(Number(id));
  if (!article) notFound();

  const related = relatedArticles(article.id, 7);

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

      {/* ── Article header ── */}
      <div
        className="flex flex-col justify-center gap-3 bg-white"
        style={{ padding: "80px 160px 20px" }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-6 flex-wrap">
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
          style={{ fontSize: 36, lineHeight: "44px", letterSpacing: "0.0069em" }}
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
        className="flex flex-col gap-10 bg-white"
        style={{ padding: "40px 360px 80px 160px" }}
      >
        <div
          className="rounded-[20px] overflow-hidden w-full"
          style={{ maxWidth: 860, height: 481, background: "#FFE3E7" }}
        >
          <img
            src={article.img}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-5" style={{ maxWidth: 860 }}>
          {article.body.map((p, i) => (
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
          ))}
        </div>
      </div>

      {/* ── More to read ── */}
      <MoreToRead articles={related} />
    </div>
  );
}
