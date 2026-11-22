import { OG_CONTENT_TYPE, OG_SIZE, renderSocialImage } from "./_og/card";
import { SOCIAL_IMAGE_ALT } from "@/lib/site";

// Same 1200x630 card as opengraph-image, exposed as twitter:image so the
// summary_large_image card never depends on a fallback.
export const alt = SOCIAL_IMAGE_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderSocialImage();
}
