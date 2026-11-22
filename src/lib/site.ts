import type { Metadata } from "next";

// Single source of truth for the site's public identity. Used by the root
// layout, per-page metadata, robots, sitemap, manifest, JSON-LD and the
// generated social images and icons.

// Production origin. Every canonical, og:url, sitemap entry and absolute image
// URL resolves against this, including on Vercel preview deployments.
export const SITE_URL = "https://passportphoto-us.vercel.app";

export const SITE_NAME = "Passport Photo Studio";
export const SITE_SHORT_NAME = "Passport Photo";

export const SITE_TITLE = "Passport Photo Studio: US Passport Photo Maker";

export const SITE_DESCRIPTION =
  "Make a 2x2 inch US passport photo in your browser. Use the framing guides, whiten the background, and export a 300 DPI JPG or PNG. Nothing is uploaded.";

// The site is English only, so there is deliberately no hreflang. `lang` on
// <html>, og:locale, the manifest and JSON-LD all describe the same locale.
export const SITE_LANG = "en-US";
export const SITE_OG_LOCALE = "en_US";

// Mirrors the navy tokens in src/app/globals.css.
export const THEME_COLOR = "#0a1c38";
export const BACKGROUND_COLOR = "#06122a";

// Shared by opengraph-image and twitter-image so both cards carry the same
// text for screen readers and crawlers.
export const SOCIAL_IMAGE_ALT =
  "Passport Photo Studio. A passport photo frame with head and eye guides beside a red USA stamp, on a navy travel document background.";

// Every route that should appear in the sitemap. The app has one page, so
// there is nothing dynamic to enumerate. Add new public routes here.
export const INDEXABLE_PATHS = ["/"] as const;

// Absolute production URL for a path. The root has no trailing slash so it
// matches the canonical tag Next.js emits for "/".
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

// Index and follow on every deployment of this code. Vercel already sends
// `X-Robots-Tag: noindex` on preview deployments, and that header wins, so
// previews stay out of search without a different tag in production.
const ROBOTS_INDEX: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

// Per-page metadata: canonical, robots, Open Graph and Twitter in one call, so a page
// cannot ship one without the others. Next.js merges `openGraph` and `twitter`
// shallowly, so every page must provide the whole object, which is why this
// lives in one place. Omit `title` on the home page to use the layout default.
// Other pages pass a short title; the layout template appends the site name.
export function pageMetadata({
  path,
  title,
  description = SITE_DESCRIPTION,
}: {
  path: string;
  title?: string;
  description?: string;
}): Metadata {
  const shareTitle = title ? `${title} | ${SITE_NAME}` : SITE_TITLE;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    robots: ROBOTS_INDEX,
    openGraph: {
      type: "website",
      url: path,
      siteName: SITE_NAME,
      locale: SITE_OG_LOCALE,
      title: shareTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
    },
  };
}
