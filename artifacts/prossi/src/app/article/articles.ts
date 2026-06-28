export const ITEMS_PER_PAGE = 4;
export const TOTAL_PAGES = 10;

export type Article = {
  id: number;
  title: string;
  excerpt: string;
  img: string;
  date: string;
  author: string;
  publishedAt: string;
  body: string[];
};

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id.",
  "Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.",
  "Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id.",
];

const baseArticles = [
  {
    title: "Top Study Hacks for Olympiad Success",
    excerpt:
      "Unlock proven strategies to study smarter, not harder. From time management to problem-solving techniques, these tips will elevate your preparation.",
    img: "/figma/imgFrame1984078116.png",
  },
  {
    title: "Smart Nutrition Habits for a Healthier You",
    excerpt:
      "Unlock proven strategies to study smarter, not harder. From time management to problem-solving techniques, these tips will elevate your preparation.",
    img: "/figma/imgFrame1984078117.png",
  },
  {
    title: "The Journey of a Champion: How I Won My First Olympiad",
    excerpt:
      "Get inspired by the story of a young Olympiad participant who went from nervous beginner to grand champion through persistence and dedication.",
    img: "/figma/imgFrame1984078118.png",
  },
  {
    title: "Why Trial Exams Are Key to Winning the Olympiad",
    excerpt:
      "Discover how trial exams build your confidence, sharpen your skills, and prepare you to ace the big day. Learn how to make the most of your practice sessions.",
    img: "/figma/imgFrame1984078116.png",
  },
  {
    title: "Memahami Jenis Kulit Sebelum Memulai Perawatan",
    excerpt:
      "Kenali tipe kulit Anda — normal, kering, berminyak, atau kombinasi — agar setiap treatment yang dipilih benar-benar sesuai dengan kebutuhan kulit.",
    img: "/figma/imgFrame1984078117.png",
  },
  {
    title: "Slimming Sehat: Mitos dan Fakta dari Dokter Gizi",
    excerpt:
      "Banyak informasi keliru soal menurunkan berat badan. Dokter Spesialis Gizi Prossi meluruskan mitos yang sering bikin program slimming gagal.",
    img: "/figma/imgFrame1984078118.png",
  },
  {
    title: "Rutinitas Perawatan Kulit Harian yang Efektif",
    excerpt:
      "Langkah sederhana namun konsisten adalah kunci kulit sehat. Simak urutan skincare pagi dan malam yang direkomendasikan dokter estetika kami.",
    img: "/figma/imgFrame1984078116.png",
  },
  {
    title: "Kapan Waktu Tepat untuk Laser & Rejuvenation?",
    excerpt:
      "Treatment laser bukan untuk semua kondisi. Pelajari kapan prosedur ini ideal dan apa saja yang perlu dipersiapkan sebelum menjalaninya.",
    img: "/figma/imgFrame1984078117.png",
  },
];

// Build a pool large enough to fill every page so pagination shows real content.
export const allArticles: Article[] = Array.from(
  { length: ITEMS_PER_PAGE * TOTAL_PAGES },
  (_, i) => {
    const base = baseArticles[i % baseArticles.length];
    return {
      ...base,
      id: i,
      date: "18 April 2025",
      author: "Ray Aditya Kusumo",
      publishedAt: "18 April 2025, 19:00 WIB",
      body: LOREM,
    };
  }
);

export function getArticle(id: number): Article | undefined {
  return allArticles.find((a) => a.id === id);
}

export function relatedArticles(id: number, count = 3): Article[] {
  return allArticles.filter((a) => a.id !== id).slice(0, count);
}
