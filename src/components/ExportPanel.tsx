"use client";

import { useEffect, useRef, useState } from "react";
import { drawPhoto, type EditState } from "@/lib/transform";
import { OUTPUT_SIZES, DEFAULT_OUTPUT_SIZE, type OutputSize } from "@/lib/passport";
import { exportPhoto, downloadBlob, type ExportFormat } from "@/lib/export";

interface Props {
  image: HTMLImageElement;
  state: EditState;
}

const PREVIEW_PX = 220;

function Segment({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-haze">{label}</div>
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-black/20 p-1">
        {children}
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition ${
        active ? "bg-paper text-navy shadow-sm" : "text-haze hover:text-cloud"
      }`}
    >
      {children}
    </button>
  );
}

export default function ExportPanel({ image, state }: Props) {
  const [format, setFormat] = useState<ExportFormat>("jpeg");
  const [size, setSize] = useState<OutputSize>(DEFAULT_OUTPUT_SIZE);
  const [quality, setQuality] = useState(0.92);
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);

  // Clean preview (no guides) of exactly what will be exported.
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const px = Math.round(PREVIEW_PX * dpr);
    canvas.width = px;
    canvas.height = px;
    drawPhoto(ctx, image, state, px);
  }, [image, state]);

  const handleDownload = async () => {
    setBusy(true);
    try {
      const blob = await exportPhoto(image, state, size, format, quality);
      const ext = format === "jpeg" ? "jpg" : "png";
      downloadBlob(blob, `passport-photo-${size}x${size}.${ext}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
          <canvas
            ref={previewRef}
            style={{ width: PREVIEW_PX, height: PREVIEW_PX }}
            className="rounded-lg ring-1 ring-white/15"
          />
        </div>
      </div>

      <Segment label="Format">
        {(["jpeg", "png"] as ExportFormat[]).map((f) => (
          <Pill key={f} active={format === f} onClick={() => setFormat(f)}>
            {f === "jpeg" ? "JPG" : "PNG"}
          </Pill>
        ))}
      </Segment>

      <Segment label="Resolution · 300 DPI">
        {OUTPUT_SIZES.map((s) => (
          <Pill key={s} active={size === s} onClick={() => setSize(s)}>
            {s}×{s}
          </Pill>
        ))}
      </Segment>

      {format === "jpeg" && (
        <label className="block">
          <div className="mb-1.5 flex justify-between font-mono text-[11px] uppercase tracking-wider">
            <span className="text-haze">JPG quality</span>
            <span className="tabular-nums text-cloud">{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range"
            className="w-full"
            min={0.5}
            max={1}
            step={0.01}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
          />
        </label>
      )}

      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="w-full rounded-xl bg-stamp py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper shadow-[0_14px_30px_-12px_rgba(178,58,58,0.7)] transition hover:bg-stamp-deep disabled:opacity-60"
      >
        {busy ? "Preparing…" : `Download ${format === "jpeg" ? "JPG" : "PNG"}`}
      </button>
    </div>
  );
}
