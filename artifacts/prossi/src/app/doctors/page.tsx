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
  title: string;
  cover_image: string | null;
  category: { name: string } | null;
};

const CATEGORY_LABEL: Record<string, string> = {
  slimming: "Slimming Program",
  skin: "Skin Treatment",
  aesthetic: "Estetika",
};

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
      "/items/articles?filter[status][_eq]=published&sort=-date_created&limit=3&fields=id,title,cover_image,category.name"
    ),
  ]);

  const articles =
    cmsArticles?.map((a) => ({
      id: a.id,
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
  const heroGradientRgb =
    category === "skin" ? "63,109,112" : category === "slimming" ? "205,114,79" : category === "aesthetic" ? "181,150,55" : "63,109,112";

  return (
    <DoctorsPageContent
      eyebrow={eyebrow}
      heroGradientRgb={heroGradientRgb}
      doctors={doctors}
      articles={articles}
    />
  );
}
