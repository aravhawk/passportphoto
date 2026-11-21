// Single source of truth for the site's public identity. Used by the root
// metadata (src/app/layout.tsx) and the generated social images (src/app/_og).

// Production origin. Every canonical, og:url and absolute image URL resolves
// against this, including on Vercel preview deployments.
export const SITE_URL = "https://passportphoto-us.vercel.app";

export const SITE_NAME = "Passport Photo Studio";

export const SITE_TITLE = "Passport Photo Studio: US Passport Photo Maker";

export const SITE_DESCRIPTION =
  "Make a 2x2 inch US passport photo in your browser. Use the framing guides, whiten the background, and export a 300 DPI JPG or PNG. Nothing is uploaded.";

// Shared by opengraph-image and twitter-image so both cards carry the same
// text for screen readers and crawlers.
export const SOCIAL_IMAGE_ALT =
  "Passport Photo Studio. A passport photo frame with head and eye guides beside a red USA stamp, on a navy travel document background.";
