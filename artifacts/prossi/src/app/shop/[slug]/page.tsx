import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { directusFetch, assetUrl } from "@/lib/directus";
import { AddToCartActions } from "./AddToCartActions";

type CmsProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string | null;
  stock: number;
};

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

async function fetchProduct(slug: string) {
  const results = await directusFetch<CmsProduct[]>(
    `/items/products?filter[slug][_eq]=${encodeURIComponent(slug)}&filter[status][_eq]=published&fields=name,slug,description,price,image,stock&limit=1`
  );
  return results?.[0];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [assetUrl(product.image)] : undefined,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await fetchProduct(slug);

  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? assetUrl(product.image) : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <section className="bg-white w-full pt-[100px] pb-[80px] px-6 md:px-[160px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1120px] mx-auto flex flex-col gap-8">
        <Link
          href="/shop"
          className="flex items-center gap-2 font-['Inter',sans-serif] font-medium text-[16px] text-[#11151c] hover:opacity-70 transition-opacity w-fit"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#11151C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Shop
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Gambar */}
          <div
            className="w-full md:w-[480px] h-[360px] md:h-[480px] shrink-0 rounded-[20px] overflow-hidden border border-[#e6ecf7]"
            style={{ boxShadow: "0px 4px 4px -4px rgba(12,12,13,0.05), 0px 16px 16px -8px rgba(12,12,13,0.1)" }}
          >
            {product.image ? (
              <img src={assetUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(180deg, #f4ece4 0%, #e8d9bd 100%)" }}
              >
                <span className="font-serif font-semibold text-[32px] text-[#b59637] opacity-60">PROSSI</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex flex-col gap-2">
              <span className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#b59637] uppercase">
                Prossi Clinic
              </span>
              <h1 className="font-['Lato',sans-serif] font-extrabold text-[28px] md:text-[32px] leading-tight text-[#11151c]">
                {product.name}
              </h1>
            </div>

            <p className="font-['Inter',sans-serif] font-bold text-[28px] text-[#11151c]">{rupiah(product.price)}</p>

            <div style={{ borderTop: "1px dashed #c8cef4" }} />

            <p className="font-['Inter',sans-serif] text-[16px] leading-relaxed text-[#3b4963]">
              {product.description}
            </p>

            <AddToCartActions
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={product.image ? assetUrl(product.image) : null}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
