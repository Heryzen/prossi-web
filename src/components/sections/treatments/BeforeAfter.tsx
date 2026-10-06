import { directusFetch, assetUrl } from "@/lib/directus";
import { pick, type PageContent } from "@/lib/pageContent";
import { BeforeAfterCarousel, type BeforeAfterPair } from "./BeforeAfterCarousel";

type CmsBeforeAfter = {
  id: string;
  image_before: string;
  image_after: string;
};

const fallbackPairs: BeforeAfterPair[] = [
  { before: "/figma/imgBeforeAfter1-41fe45.webp", after: "/figma/imgBeforeAfter2-41fe45b.webp" },
  { before: "/figma/imgBeforeAfter1-41fe45.webp", after: "/figma/imgBeforeAfter2-41fe45b.webp" },
];

export async function BeforeAfter({
  category,
  content,
}: {
  category?: "slimming" | "skin";
  content?: PageContent;
} = {}) {
  const filter = category ? `&filter[treatment][category][_eq]=${category}` : "";
  const items = await directusFetch<CmsBeforeAfter[]>(
    `/items/before_after?fields=id,image_before,image_after&sort=sort${filter}`
  );

  const pairs: BeforeAfterPair[] =
    items && items.length > 0
      ? items.map((it) => ({ before: assetUrl(it.image_before), after: assetUrl(it.image_after) }))
      : fallbackPairs;

  return (
    <section className="bg-[#f4ece4] w-full py-[60px] px-6 md:px-[40px]">
      <div className="max-w-[1358px] mx-auto flex flex-col gap-10">
        <div className="text-center">
          <h2 className="font-['Lato',sans-serif] font-extrabold text-[60px] leading-[0.99em] uppercase text-[#b59637]">
            {pick(content?.headline, "Before After")}
          </h2>
        </div>

        <BeforeAfterCarousel pairs={pairs} />
      </div>
    </section>
  );
}
