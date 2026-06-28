const CARD_BORDER = "linear-gradient(270deg, rgba(222,186,105,1) 0%, rgba(235,210,151,1) 30%, rgba(251,232,166,1) 50%, rgba(235,210,151,1) 70%, rgba(222,186,105,1) 100%)";
const CARD_BG = "linear-gradient(180deg, #ffffff 0%, #fff9eb 100%)";

const programs = [
  {
    title: "Konsultasi dengan Dokter Sp.GK",
    desc: "Konsultasi langsung dengan Dokter Spesialis Gizi Klinik untuk mengetahui kondisi tubuhmu secara mendalam, mencakup evaluasi berat badan, komposisi tubuh, riwayat kesehatan, dan pola makan sehari-hari.",
    img: "/figma/imgCard1.webp",
    size: "sm" as const,
  },
  {
    title: "Slimming Program dengan Dokter Sp.GK",
    desc: "Slimming Program di Prossi Clinic adalah program penanganan berat badan secara medis dan terstruktur yang ditangani langsung oleh dokter Spesialis Gizi Klinik. Program ini tidak hanya berfokus pada penurunan angka di timbangan, tetapi juga memperbaiki komposisi tubuh, metabolisme, dan kebiasaan makan secara menyeluruh.",
    img: "/figma/imgCard2.webp",
    size: "lg" as const,
  },
  {
    title: "Prossi Gene",
    desc: "Prossi Gene adalah layanan cek genetik yang membantu memahami apa yang dibutuhkan tubuhmu dari metabolisme, nutrisi, hingga gaya hidup terbaik sesuai DNA-mu.",
    img: "/figma/imgCard3.webp",
    size: "lg" as const,
  },
  {
    title: "Pro Slim",
    desc: "ProSlim adalah paket perawatan lengkap dengan jangka waktu mulai dari 3 sampai 6 bulan yang disupervisi langsung oleh dokter spesialis gizi klinik.",
    img: "/figma/imgCard4.webp",
    size: "sm" as const,
  },
  {
    title: "Premium Slim Solution Premium Fat Burn Treatment Package (PFTP)",
    desc: "Fat-Burn Treatment Package adalah paket perawatan penurunan berat badan berupa injeksi meso slimming.",
    img: "/figma/imgCard1.webp",
    size: "sm" as const,
  },
  {
    title: "ProssiConsult+ by Sp.GK",
    desc: "Untuk kamu yang berada jauh dari cabang Prossi Clinic atau di kota yang belum tersedia Prossi Clinic, kini konsultasi program slimming dan nutrisi bisa dilakukan secara online bersama dokter Spesialis Gizi Klinik (Sp.GK). Dapatkan pendampingan dan program yang disesuaikan dengan kondisi tubuhmu tanpa perlu datang langsung ke klinik.",
    img: "/figma/imgCard2.webp",
    size: "lg" as const,
  },
];

function ProgramCard({ title, desc, img, size }: { title: string; desc: string; img: string; size: "sm" | "lg" }) {
  return (
    <div
      className="rounded-[24px] p-[1px] w-full"
      style={{
        background: CARD_BORDER,
        flex: size === "sm" ? "0 1 504px" : "0 1 712px",
      }}
    >
      {/* padding: 12px 12px 32px — matches Figma */}
      <div
        className="rounded-[23px] flex flex-col h-full"
        style={{ background: CARD_BG, padding: "12px 12px 32px" }}
      >
        <div className="w-full h-[210px] shrink-0 rounded-[20px] overflow-hidden">
          <img src={img} alt={title} className="w-full h-full object-cover" />
        </div>
        {/* info padding: 0px 16px, gap: 32px between image and info */}
        <div className="flex flex-col gap-4 px-4 pt-8">
          <h3 className="font-['Poppins',sans-serif] font-semibold text-[18px] md:text-[24px] text-[#120f0b] uppercase leading-tight">
            {title}
          </h3>
          <p className="font-['Inter',sans-serif] font-normal text-[16px] text-[#120f0b] leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CoreServices() {
  const rows: [typeof programs[0], typeof programs[1]][] = [
    [programs[0], programs[1]],
    [programs[2], programs[3]],
    [programs[4], programs[5]],
  ];

  return (
    <section className="bg-[#cd724f] w-full pt-[60px] pb-[80px] px-6 md:px-[100px]">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-[60px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 max-w-[1019px] text-center">
          <div
            className="px-[14px] py-2 rounded-full"
            style={{
              border: "1px solid #ffffff",
              boxShadow: "0px 4px 4px -4px rgba(79,81,89,0.32), 0px 2px 5px -2px rgba(79,81,89,0.03), 0px 0px 0px 1px rgba(188,189,194,0.25), 0px 1px 1px 0px rgba(188,189,194,0.2)",
            }}
          >
            <span className="font-['Lato',sans-serif] font-medium text-[16px] text-white uppercase" style={{ letterSpacing: "-0.0063em" }}>
              Slimming Program
            </span>
          </div>
          <h2 className="font-['Source_Serif_4',serif] font-semibold text-[26px] md:text-[40px] text-white">
            Pilih Perawatan Sesuai Kebutuhan Anda
          </h2>
          <p className="font-['Inter',sans-serif] text-[14px] md:text-[18px] text-white">
            Setiap kategori dirancang untuk membantu Anda menemukan solusi yang paling sesuai dengan kondisi Anda.
          </p>
        </div>

        {/* Cards — 3 rows, alternating sm+lg */}
        <div className="flex flex-col gap-6 w-full">
          {rows.map(([left, right], ri) => (
            <div key={ri} className="flex flex-col md:flex-row gap-6 w-full">
              <ProgramCard {...left} />
              <ProgramCard {...right} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
