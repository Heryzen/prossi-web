import React from "react";

export function Stats() {
  const stats = [
    { value: "10+", label: "Tahun Pengalaman" },
    { value: "15.500+", label: "Pasien Terpercaya" },
    { value: "92%", label: "Tingkat Kepuasan" }
  ];

  return (
    <section className="bg-[#f4ece4] w-full py-12 px-6 flex justify-center">
      <div className="max-w-[1240px] w-full flex flex-col md:flex-row justify-center items-center gap-12 md:gap-32 border-y border-[#deba69]/30 py-8">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-2">
            <span className="font-serif font-semibold text-4xl md:text-5xl text-[#c26345]">{stat.value}</span>
            <span className="font-sans font-medium text-lg text-[#120f0b] opacity-80">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
