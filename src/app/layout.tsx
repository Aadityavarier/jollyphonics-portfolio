import type { Metadata } from "next";
import { Baloo_2, Mukta } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { brand } from "@/content/brand";
import { seo } from "@/content/seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StickyContactBar } from "@/components/layout/StickyContactBar";
import { MotionRoot } from "@/components/motion/MotionRoot";

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
  metadataBase: new URL(SITE_URL),
  title: seo.home.title,
  description: seo.home.description,
  applicationName: brand.name,
  openGraph: { siteName: brand.name, locale: "en_IN", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${baloo.variable} ${mukta.variable}`}>
      <body className="flex min-h-dvh flex-col pb-[calc(var(--sticky-bar-h)+env(safe-area-inset-bottom))] md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <StickyContactBar />
        <MotionRoot />
      </body>
    </html>
  );
}
