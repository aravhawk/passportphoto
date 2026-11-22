import { renderIcon } from "./_og/icon-art";

// <link rel="apple-touch-icon">. Full-bleed and opaque: iOS applies its own
// rounded mask and shows transparency as black.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderIcon(size.width, "bleed");
}
