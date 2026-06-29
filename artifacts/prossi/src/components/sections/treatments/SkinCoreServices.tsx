const CARD_BORDER =
  "linear-gradient(270deg, rgba(222,186,105,1) 0%, rgba(235,210,151,1) 30%, rgba(251,232,166,1) 50%, rgba(235,210,151,1) 70%, rgba(222,186,105,1) 100%)";
const CARD_BG = "linear-gradient(180deg, #ffffff 0%, #fff9eb 100%)";

const programs = [
  {
    title: "Konsultasi dengan Dokter Sp.DVE",
    desc: "Konsultasi langsung dengan Dokter Spesialis Dermatologi, Venereologi, dan Estetika untuk mengetahui kondisi kulitmu secara menyeluruh.",
    img: "/figma/imgSkinCard1.webp",
    size: "sm" as const,
  },
  {
    title: "Aesthetic Treatment by Sp.DVE",
    desc: "Solusi untuk berbagai permasalahan kulit. Dilengkapi dengan peralatan canggih seperti IPL, Laser, HIFU, dll. Ditangani langsung oleh Dokter Spesialis Dermatologi, Venereologi, dan Estetika",
    img: "/figma/imgSkinCard2.webp",
    size: "lg" as const,
  },
  {
    title: "ProssiConsult+ by Sp.DVE",
    desc: "Konsultasikan berbagai masalah kulit, penyakit kelamin, dan kondisi dermatologis langsung secara online bersama dokter Spesialis Dermatologi, Venereologi & Estetika (Sp.DVE). Solusi tepat untuk kamu yang ingin tetap mendapatkan penanganan medis profesional dari mana saja.",
    img: "/figma/imgSkinCard3.webp",
    size: "lg" as const,
  },
  {
    title: "Prossi Clinical Skin Solution",
    desc: "Penanganan komprehensif untuk berbagai kulit, kelamin, dan tindakan bedah kulit minor. Ditangani langsung oleh dokter Spesialis Dermatologi, Venereologi & Estetika (Sp.DVE) yang tepat untuk semua usia.",
    img: "/figma/imgSkinCard4.webp",
    size: "sm" as const,
  },
];

function ProgramCard({ title, desc, img, size }: { title: string; desc: string; img: string; size: "sm" | "lg" }) {
  return (
    <div
      className="rounded-[24px] p-[1px] flex-1"
      style={{ background: CARD_BORDER }}
    >
      <div className="rounded-[23px] flex flex-col h-full" style={{ background: CARD_BG, padding: "12px 12px 32px" }}>
        <div className="w-full h-[210px] shrink-0 rounded-[20px] overflow-hidden">
          <img src={img} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-4 px-4 pt-8">
          <h3 className="font-['Poppins',sans-serif] font-semibold text-[24px] text-[#120f0b] uppercase leading-tight">
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

export function SkinCoreServices() {
  return (
    <section className="w-full pt-[60px] pb-[80px] px-6 md:px-[100px]" style={{ background: "#426B6A" }}>
      <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-[60px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 max-w-[1019px] text-center">
          <div
            className="px-[14px] py-2 rounded-full"
            style={{
              border: "1px solid #ffffff",
              boxShadow:
                "0px 4px 4px -4px rgba(79,81,89,0.32), 0px 2px 5px -2px rgba(79,81,89,0.03), 0px 0px 0px 1px rgba(188,189,194,0.25), 0px 1px 1px 0px rgba(188,189,194,0.2)",
            }}
          >
            <span className="font-['Lato',sans-serif] font-medium text-[16px] text-white uppercase">
              Skin Treatments
            </span>
          </div>
          <h2 className="font-['Source_Serif_4',serif] font-semibold text-[40px] text-white">
            Pilih Perawatan Sesuai Kebutuhan Anda
          </h2>
          <p className="font-['Inter',sans-serif] text-[18px] text-white">
            Setiap kategori dirancang untuk membantu Anda menemukan solusi yang paling sesuai dengan kondisi Anda.
          </p>
        </div>

        {/* Cards — 2 rows */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <ProgramCard {...programs[0]} />
            <ProgramCard {...programs[1]} />
          </div>
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <ProgramCard {...programs[2]} />
            <ProgramCard {...programs[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}
