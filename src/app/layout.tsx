import type { Metadata } from "next";
import { Baloo_2, Mukta } from "next/font/google";
import "./globals.css";

// Both from Ek Type (Mumbai): rounded display + highly readable text face, each with Devanagari support.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tr. Revathi Phonics",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${baloo.variable} ${mukta.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
