import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GUIDES } from "@/lib/passport";

// Social card (Open Graph + Twitter), drawn to match the app: the navy
// travel-document ground with faint gold guilloche lines, Fraunces / Archivo /
// Space Mono, the editor's own guide geometry, and the customs-style stamp.
// The `_og` folder is private to the App Router, so nothing here is routable.

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

// Mirrors the @theme tokens in src/app/globals.css.
const C = {
  navy: "#0a1c38",
  navyDeep: "#06122a",
  ink: "#122a4a",
  stamp: "#b23a3a",
  gold: "#c9a86a",
  cloud: "#dbe5f3",
  haze: "#8aa0c2",
  glow: "#173258",
};

// next/og only reads ttf/otf/woff. These are static, Latin-subset cuts of the
// same families the site loads through next/font (see fonts/README.md). The
// glyph set deliberately has no em dash.
const fontDir = join(process.cwd(), "src/app/_og/fonts");
const [fraunces, archivo, archivoMedium, mono, monoBold] = await Promise.all([
  readFile(join(fontDir, "Fraunces-96pt-SemiBold.ttf")),
  readFile(join(fontDir, "Archivo-Regular.ttf")),
  readFile(join(fontDir, "Archivo-Medium.ttf")),
  readFile(join(fontDir, "SpaceMono-Regular.ttf")),
  readFile(join(fontDir, "SpaceMono-Bold.ttf")),
]);

const FRAME = 404; // px, the 2x2 in photo frame
const STAMP = 196; // px

