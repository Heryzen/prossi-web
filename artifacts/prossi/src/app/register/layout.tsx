import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Prossi Clinic",
  robots: "noindex, nofollow",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
