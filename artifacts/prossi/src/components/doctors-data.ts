export type Doctor = {
  img: string;
  name: string;
  specialty: string;
  bio: string;
  schedule: string;
  hours: string;
};

export const ALL_DOCTORS: Doctor[] = [
  {
    img: "/figma/imgTeamMemberImage.webp",
    name: "dr. Reina Kartika, Sp.GK",
    specialty: "SPESIALIS GIZI KLINIK",
    bio: "Dokter spesialis gizi klinik berpengalaman dalam merancang program slimming berbasis medis yang personal, aman, dan berkelanjutan untuk setiap pasien.",
    schedule: "Senin – Jumat",
    hours: "09.00 – 17.00",
  },
  {
    img: "/figma/imgTeamMemberImage1.webp",
    name: "dr. Desiree Ayu, Sp.DVE",
    specialty: "SPESIALIS KULIT & ESTETIKA",
    bio: "Spesialis Dermatologi, Venereologi & Estetika yang menangani berbagai kondisi kulit dan kelamin dengan pendekatan klinis dan teknologi terkini seperti IPL dan Laser.",
    schedule: "Selasa – Sabtu",
    hours: "10.00 – 18.00",
  },
  {
    img: "/figma/imgTeamMemberImage2.webp",
    name: "dr. Fajar Nugroho",
    specialty: "DOKTER ESTETIKA",
    bio: "Dokter estetika Prossi Clinic yang berfokus pada perawatan kecantikan sehari-hari, mulai dari perawatan wajah hingga HIFU, dengan hasil natural dan terarah.",
    schedule: "Senin – Sabtu",
    hours: "09.00 – 16.00",
  },
];
