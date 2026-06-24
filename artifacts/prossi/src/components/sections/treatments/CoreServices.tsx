const programs = [
  {
    title: "Konsultasi dengan Dokter Sp.GK",
    desc: "Konsultasi langsung dengan Dokter Spesialis Gizi Klinik untuk mengetahui kondisi tubuhmu secara mendalam, mencakup evaluasi berat badan, komposisi tubuh, riwayat kesehatan, dan pola makan sehari-hari.",
    img: "/figma/imgProgramImage.png",
    size: "sm" as const,
  },
  {
    title: "Slimming Program dengan Dokter Sp.GK",
    desc: "Slimming Program di Prossi Clinic adalah program penanganan berat badan secara medis dan terstruktur yang ditangani langsung oleh dokter Spesialis Gizi Klinik. Program ini tidak hanya berfokus pada penurunan angka di timbangan, tetapi juga memperbaiki komposisi tubuh, metabolisme, dan kebiasaan makan secara menyeluruh.",
    img: "/figma/imgProgramImage1.png",
    size: "lg" as const,
  },
  {
    title: "Prossi Gene",
    desc: "Prossi Gene adalah layanan cek genetik yang membantu memahami apa yang dibutuhkan tubuhmu dari metabolisme, nutrisi, hingga gaya hidup terbaik sesuai DNA-mu.",
    img: "/figma/imgProgramImage2.png",
    size: "lg" as const,
  },
  {
    title: "Pro Slim",
    desc: "ProSlim adalah paket perawatan lengkap dengan jangka waktu mulai dari 3 sampai 6 bulan yang disupervisi langsung oleh dokter spesialis gizi klinik.",
    img: "/figma/imgProgramImage.png",
    size: "sm" as const,
  },
  {
    title: "Premium Slim Solution Premium Fat Burn Treatment Package (PFTP)",
    desc: "Fat-Burn Treatment Package adalah paket perawatan penurunan berat badan berupa injeksi meso slimming.",
    img: "/figma/imgProgramImage1.png",
    size: "sm" as const,
  },
  {
    title: "ProssiConsult+ by Sp.GK",
    desc: "Untuk kamu yang berada jauh dari cabang Prossi Clinic atau di kota yang belum tersedia Prossi Clinic, kini konsultasi program slimming dan nutrisi bisa dilakukan secara online bersama dokter Spesialis Gizi Klinik (Sp.GK). Dapatkan pendampingan dan program yang disesuaikan dengan kondisi tubuhmu tanpa perlu datang langsung ke klinik.",
    img: "/figma/imgProgramImage2.png",
    size: "lg" as const,
  },
];

function ProgramCard({ title, desc, img }: { title: string; desc: string; img: string; size: "sm" | "lg" }) {
  return (
    <div
      className="flex flex-col rounded-[24px] overflow-hidden w-full"
      style={{
        background: "linear-gradient(180deg, #fff 0%, #fff9eb 100%)",
        border: "1px solid #deba69",
      }}
    >
      <div className="w-full h-[210px] shrink-0">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-4 px-4 py-8">
        <h3 className="font-['Poppins',sans-serif] font-semibold text-[24px] text-[#120f0b] leading-tight">
          {title}
        </h3>
        <p className="font-['Inter',sans-serif] text-[16px] text-[#120f0b]/80 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function CoreServices() {
  const rows = [
    [programs[0], programs[1]],
    [programs[2], programs[3]],
    [programs[4], programs[5]],
  ];

  return (
    <section className="bg-[#cd724f] w-full py-[195px] px-6 md:px-[100px]">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-[60px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 max-w-[1019px] text-center">
          <div className="border border-white/40 rounded-full px-[14px] py-2">
            <span className="font-['Lato',sans-serif] font-medium text-[16px] text-white uppercase tracking-wider">
              Slimming Program
            </span>
          </div>
          <h2 className="font-['Source_Serif_4',serif] font-semibold text-[40px] text-white">
            Pilih Perawatan Sesuai Kebutuhan Anda
          </h2>
          <p className="font-['Inter',sans-serif] text-[18px] text-white">
            Setiap kategori dirancang untuk membantu Anda menemukan solusi yang paling sesuai dengan kondisi Anda.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6 w-full">
          {rows.map((row, ri) => (
            <div key={ri} className="flex flex-col md:flex-row items-stretch gap-6">
              {row.map((p, pi) => (
                <ProgramCard key={pi} {...p} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