// Five-point star for the stamp (24x24 box, centred at 12,12).
const star = Array.from({ length: 10 }, (_, i) => {
  const angle = (-90 + i * 36) * (Math.PI / 180);
  const r = i % 2 === 0 ? 11 : 4.4;
  return `${(12 + r * Math.cos(angle)).toFixed(2)},${(12 + r * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

const headCy = ((GUIDES.headCrown + GUIDES.headChin) / 2) * 100;
const headRy = ((GUIDES.headChin - GUIDES.headCrown) / 2) * 100;
const headRx = (GUIDES.headWidth / 2) * 100;

export function renderSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: C.navyDeep,
          // Same layers as `body` in globals.css: top glow + two guilloche hatches.
          backgroundImage: [
            `radial-gradient(125% 85% at 50% -15%, ${C.glow} 0%, ${C.navy} 46%, ${C.navyDeep} 100%)`,
            "repeating-linear-gradient(45deg, rgba(201,168,106,0.07) 0px, rgba(201,168,106,0.07) 1.5px, transparent 1.5px, transparent 12px)",
            "repeating-linear-gradient(-45deg, rgba(201,168,106,0.05) 0px, rgba(201,168,106,0.05) 1.5px, transparent 1.5px, transparent 14px)",
          ].join(", "),
        }}
      >
        {/* Title block */}
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 112,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Space Mono",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 7,
              color: C.gold,
            }}
          >
            U.S. TRAVEL DOCUMENT
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 26,
              fontFamily: "Fraunces",
              fontWeight: 600,
              fontSize: 96,
              lineHeight: 0.95,
              letterSpacing: -2.4,
              color: C.cloud,
            }}
          >
            <div style={{ display: "flex" }}>Passport Photo</div>
            <div style={{ display: "flex", color: C.gold }}>Studio</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 34,
              fontFamily: "Archivo",
              fontWeight: 400,
              fontSize: 32,
              lineHeight: 1.35,
              color: C.haze,
            }}
          >
            <div style={{ display: "flex" }}>Make a 2×2 inch US passport photo</div>
            <div style={{ display: "flex" }}>in your browser. Nothing is uploaded.</div>
          </div>
        </div>

        {/* Photo frame with the editor's guides */}
        <div
          style={{
            position: "absolute",
            right: 76,
            top: 72,
            width: FRAME,
            height: FRAME,
            display: "flex",
            overflow: "hidden",
            borderRadius: 24,
            backgroundColor: "#ffffff",
            boxShadow:
              "0 28px 60px -22px rgba(0,0,0,0.85), 0 0 0 2px rgba(255,255,255,0.16)",
          }}
        >
          <svg
            width={FRAME}
            height={FRAME}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Subject: flat head and shoulders on the white backdrop */}
            <path
              d="M 6 100 C 6 84 26 75 42 71 L 58 71 C 74 75 94 84 94 100 Z"
              fill="#c3cfe3"
            />
            <rect x={44.5} y={56} width={11} height={18} rx={3} fill="#b3c1d9" />
            <ellipse cx={50} cy={40} rx={16.5} ry={21} fill="#c3cfe3" />

            {/* Acceptable eye-line band */}
            <rect
              x={0}
              y={GUIDES.eyeBandTop * 100}
              width={100}
              height={(GUIDES.eyeBandBottom - GUIDES.eyeBandTop) * 100}
              fill={C.stamp}
              fillOpacity={0.16}
            />
            <line
              x1={0}
              y1={GUIDES.eyeLine * 100}
              x2={100}
              y2={GUIDES.eyeLine * 100}
              stroke={C.stamp}
              strokeWidth={0.5}
              strokeDasharray="2 1.5"
            />
            {/* Head placement oval (navy ink here: white would vanish on white) */}
            <ellipse
              cx={50}
              cy={headCy}
              rx={headRx}
              ry={headRy}
              fill="none"
              stroke={C.ink}
              strokeOpacity={0.7}
              strokeWidth={0.7}
              strokeDasharray="2 1.5"
            />
            {/* Centre line */}
            <line
              x1={50}
              y1={0}
              x2={50}
              y2={100}
              stroke={C.ink}
              strokeOpacity={0.35}
              strokeWidth={0.35}
              strokeDasharray="1 2"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 12,
              top: FRAME * GUIDES.eyeLine - 24,
              display: "flex",
              fontFamily: "Space Mono",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1.4,
              color: C.stamp,
            }}
          >
            EYES
          </div>
        </div>

        {/* Customs stamp pressed over the frame corner */}
        <div
          style={{
            position: "absolute",
            right: 76 + FRAME - STAMP * 0.78,
            top: 72 + FRAME - STAMP * 0.74,
            width: STAMP,
            height: STAMP,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-8deg)",
          }}
        >
          <svg
            width={STAMP}
            height={STAMP}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <circle
              cx={60}
              cy={60}
              r={54}
              fill="none"
              stroke={C.stamp}
              strokeWidth={1.6}
              strokeDasharray="1.5 4"
            />
            <circle cx={60} cy={60} r={47} fill="none" stroke={C.stamp} strokeWidth={2.6} />
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: C.stamp,
            }}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <polygon points={star} fill={C.stamp} />
            </svg>
            <div
              style={{
                display: "flex",
                marginTop: 4,
                fontFamily: "Fraunces",
                fontWeight: 600,
                fontSize: 46,
                lineHeight: 1,
              }}
            >
              USA
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 8,
                fontFamily: "Space Mono",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 2,
              }}
            >
              300 DPI
            </div>
          </div>
        </div>

        {/* Machine readable zone, as in the page footer */}
        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 44,
            display: "flex",
            overflow: "hidden",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 16,
            fontFamily: "Space Mono",
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: 6,
            whiteSpace: "nowrap",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          {"P<USA<PASSPORT<<PHOTO<STUDIO<<<<<<<<<<<<<<<<<<<<<<"}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Archivo", data: archivo, weight: 400, style: "normal" },
        { name: "Archivo", data: archivoMedium, weight: 500, style: "normal" },
        { name: "Space Mono", data: mono, weight: 400, style: "normal" },
        { name: "Space Mono", data: monoBold, weight: 700, style: "normal" },
      ],
    },
  );
}
