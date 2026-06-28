import { CountUp } from "@/components/CountUp";

export function Stats() {
  const stats = [
    { value: "10+", label: "Tahun Pengalaman", icon: "/figma/imgPremium187273551.svg" },
    { value: "15,000+", label: "Pasien Ditangani", icon: "/figma/imgLayer2.svg" },
    { value: "92%", label: "Patient Satisfaction", icon: "/figma/imgShield131932661.svg" },
  ];

  return (
    <section className="relative z-10 lg:z-30 w-full flex justify-center px-4 lg:px-6 mt-6 lg:-mt-[120px] mb-0 lg:mb-[-70px]">
      <div className="max-w-[1240px] w-full backdrop-blur-[11px] bg-[rgba(255,248,242,0.85)] rounded-[32px] px-6 lg:px-[64px] py-6 lg:py-[32px] shadow-[0px_18px_40px_rgba(56,0,30,0.08)]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-0">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={stat.icon} alt="" className="w-10 h-10 lg:w-[54px] lg:h-[54px] shrink-0" />
              <div className="flex flex-col">
                <CountUp
                  value={stat.value}
                  className="font-serif font-semibold text-2xl lg:text-[40px] text-[#503d1c] capitalize leading-none"
                />
                <span className="font-sans text-lg text-[#120f0b] opacity-80 mt-1">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
