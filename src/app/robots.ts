import type { MetadataRoute } from "next";

const isProduction = process.env.VERCEL_ENV === "production";

/** Preview and dev deploys must never be indexed; only the production Vercel env is crawlable. */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return { rules: { userAgent: "*", allow: "/" } };
}
