export type Branch = {
  name: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
  mapsUrl: string;
};

export const branches: Branch[] = [
  {
    name: "Prossi Clinic – Sudirman",
    address:
      "Lot 6 Kawasan SCBD Sudirman, Jl. Jenderal Sudirman Kav. 52-53, RT.5/RW.1, Senayan, Kec. Kebayoran Baru, Kota Jakarta Selatan, DKI Jakarta 12190",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2256,
    lng: 106.8044,
    mapsUrl: "https://maps.google.com/?q=Sudirman+SCBD+Jakarta",
  },
  {
    name: "Prossi Clinic – Kemang",
    address:
      "Jl. Kemang Raya No. 5, RT.1/RW.4, Bangka, Kec. Mampang Prapatan, Kota Jakarta Selatan, DKI Jakarta 12730",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2615,
    lng: 106.8115,
    mapsUrl: "https://maps.google.com/?q=Kemang+Jakarta",
  },
  {
    name: "Prossi Clinic – BSD",
    address:
      "Jl. Pahlawan Seribu, BSD City, Lengkong Gudang, Kec. Serpong, Kota Tangerang Selatan, Banten 15321",
    hours: "OPEN: Monday – Friday 08:00 AM–09:00 PM",
    lat: -6.2917,
    lng: 106.6655,
    mapsUrl: "https://maps.google.com/?q=BSD+Tangerang+Selatan",
  },
];
