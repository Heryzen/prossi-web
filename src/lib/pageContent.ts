import { directusFetch } from "@/lib/directus";

/** Satu section teks/gambar yang bisa diedit dari CMS (collection `page_content`). */
export type PageContent = {
  key: string;
  eyebrow: string | null;
  headline: string | null;
  subheadline: string | null;
  description: string | null;
  image: string | null;
  link_url: string | null;
  link_label: string | null;
};

export type PageContentMap = Record<string, PageContent>;

const FIELDS = "key,eyebrow,headline,subheadline,description,image,link_url,link_label";

/**
 * Ambil beberapa section sekaligus, dikembalikan sebagai map by key.
 * Kalau CMS tidak tersedia, map kosong — caller fallback ke teks default.
 */
export async function getPageContent(keys: string[]): Promise<PageContentMap> {
  const rows = await directusFetch<PageContent[]>(
    `/items/page_content?filter[key][_in]=${keys.join(",")}&limit=-1&fields=${FIELDS}`
  );
  return Object.fromEntries((rows ?? []).map((r) => [r.key, r]));
}

/** Pakai nilai CMS kalau terisi, selain itu fallback ke teks default. */
export function pick(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}
