import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { directusFetch, assetUrl } from "@/lib/directus";
import { ChildItemsList, type ChildItem } from "@/components/sections/treatments/ChildItemsList";

const ACCENT = "#cd724f";

type CmsTreatment = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
};

type CmsTreatmentItem = {
  name: string;
  slug: string;
  description: string;
  content: string | null;
  image: string | null;
  category: string | null;
};

async function fetchParentBySlug(slug: string): Promise<CmsTreatment | null> {
  const results = await directusFetch<CmsTreatment[]>(
    `/items/treatments?filter[category][_eq]=slimming&filter[slug][_eq]=${encodeURIComponent(slug)}&filter[status][_eq]=published&limit=1&fields=id,name,slug,description,image`
  );
  return results?.[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parent = await fetchParentBySlug(slug);
  if (!parent) return {};
  return {
    title: parent.name,
    description: parent.description,
  };
}

export default async function SlimmingTreatmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parent = await fetchParentBySlug(slug);
  if (!parent) notFound();

  const cmsItems = await directusFetch<CmsTreatmentItem[]>(
    `/items/treatment_items?filter[treatment][_eq]=${parent.id}&filter[status][_eq]=published&sort=sort&fields=name,slug,description,content,image,category`
  );

  const items: ChildItem[] =
    cmsItems?.map((i) => ({
      name: i.name,
      slug: i.slug,
      description: i.description,
      content: i.content,
      image: i.image ? assetUrl(i.image) : null,
      category: i.category,
    })) ?? [];

  return (
    <section className="w-full pt-[140px] pb-[80px] px-6 md:px-[100px]" style={{ background: ACCENT }}>
      <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-10">
        <nav className="w-full flex items-center gap-2 flex-wrap">
          <Link href="/treatments/slimming-program" className="font-['Lato',sans-serif] text-[14px] text-white/80 hover:underline">
            Slimming Program
          </Link>
          <span className="text-white/50">/</span>
          <span className="font-['Lato',sans-serif] text-[14px] text-white">{parent.name}</span>
        </nav>

        <div className="flex flex-col items-center gap-6 max-w-[860px] text-center">
          {parent.image && (
            <div className="w-full h-[240px] rounded-[24px] overflow-hidden">
              <img src={assetUrl(parent.image)} alt={parent.name} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="font-['Lato',sans-serif] font-semibold text-[28px] md:text-[40px] text-white">
            {parent.name}
          </h1>
          <p className="font-['Lato',sans-serif] text-[16px] md:text-[18px] text-white/90 leading-relaxed">
            {parent.description}
          </p>
        </div>

        <ChildItemsList items={items} accent={ACCENT} />
      </div>
    </section>
  );
}
