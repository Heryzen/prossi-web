import Link from "next/link";
import { directusFetch, assetUrl } from "@/lib/directus";
import { getPageContent, pick } from "@/lib/pageContent";

const staticTeam = [
  { title: "Spesialis Gizi Klinis", img: "/figma/imgTeamMemberImage.webp" },
  { title: "spesialis Kulit & Estetika", img: "/figma/imgTeamMemberImage1.webp" },
  { title: "Dokter Umum", img: "/figma/imgTeamMemberImage2.webp" },
];

type CmsDoctor = { specialty: string; photo: string | null; treatment_category: string | null };

export async function Team() {
  const [cms, pc] = await Promise.all([
    directusFetch<CmsDoctor[]>(
      "/items/doctors?filter[status][_eq]=published&filter[featured][_eq]=true&sort=sort&fields=specialty,photo,treatment_category&limit=3"
    ),
    getPageContent(["home.doctors", "home.doctor.1", "home.doctor.2", "home.doctor.3"]),
  ]);

  const header = pc["home.doctors"];

  const team =
    cms && cms.length > 0
      ? cms.map((d, i) => ({
          title: pick(pc[`home.doctor.${i + 1}`]?.headline, d.specialty),
          img: d.photo ? assetUrl(d.photo) : staticTeam[i % staticTeam.length].img,
          href: d.treatment_category ? `/doctors?category=${d.treatment_category}` : "/doctors",
        }))
      : staticTeam.map((t) => ({ ...t, href: "/doctors" }));

  return (
    <section className="bg-[#b59637] w-full py-12 lg:py-[100px] px-6 lg:px-[100px] flex flex-col items-center">
      <div className="max-w-[1240px] w-full flex flex-col items-center gap-[60px]">
        <div className="flex flex-col items-center gap-6 w-full text-center">
          <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-white">
            {pick(header?.headline, "Ditangani oleh Dokter-dokter Profesional dan Berpengalaman")}
          </h2>
        </div>

        <div className="w-full grid grid-cols-3 gap-2 lg:flex lg:flex-row lg:gap-6">
          {team.map((member, i) => (
            <div key={i} className="flex flex-col items-center gap-2 lg:flex-1 lg:gap-6">
              <div className="w-full h-[200px] lg:h-[428px] border border-[#deba69] rounded-t-[50000px] overflow-hidden relative">
                <img src={member.img} alt={member.title} className="absolute inset-0 w-full h-full object-cover object-top" />
              </div>
              <h3 className="font-sans font-semibold text-[11px] leading-tight lg:text-[26px] text-white text-center capitalize min-h-[28px] lg:min-h-[70px] flex items-center justify-center">
                {member.title}
              </h3>
              <Link
                href={member.href}
                className="w-full text-center lg:w-auto bg-[#b59637] border border-[#ecd5a5] rounded-full px-2 py-1.5 text-[9px] lg:px-9 lg:py-[18px] lg:text-lg text-white font-sans font-semibold hover:bg-[#a3852f] hover:shadow-lg hover:scale-[1.04] transition-all duration-200 whitespace-nowrap"
              >
                View Doctors
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
