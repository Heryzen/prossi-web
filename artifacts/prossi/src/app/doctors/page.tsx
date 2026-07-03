import { DoctorsPageContent } from "@/components/DoctorsPageContent";
import { ALL_DOCTORS } from "@/components/doctors-data";

export default function Doctors() {
  return (
    <DoctorsPageContent
      eyebrow="DOKTER SPESIALIS"
      heroGradientRgb="63,109,112"
      doctors={ALL_DOCTORS}
    />
  );
}
