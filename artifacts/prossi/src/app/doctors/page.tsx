import type { Metadata } from "next";
import { DoctorsPageContent } from "@/components/DoctorsPageContent";
import { ALL_DOCTORS, type Doctor } from "@/components/doctors-data";
import { directusFetch, assetUrl } from "@/lib/directus";

type CmsDoctor = {
  name: string;
  photo: string | null;
  specialty: string;
  bio: string;
  schedule_days: string;
  schedule_hours: string;
  treatment_category: string | null;
};

type CmsArticle = {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  category: { name: string } | null;
};

const CATEGORY_LABEL: Record<string, string> = {
  slimming: "Slimming Program",
  skin: "Skin Treatment",
  estetika: "Dokter Estetika",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const label = category ? CATEGORY_LABEL[category] : undefined;
  return {
    title: label ? `Dokter ${label}` : "Dokter Spesialis",
    description: label
      ? `Daftar dokter spesialis ${label} di Prossi Clinic.`
      : "Daftar dokter spesialis Prossi Clinic — Sp.GK, Sp.DVE, dan dokter estetika berpengalaman.",
    alternates: { canonical: category ? `/doctors?category=${category}` : "/doctors" },
  };
}

export default async function Doctors({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const filter = category
    ? `&filter[treatment_category][_eq]=${encodeURIComponent(category)}`
    : "";

  const [cms, cmsArticles] = await Promise.all([
    directusFetch<CmsDoctor[]>(
      `/items/doctors?filter[status][_eq]=published&sort=sort&fields=name,photo,specialty,bio,schedule_days,schedule_hours,treatment_category${filter}`
    ),
    directusFetch<CmsArticle[]>(
      "/items/articles?filter[status][_eq]=published&sort=-date_created&limit=3&fields=id,slug,title,cover_image,category.name"
    ),
  ]);

  const articles =
    cmsArticles?.map((a) => ({
      id: a.id,
      slug: a.slug,
      img: a.cover_image ? assetUrl(a.cover_image) : "/figma/imgArticleGizi.png",
      tag: a.category?.name ?? "Prossi Journal",
      title: a.title,
    })) ?? [];

  const doctors: Doctor[] =
    cms && cms.length > 0
      ? cms.map((d) => ({
          img: d.photo ? assetUrl(d.photo) : "/figma/imgDoctorPlaceholder.png",
          name: d.name,
          specialty: d.specialty.toUpperCase(),
          bio: d.bio,
          schedule: d.schedule_days,
          hours: d.schedule_hours,
        }))
      : category
        ? []
        : ALL_DOCTORS;

  const eyebrow = category ? `DOKTER ${CATEGORY_LABEL[category] ?? ""}`.toUpperCase() : "DOKTER SPESIALIS";
  const heroGradientRgb = category === "skin" ? "63,109,112" : category === "slimming" ? "205,114,79" : category === "estetika" ? "120,80,140" : "63,109,112";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: doctors.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Physician",
        name: d.name,
        image: d.img,
        medicalSpecialty: d.specialty,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DoctorsPageContent
        eyebrow={eyebrow}
        heroGradientRgb={heroGradientRgb}
        doctors={doctors}
        articles={articles}
      />
    </>
  );
}
