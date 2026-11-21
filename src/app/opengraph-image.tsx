import { OG_CONTENT_TYPE, OG_SIZE, renderSocialImage } from "./_og/card";
import { SOCIAL_IMAGE_ALT } from "@/lib/site";

// Next.js turns these exports into og:image, og:image:alt, og:image:width,
// og:image:height and og:image:type.
export const alt = SOCIAL_IMAGE_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderSocialImage();
}
