"use client";

import { useEffect, useRef } from "react";
import { drawPhoto, SCALE_MIN, SCALE_MAX, type EditState } from "@/lib/transform";
import GuideOverlay from "./GuideOverlay";

interface Props {
  image: HTMLImageElement;
  state: EditState;
  onChange: (next: EditState) => void;
  showGuides: boolean;
}

const clampScale = (s: number) => Math.min(SCALE_MAX, Math.max(SCALE_MIN, s));

// Returns state after multiplying scale by `factor`, keeping the content under
// `anchor` fixed. `anchor` is the zoom point as a fraction offset from the
// frame center (e.g. cursor or pinch midpoint). Offset is a screen-space
// translate in drawPhoto, so this holds regardless of rotation/flip.
function zoomAbout(state: EditState, factor: number, anchorX: number, anchorY: number): EditState {
  const newScale = clampScale(state.scale * factor);
  const f = newScale / state.scale;
  return {
    ...state,
    scale: newScale,
    offsetX: f * state.offsetX + (1 - f) * anchorX,
    offsetY: f * state.offsetY + (1 - f) * anchorY,
  };
}

export default function PhotoEditor({ image, state, onChange, showGuides }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Active pointers by id, plus the previous pinch distance/midpoint.
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinch = useRef<{ dist: number; midX: number; midY: number } | null>(null);
  // Mirror the latest state into a ref so the native wheel listener and pointer
  // handlers always read fresh values without being re-bound every render.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Render whenever the image or edit state changes, and on container resize.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const cssSize = container.clientWidth;
      const px = Math.max(1, Math.round(cssSize * dpr));
      if (canvas.width !== px) {
        canvas.width = px;
        canvas.height = px;
      }
      drawPhoto(ctx, image, state, px);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(container);
    return () => ro.disconnect();
  }, [image, state]);

  // Wheel-to-zoom (desktop), anchored at the cursor.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const size = rect.width || 1;
      const ax = (e.clientX - (rect.left + size / 2)) / size;
      const ay = (e.clientY - (rect.top + size / 2)) / size;
      onChange(zoomAbout(stateRef.current, Math.exp(-e.deltaY * 0.0015), ax, ay));
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [onChange]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pinch.current = null; // re-init on next move once two are present
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const pts = pointers.current;
    const prev = pts.get(e.pointerId);
    if (!prev) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const size = rect.width || 1;
    const cx = rect.left + size / 2;
    const cy = rect.top + size / 2;
    const cur = { x: e.clientX, y: e.clientY };
    pts.set(e.pointerId, cur);

    if (pts.size >= 2) {
      // Two-finger pinch: zoom by the change in finger distance (anchored at the
      // midpoint) and pan by the midpoint's movement.
      const [a, b] = [...pts.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      if (!pinch.current) {
        pinch.current = { dist, midX, midY };
        return;
      }
      const factor = dist / pinch.current.dist;
      const zoomed = zoomAbout(
        stateRef.current,
        factor,
        (midX - cx) / size,
        (midY - cy) / size,
      );
      onChange({
        ...zoomed,
        offsetX: zoomed.offsetX + (midX - pinch.current.midX) / size,
        offsetY: zoomed.offsetY + (midY - pinch.current.midY) / size,
      });
      pinch.current = { dist, midX, midY };
    } else {
      // Single-finger / mouse pan.
      onChange({
        ...stateRef.current,
        offsetX: stateRef.current.offsetX + (cur.x - prev.x) / size,
        offsetY: stateRef.current.offsetY + (cur.y - prev.y) / size,
      });
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full cursor-grab touch-none select-none overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/15 active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <GuideOverlay show={showGuides} />
    </div>
  );
}
