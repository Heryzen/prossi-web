export function Stats() {
  const stats = [
    { value: "10+", label: "Tahun Pengalaman", icon: "/figma/imgPremium187273551.svg" },
    { value: "15,000+", label: "Pasien Ditangani", icon: "/figma/imgLayer2.svg" },
    { value: "92%", label: "Patient Satisfaction", icon: "/figma/imgShield131932661.svg" },
  ];

  return (
    <section className="relative z-30 w-full flex justify-center px-6 -mt-[120px] mb-[-70px]">
      <div className="max-w-[1240px] w-full backdrop-blur-[11px] bg-[rgba(255,248,242,0.85)] rounded-[32px] px-8 md:px-[64px] py-8 md:py-[32px] shadow-[0px_18px_40px_rgba(56,0,30,0.08)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-5">
              <img src={stat.icon} alt="" className="w-[54px] h-[54px] shrink-0" />
              <div className="flex flex-col">
                <span className="font-serif font-semibold text-[40px] text-[#503d1c] capitalize leading-none">
                  {stat.value}
                </span>
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
