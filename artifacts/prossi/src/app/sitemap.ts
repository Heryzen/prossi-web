import type { MetadataRoute } from "next";
import { directusFetch } from "@/lib/directus";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type CmsArticle = { id: string; slug: string; date_created: string };
type CmsProduct = { slug: string };

const STATIC_ROUTES = [
  "",
  "/about",
  "/treatments",
  "/treatments/slimming-program",
  "/treatments/skin-treatment",
  "/doctors",
  "/doctors?category=slimming",
  "/doctors?category=skin",
  "/article",
  "/shop",
  "/promo",
  "/contact",
  "/locations",
  "/careers",
  "/terms",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, products] = await Promise.all([
    directusFetch<CmsArticle[]>("/items/articles?filter[status][_eq]=published&fields=id,slug,date_created"),
    directusFetch<CmsProduct[]>("/items/products?filter[status][_eq]=published&fields=slug"),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const articleEntries: MetadataRoute.Sitemap =
    articles?.map((a) => ({
      url: `${SITE_URL}/article/${a.slug}`,
      lastModified: a.date_created,
    })) ?? [];

  const productEntries: MetadataRoute.Sitemap =
    products?.map((p) => ({
      url: `${SITE_URL}/shop/${p.slug}`,
    })) ?? [];

  return [...staticEntries, ...articleEntries, ...productEntries];
}
