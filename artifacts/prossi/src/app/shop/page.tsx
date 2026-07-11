import { directusFetch, assetUrl } from "@/lib/directus";
import { ShopGrid, type Product } from "./ShopGrid";

const HEADING_GRADIENT =
  "linear-gradient(270deg, rgba(251,232,166,1) 0%, rgba(235,210,151,1) 41%, rgba(251,232,166,1) 67%, rgba(251,232,166,1) 100%)";

type CmsProduct = {
  name: string;
  slug: string;
  price: number;
  image: string | null;
  category: { name: string } | null;
};
type CmsSettings = {
  shop_hero_heading: string | null;
  shop_hero_subheading: string | null;
  shop_hero_image: string | null;
};

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const fallbackProducts: Product[] = Array.from({ length: 6 }, (_, i) => ({
  slug: `sample-${i}`,
  name: "Soothe Crème - Krim Pelembap Wajah Anti Kering, Mengandung Ceramide, BPOM",
  priceLabel: "Rp 89.000",
  img: null,
  category: null,
}));

export default async function ShopPage() {
  const [cms, settings] = await Promise.all([
    directusFetch<CmsProduct[]>(
      "/items/products?filter[status][_eq]=published&sort=sort&fields=name,slug,price,image,category.name"
    ),
    directusFetch<CmsSettings>(
      "/items/site_settings?fields=shop_hero_heading,shop_hero_subheading,shop_hero_image"
    ),
  ]);

  const products: Product[] =
    cms && cms.length > 0
      ? cms.map((p) => ({
          slug: p.slug,
          name: p.name,
          priceLabel: rupiah(p.price),
          img: p.image ? assetUrl(p.image) : null,
          category: p.category?.name ?? null,
        }))
      : fallbackProducts;

  const categories = Array.from(new Set(products.map((p) => p.category).filter((c): c is string => !!c)));

  const heroHeading = settings?.shop_hero_heading ?? "Shop Prossi";
  const heroSubheading =
    settings?.shop_hero_subheading ??
    "Perawatan Tidak Berhenti di Klinik. Produk pilihan dengan pendekatan wellness dan medical beauty untuk membantu Anda menjaga hasil treatment dan merawat diri setiap hari.";
  const heroImage = settings?.shop_hero_image ? assetUrl(settings.shop_hero_image) : "/figma/imgContactHero-4f95a9.webp";

  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[320px] md:h-[440px] overflow-hidden rounded-b-[60px] md:rounded-b-[100px]">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover object-right" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, rgba(105,85,56,0) 30%, rgba(105,85,56,0.6) 41%, rgba(105,85,56,0.82) 53%, rgba(105,85,56,1) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-4 max-w-[611px] px-6 md:pl-[100px] pt-[100px] md:pt-[200px]">
          <h1
            className="font-serif font-normal leading-tight bg-clip-text text-transparent"
            style={{ backgroundImage: HEADING_GRADIENT, fontSize: "clamp(28px, 6vw, 45px)" }}
          >
            {heroHeading}
          </h1>
          <p className="font-['Lato',sans-serif] text-white" style={{ fontSize: "clamp(14px, 4vw, 18px)" }}>
            {heroSubheading}
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="bg-white w-full py-[60px] md:py-[84px] px-6 md:px-[160px]">
        <ShopGrid products={products} categories={categories} />
      </section>
    </>
  );
}
