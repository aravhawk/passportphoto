// Decorative customs-style ink stamp used in the header.
export default function Stamp({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <path id="stamp-top" d="M 18 60 A 42 42 0 0 1 102 60" fill="none" />
        <path id="stamp-bottom" d="M 102 60 A 42 42 0 0 1 18 60" fill="none" />
      </defs>
      <g
        fill="none"
        stroke="var(--color-stamp)"
        style={{ color: "var(--color-stamp)" }}
        opacity={0.92}
      >
        <circle cx="60" cy="60" r="54" strokeWidth="1.5" strokeDasharray="1.5 4" />
        <circle cx="60" cy="60" r="47" strokeWidth="2.5" />
      </g>
      <g
        fill="var(--color-stamp)"
        fontFamily="var(--font-mono), monospace"
        fontSize="8.5"
        fontWeight={700}
        letterSpacing="1.4"
        opacity={0.92}
      >
        <text>
          <textPath href="#stamp-top" startOffset="50%" textAnchor="middle">
            UNITED · STATES
          </textPath>
        </text>
        <text dy="-2">
          <textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">
            300 DPI · 2×2 IN
          </textPath>
        </text>
      </g>
      <text
        x="60"
        y="46"
        textAnchor="middle"
        fill="var(--color-stamp)"
        fontSize="16"
        opacity={0.92}
      >
        ★
      </text>
      <text
        x="60"
        y="74"
        textAnchor="middle"
        fill="var(--color-stamp)"
        fontFamily="var(--font-display), serif"
        fontSize="22"
        fontWeight={600}
        opacity={0.95}
      >
        USA
      </text>
    </svg>
  );
}
