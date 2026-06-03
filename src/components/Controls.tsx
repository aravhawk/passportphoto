"use client";

import { SCALE_MIN, SCALE_MAX, type EditState } from "@/lib/transform";

export type BgStatus = "idle" | "processing" | "done" | "error";

interface Props {
  state: EditState;
  onChange: (next: EditState) => void;
  onReset: () => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  bgStatus: BgStatus;
  bgProgress: number;
  bgEnabled: boolean;
  onToggleBackground: () => void;
}

const RAD = Math.PI / 180;

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex justify-between font-mono text-[11px] uppercase tracking-wider">
        <span className="text-haze">{label}</span>
        <span className="tabular-nums text-cloud">{display}</span>
      </div>
      <input
        type="range"
        className="w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

function ToggleButton({
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
      className={`rounded-lg border py-2 font-mono text-xs font-bold uppercase tracking-wider transition ${
        active
          ? "border-stamp/60 bg-stamp/15 text-paper"
          : "border-white/15 bg-white/5 text-cloud hover:border-white/30 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

export default function Controls({
  state,
  onChange,
  onReset,
  showGuides,
  onToggleGuides,
  bgStatus,
  bgProgress,
  bgEnabled,
  onToggleBackground,
}: Props) {
  const set = (patch: Partial<EditState>) => onChange({ ...state, ...patch });

  return (
    <div className="space-y-5">
      <Slider
        label="Zoom"
        value={state.scale}
        min={SCALE_MIN}
        max={SCALE_MAX}
        step={0.01}
        display={`${Math.round(state.scale * 100)}%`}
        onChange={(v) => set({ scale: v })}
      />
      <Slider
        label="Rotation"
        value={Math.round(state.rotation / RAD)}
        min={-45}
        max={45}
        step={1}
        display={`${Math.round(state.rotation / RAD)}°`}
        onChange={(v) => set({ rotation: v * RAD })}
      />
      <Slider
        label="Brightness"
        value={state.brightness}
        min={0.5}
        max={1.5}
        step={0.01}
        display={`${Math.round(state.brightness * 100)}%`}
        onChange={(v) => set({ brightness: v })}
      />
      <Slider
        label="Contrast"
        value={state.contrast}
        min={0.5}
        max={1.5}
        step={0.01}
        display={`${Math.round(state.contrast * 100)}%`}
        onChange={(v) => set({ contrast: v })}
      />

      <div className="grid grid-cols-2 gap-2">
        <ToggleButton active={state.flipX} onClick={() => set({ flipX: !state.flipX })}>
          Flip
        </ToggleButton>
        <ToggleButton active={showGuides} onClick={onToggleGuides}>
          Guides
        </ToggleButton>
      </div>

      <button
        type="button"
        onClick={onToggleBackground}
        disabled={bgStatus === "processing"}
        className={`w-full rounded-lg border py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition disabled:cursor-not-allowed ${
          bgEnabled
            ? "border-gold/60 bg-gold/15 text-gold"
            : "border-white/15 bg-white/5 text-cloud hover:border-gold/40 hover:bg-white/10"
        }`}
      >
        {bgStatus === "processing"
          ? `Removing… ${Math.round(bgProgress * 100)}%`
          : bgEnabled
            ? "White background · on"
            : "Whiten background"}
      </button>
      {bgStatus === "error" && (
        <p className="font-mono text-[11px] text-stamp">
          Background removal failed. The original photo is unchanged.
        </p>
      )}
      {bgStatus === "idle" && !bgEnabled && (
        <p className="text-[11px] leading-relaxed text-haze/80">
          First use downloads a one-time model (~tens of MB), then runs locally.
        </p>
      )}

      <button
        type="button"
        onClick={onReset}
        className="w-full font-mono text-[11px] uppercase tracking-wider text-haze transition hover:text-cloud"
      >
        Reset adjustments
      </button>
    </div>
  );
}
