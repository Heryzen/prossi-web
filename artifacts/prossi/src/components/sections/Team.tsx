import Link from "next/link";
import { directusFetch, assetUrl } from "@/lib/directus";

const staticTeam = [
  { title: "Spesialis Gizi Klinis", img: "/figma/imgTeamMemberImage.webp" },
  { title: "spesialis Kulit & Estetika", img: "/figma/imgTeamMemberImage1.webp" },
  { title: "Dokter Umum", img: "/figma/imgTeamMemberImage2.webp" },
];

type CmsDoctor = { specialty: string; photo: string | null };

export async function Team() {
  const cms = await directusFetch<CmsDoctor[]>(
    "/items/doctors?filter[status][_eq]=published&sort=sort&fields=specialty,photo&limit=3"
  );

  const team =
    cms && cms.length > 0
      ? cms.map((d, i) => ({
          title: d.specialty,
          img: d.photo ? assetUrl(d.photo) : staticTeam[i % staticTeam.length].img,
        }))
      : staticTeam;

  return (
    <section className="bg-[#b59637] w-full py-12 lg:py-[100px] px-6 lg:px-[100px] flex flex-col items-center">
      <div className="max-w-[1240px] w-full flex flex-col items-center gap-[60px]">
        <div className="flex flex-col items-center gap-6 w-full text-center">
          <div className="flex gap-[16px] items-center justify-center overflow-clip relative shrink-0">
            <div className="h-0 relative shrink-0 w-[63px]">
              <div className="absolute inset-[-5.77px_-9.16%_-5.77px_0]">
                <img alt="" className="block max-w-none size-full" src="/figma/imgLine4.svg" />
              </div>
            </div>
            <span className="font-['Inter'] font-semibold leading-normal not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">OUR DOCTORS</span>
            <div className="flex items-center justify-center relative shrink-0">
              <div className="-scale-y-100 flex-none rotate-180">
                <div className="h-0 relative w-[63px]">
                  <div className="absolute inset-[-5.77px_-9.16%_-5.77px_0]">
                    <img alt="" className="block max-w-none size-full" src="/figma/imgLine2.svg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="font-['Lato'] font-semibold text-[32px] md:text-[40px] text-white capitalize">
            Ditangani oleh Dokter-Dokter Profesional dan Berpengalaman
          </h2>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-6">
          {team.map((member, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-6">
              <div className="w-full h-[428px] border border-[#deba69] rounded-t-[50000px] overflow-hidden relative">
                <img src={member.img} alt={member.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <h3 className="font-serif font-semibold text-[26px] text-white text-center capitalize">
                {member.title}
              </h3>
              <Link
                href="/doctors"
                className="hidden lg:flex bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:bg-[#a3852f] hover:shadow-lg hover:scale-[1.04] transition-all duration-200"
              >
                View Doctors
              </Link>
            </div>
          ))}
        </div>

        {/* Single "View Doctors" button shown only on mobile */}
        <Link
          href="/doctors"
          className="lg:hidden mt-2 bg-[#b59637] border border-[#ecd5a5] rounded-full px-9 py-[18px] text-white font-serif font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          View Doctors
        </Link>
      </div>
    </section>
  );
}
