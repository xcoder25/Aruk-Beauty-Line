import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import SplashScreen from "./components/PageLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aruk Beauty Line | Organic Skincare for Mature Women",
  description:
    "99.5% Organic, pocket-friendly, and premium quality body care products formulated to repair damaged skin and restore radiance after 40. Handcrafted in Uyo.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#C5A880",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {/* 5-second cinematic splash screen shown on every page load */}
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
