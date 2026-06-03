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

export default function PhotoEditor({ image, state, onChange, showGuides }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
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

  // Wheel-to-zoom, bound natively so we can preventDefault (passive: false).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      onChange({ ...stateRef.current, scale: clampScale(stateRef.current.scale * factor) });
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [onChange]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const size = containerRef.current?.clientWidth || 1;
    const dx = (e.clientX - drag.current.x) / size;
    const dy = (e.clientY - drag.current.y) / size;
    drag.current = { x: e.clientX, y: e.clientY };
    onChange({
      ...stateRef.current,
      offsetX: stateRef.current.offsetX + dx,
      offsetY: stateRef.current.offsetY + dy,
    });
  };

  const endDrag = (e: React.PointerEvent) => {
    drag.current = null;
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
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <GuideOverlay show={showGuides} />
    </div>
  );
}
