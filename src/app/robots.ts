import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const isProduction = process.env.VERCEL_ENV === "production";

/** Preview and dev deploys must never be indexed; only the production Vercel env is crawlable. */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return { rules: { userAgent: "*", allow: "/", disallow: "/styleguide" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
