import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** robots.txt — allow everything except the post-submission page, and point to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/contact/thank-you"] }],
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: SITE_URL,
  };
}
