import { Hero, type HeroSlide } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { TreatmentServices } from "@/components/sections/TreatmentServices";
import { Team } from "@/components/sections/Team";
import { Blog } from "@/components/sections/Blog";
import { Testimonials, type Review } from "@/components/sections/Testimonials";
import { CTA, type PromoSlide } from "@/components/sections/CTA";
import { Reveal } from "@/components/Reveal";
import { directusFetch, assetUrl } from "@/lib/directus";

type CmsBanner = { heading: string; subheading: string; image: string | null };
type CmsTestimonial = { name: string; city: string; quote: string; photo: string | null };
type CmsPromo = { title: string; description: string; image: string | null; cta_link: string | null };

export default async function Home() {
  const [banners, cmsReviews, cmsPromos] = await Promise.all([
    directusFetch<CmsBanner[]>(
      "/items/hero_banners?filter[status][_eq]=published&sort=sort&fields=heading,subheading,image"
    ),
    directusFetch<CmsTestimonial[]>("/items/testimonials?fields=name,city,quote,photo"),
    directusFetch<CmsPromo[]>(
      "/items/promos?filter[status][_eq]=published&fields=title,description,image,cta_link"
    ),
  ]);

  const promos: PromoSlide[] | undefined =
    cmsPromos && cmsPromos.length > 0
      ? cmsPromos.map((p) => ({
          title: p.title,
          description: p.description,
          ctaLink: p.cta_link || "/promo",
          image: p.image ? assetUrl(p.image) : null,
        }))
      : undefined;

  const reviews: Review[] | undefined =
    cmsReviews && cmsReviews.length > 0
      ? cmsReviews.map((t) => ({
          text: `"${t.quote}"`,
          location: t.city?.toUpperCase() ?? "",
          name: t.name,
          avatar: t.photo ? assetUrl(t.photo) : "/figma/imgImagePlaceholder.webp",
          image: t.photo ? assetUrl(t.photo) : "/figma/imgFrame1618873277.webp",
        }))
      : undefined;

  const slides: HeroSlide[] | undefined =
    banners && banners.length > 0
      ? banners.map((b) => ({
          img: b.image ? assetUrl(b.image) : "/figma/imgBackground1.webp",
          heading: b.heading,
          sub: b.subheading,
        }))
      : undefined;

  return (
    <>
      <Hero slides={slides} />
      <Reveal><Philosophy /></Reveal>
      <Reveal><TreatmentServices /></Reveal>
      <Reveal><Team /></Reveal>
      <Reveal><Blog /></Reveal>
      <Reveal><Testimonials reviews={reviews} /></Reveal>
      <Reveal><CTA promos={promos} /></Reveal>
    </>
  );
}
