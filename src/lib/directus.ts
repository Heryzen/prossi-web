const DIRECTUS_URL =
  process.env.DIRECTUS_URL ??
  process.env.NEXT_PUBLIC_DIRECTUS_URL ??
  "http://localhost:8055";

/** URL publik untuk file/gambar Directus */
export function assetUrl(fileId: string): string {
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

/**
 * Fetch items dari Directus. Return null kalau CMS tidak tersedia,
 * supaya caller bisa fallback ke data statis.
 * Cache dimatikan (no-store) — setiap request selalu ambil data terbaru.
 */
export async function directusFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${DIRECTUS_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as T) ?? null;
  } catch {
    return null;
  }
}

export interface SiteSettings {
  reservation_link: string | null;
}

const DEFAULT_RESERVATION_LINK =
  "https://reservasi.prossi.clinic/booking?utm_source=website";

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await directusFetch<SiteSettings>("/items/site_settings");
  return {
    reservation_link: data?.reservation_link || DEFAULT_RESERVATION_LINK,
  };
}
