import { ImageResponse } from "next/og";
import { GUIDES } from "@/lib/passport";

// The site's mark: a navy tile holding a white 2x2 photo frame with a
// head-and-shoulders and the eye-line band from the editor's guides. One
// drawing feeds every icon (favicon, icon, apple-icon, manifest icons), so
// they cannot drift apart.
//
//   tile   rounded corners, frame fills most of the tile. Tab icons and the
//          manifest "any" icons.
//   bleed  full-bleed square with the frame pulled into the centre. Apple
//          touch icons (iOS rounds the corners itself) and the maskable icon
//          (Android crops to a circle, so content must sit in the middle 80%).

export type IconVariant = "tile" | "bleed";

// Mirrors the @theme tokens in src/app/globals.css.
const NAVY = "#0a1c38";
const HAZE = "#8aa0c2";
const STAMP = "#b23a3a";

// Frame geometry in a 100 x 100 viewBox.
const FRAME = { x: 18, y: 18, size: 64 };
const eyeTop = FRAME.y + GUIDES.eyeBandTop * FRAME.size;
const eyeHeight = (GUIDES.eyeBandBottom - GUIDES.eyeBandTop) * FRAME.size;
const eyeLine = FRAME.y + GUIDES.eyeLine * FRAME.size;

export function renderIcon(px: number, variant: IconVariant) {
  // Pull the whole drawing toward the centre for the full-bleed variant.
  const scale = variant === "bleed" ? 0.84 : 1;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <svg
          width={px}
          height={px}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width={100}
            height={100}
            rx={variant === "tile" ? 22 : 0}
            fill={NAVY}
          />
          <g transform={`translate(50 50) scale(${scale}) translate(-50 -50)`}>
            <rect
              x={FRAME.x}
              y={FRAME.y}
              width={FRAME.size}
              height={FRAME.size}
              rx={5}
              fill="#ffffff"
            />
            {/* Shoulders and head */}
            <path
              d="M 26 82 C 26 71 37 65 44 63 L 56 63 C 63 65 74 71 74 82 Z"
              fill={HAZE}
            />
            <ellipse cx={50} cy={44} rx={11.5} ry={15} fill={HAZE} />
            {/* Eye-line band, as in the editor */}
            <rect
              x={FRAME.x}
              y={eyeTop}
              width={FRAME.size}
              height={eyeHeight}
              fill={STAMP}
              fillOpacity={0.28}
            />
            <rect
              x={FRAME.x}
              y={eyeLine - 0.9}
              width={FRAME.size}
              height={1.8}
              fill={STAMP}
            />
          </g>
        </svg>
      </div>
    ),
    { width: px, height: px },
  );
}
