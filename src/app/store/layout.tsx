import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Organic Skincare Products - Aruk Beauty Line",
  description: "Browse our hand-formulated collection of organic artisanal soaps, whipped body creams, and rejuvenation oils, produced in Uyo, Nigeria.",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
