import { CompareSection } from "@/components/sections/treatments/CompareSection";

const CARD_BORDER_SLIMMING =
  "linear-gradient(270deg, rgba(194,99,69,1) 0%, rgba(222,186,105,1) 100%)";
const CARD_BORDER_DVE =
  "linear-gradient(270deg, rgba(57,107,114,1) 0%, rgba(222,186,105,1) 100%)";
const CARD_BORDER_EST =
  "linear-gradient(270deg, rgba(222,186,105,1) 0%, rgba(222,186,105,1) 100%)";
const CARD_BG = "linear-gradient(180deg, #ffffff 0%, #fff9eb 100%)";

const corePrograms = [
  {
    title: "Slimming Program by\nSp.GK",
    img: "/figma/imgAboutCardSlimming-29ddd5.png",
    border: CARD_BORDER_SLIMMING,
  },
  {
    title: "Skin Treatment by\nSp.DVE",
    img: "/figma/imgAboutCardSkinDVE-ee6372.png",
    border: CARD_BORDER_DVE,
  },
  {
    title: "Skin Treatment by\nDokter Estetika",
    img: "/figma/imgAboutCardSkinEst-2ec088.png",
    border: CARD_BORDER_EST,
  },
];

function CoreProgramCard({ title, img, border }: { title: string; img: string; border: string }) {
  return (
    <div className="rounded-[24px] p-[4px] flex-1" style={{ background: border }}>
      <div
        className="rounded-[20px] flex flex-col h-full overflow-hidden"
        style={{ background: CARD_BG, padding: "12px 12px 24px" }}
      >
        <div className="w-full rounded-[20px] overflow-hidden" style={{ height: 295 }}>
          <img src={img} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-center gap-4 px-4 pt-6">
          <h3
            className="font-['Lato',sans-serif] font-semibold text-[#120f0b] text-center capitalize whitespace-pre-line"
            style={{ fontSize: 26 }}
          >
            {title}
          </h3>
          <div
            style={{
              width: 290,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(124,96,51,0) 0%, rgba(124,96,51,1) 50%, rgba(124,96,51,0) 100%)",
            }}
          />
          <p className="font-['Inter',sans-serif] text-[16px] text-[#120f0b] text-center leading-relaxed">
            Temukan program perawatan yang paling sesuai dengan kondisi dan kebutuhan Anda.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-9 py-[18px] rounded-full font-['Source_Serif_4',serif] font-semibold text-[18px] text-white"
            style={{ background: "#B59637", border: "1px solid #ECD5A5" }}
          >
            View Doctors
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-col pt-[79px]">

      {/* ── Hero + About intro wrapped in white so rounded corners are seamless ── */}
      <div className="bg-white">
      {/* ── Hero ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 440, borderRadius: "0 0 100px 100px" }}
      >
        <img
          src="/figma/imgContactHero-4f95a9.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, rgba(105,85,56,0) 30%, rgba(105,85,56,0.6) 41%, rgba(105,85,56,0.82) 53%, rgba(105,85,56,1) 100%)",
          }}
        />
        <div
          className="relative z-10 flex flex-col gap-4"
          style={{ paddingLeft: 100, paddingTop: 200, maxWidth: 711 }}
        >
          <h1
            className="font-['Source_Serif_4',serif] font-normal leading-tight"
            style={{
              fontSize: 45,
              background:
                "linear-gradient(270deg, rgba(251,232,166,1) 0%, rgba(235,210,151,1) 41%, rgba(251,232,166,1) 67%, rgba(251,232,166,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Tentang Prossi
          </h1>
          <p
            className="font-['Lato',sans-serif] font-normal text-white"
            style={{ fontSize: 18, lineHeight: "1.6" }}
          >
            Lebih Dari Sekadar Klinik Estetika. Di Prossi, kami percaya bahwa perawatan bukan hanya tentang penampilan tetapi tentang bagaimana seseorang merasa lebih sehat, lebih percaya diri, dan lebih nyaman dengan dirinya sendiri.
          </p>
        </div>
      </div>

      {/* ── About intro ── */}
      <div style={{ padding: "40px 160px 80px" }}>
        <div className="flex flex-col items-center gap-8">
          <div
            className="w-full rounded-[20px]"
            style={{ maxWidth: 860, height: 481, background: "#ECD5A5" }}
          />
          <p
            className="font-['Inter',sans-serif] font-medium text-[#000000] text-center"
            style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em", maxWidth: 860 }}
          >
            kami menghadirkan pendekatan medis yang personal untuk membantu setiap pasien memahami kebutuhan tubuh dan kulitnya secara lebih menyeluruh. Bukan treatment yang sekadar mengikuti tren, tetapi perawatan yang dirancang berdasarkan kondisi, tujuan, dan kenyamanan setiap individu.
          </p>
        </div>
      </div>

      </div>{/* end bg-white wrapper */}

      {/* ── Perjalanan Prossi ── */}
      <div style={{ padding: "80px 260px", background: "#F4ECE4" }}>
        <div className="flex flex-col items-center gap-6 text-center">
          <h2
            className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#11151C]"
            style={{ fontSize: 36, lineHeight: "44px", letterSpacing: "0.0069em" }}
          >
            Perjalanan Prossi
          </h2>
          <p
            className="font-['Inter',sans-serif] font-medium text-[#000000]"
            style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
          >
            Berawal dari visi sederhana untuk menghadirkan layanan wellness dan estetika yang lebih terpercaya, Prossi terus berkembang menjadi klinik yang mengedepankan kualitas pelayanan, kenyamanan pasien, dan pendekatan medis yang lebih personal
          </p>
          <p
            className="font-['Inter',sans-serif] font-medium text-[#000000]"
            style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
          >
            Hari ini, Prossi hadir untuk membantu lebih banyak orang mendapatkan pengalaman perawatan yang tidak hanya efektif, tetapi juga terasa aman, nyaman, dan manusiawi.
          </p>
        </div>
      </div>

      {/* ── Vision / Mission ── */}
      <div
        className="flex items-center gap-12"
        style={{ padding: "80px 0 120px 160px", background: "#FFFFFF" }}
      >
        <div className="flex flex-col gap-20 flex-1">
          <div className="flex flex-col gap-2">
            <h3
              className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#11151C]"
              style={{ fontSize: 36, lineHeight: "44px" }}
            >
              Vision
            </h3>
            <p
              className="font-['Inter',sans-serif] font-medium text-[#000000]"
              style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
            >
              Menjadi klinik kecantikan dan kesehatan terpercaya yang menghadirkan solusi perawatan medis berkualitas tinggi dengan pendekatan personal dan berorientasi pada hasil nyata.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3
              className="font-['Merriweather_Sans',sans-serif] font-extrabold text-[#11151C]"
              style={{ fontSize: 36, lineHeight: "44px" }}
            >
              Mission
            </h3>
            <p
              className="font-['Inter',sans-serif] font-medium text-[#000000]"
              style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "0.0094em" }}
            >
              Memberikan perawatan medis estetika yang aman, terarah, dan dapat dipantau — ditangani langsung oleh dokter spesialis untuk setiap pasien.
            </p>
          </div>
        </div>

        <div
          style={{
            width: 761,
            height: 640,
            background: "#E4C986",
            borderRadius: "20px 0 0 20px",
            flexShrink: 0,
          }}
        />
      </div>

      {/* ── Core Services ── */}
      <div style={{ background: "#F4ECE4", padding: "62px 82px 80px" }}>
        <div className="flex flex-col items-center gap-4 mb-14">
          <h2
            className="font-['Source_Serif_4',serif] font-semibold text-[#120f0b] text-center"
            style={{ fontSize: 46 }}
          >
            Perawatan Sesuai Kebutuhan Anda
          </h2>
          <p
            className="font-['Lato',sans-serif] font-normal text-[#000000] text-center"
            style={{ fontSize: 18, maxWidth: 878 }}
          >
            Setiap program, baik untuk kulit maupun slimming, dirancang berdasarkan kondisi tubuh Anda, bukan pendekatan yang sama untuk semua pasien.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-9">
          {corePrograms.map((p) => (
            <CoreProgramCard key={p.title} {...p} />
          ))}
        </div>
      </div>

      <CompareSection />
    </div>
  );
}
