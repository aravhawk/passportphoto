import type { MetadataRoute } from "next";
import {
  BACKGROUND_COLOR,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
  SITE_SHORT_NAME,
  THEME_COLOR,
} from "@/lib/site";

// Icons come from src/app/pwa-icon/[variant]/route.tsx, drawn by the same code
// as the favicon, so every size stays in step.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    lang: SITE_LANG,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    categories: ["photo", "utilities"],
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/pwa-icon/maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
