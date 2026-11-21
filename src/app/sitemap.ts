import type { MetadataRoute } from "next";
import { INDEXABLE_PATHS, absoluteUrl } from "@/lib/site";

// The app has no dynamic routes, so the sitemap is a static list. There is no
// `lastModified` on purpose: nothing tracks a real per-page change date, and a
// build timestamp would be a made-up one.
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PATHS.map((path) => ({ url: absoluteUrl(path) }));
}
