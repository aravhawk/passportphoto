import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Everything is crawlable. /_next/ is intentionally not blocked: crawlers need
// its scripts and styles to render the page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
