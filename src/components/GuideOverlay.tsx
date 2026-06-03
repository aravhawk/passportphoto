import { GUIDES } from "@/lib/passport";

// Compliance guides drawn over the editor: a head-placement oval, the acceptable
// eye-line band, and a center line. Uses a 0-100 viewBox so values map straight
// to the fractions in GUIDES. Non-interactive so it never blocks dragging.
export default function GuideOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  const headCy = ((GUIDES.headCrown + GUIDES.headChin) / 2) * 100;
  const headRy = ((GUIDES.headChin - GUIDES.headCrown) / 2) * 100;
  const headRx = (GUIDES.headWidth / 2) * 100;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* Acceptable eye-line band */}
      <rect
        x={0}
        y={GUIDES.eyeBandTop * 100}
        width={100}
        height={(GUIDES.eyeBandBottom - GUIDES.eyeBandTop) * 100}
        fill="var(--color-stamp)"
        opacity={0.14}
      />
      <line
        x1={0}
        y1={GUIDES.eyeLine * 100}
        x2={100}
        y2={GUIDES.eyeLine * 100}
        stroke="var(--color-stamp)"
        strokeWidth={0.45}
        strokeDasharray="2 1.5"
      />
      {/* Head placement oval */}
      <ellipse
        cx={50}
        cy={headCy}
        rx={headRx}
        ry={headRy}
        fill="none"
        stroke="#ffffff"
        strokeWidth={0.6}
        strokeDasharray="2 1.5"
        opacity={0.9}
      />
      {/* Center line */}
      <line
        x1={50}
        y1={0}
        x2={50}
        y2={100}
        stroke="#ffffff"
        strokeWidth={0.3}
        strokeDasharray="1 2"
        opacity={0.6}
      />
      <text
        x={1.5}
        y={GUIDES.eyeLine * 100 - 1}
        fontSize={3}
        fill="var(--color-stamp)"
        fontWeight="700"
        style={{ fontFamily: "var(--font-mono), monospace" }}
        letterSpacing="0.3"
      >
        EYES
      </text>
    </svg>
  );
}
