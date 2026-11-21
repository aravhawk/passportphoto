import { renderIcon } from "./_og/icon-art";

// <link rel="icon"> for browser tabs. src/app/favicon.ico covers legacy
// browsers and crawlers that request /favicon.ico directly.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return renderIcon(size.width, "tile");
}
