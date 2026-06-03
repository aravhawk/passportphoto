"use client";

import { useEffect, useRef, useState } from "react";
import { GUIDES } from "@/lib/passport";

type Facing = "user" | "environment";

// Live camera preview for positioning, with a square crop frame and a face oval.
// The front ("user") camera is mirrored for a natural selfie feel; the rear
// camera is shown un-mirrored so someone else can frame the shot. Either way the
// captured still is un-mirrored (the stream's pixel data is never flipped).
export default function CameraView({ onCapture }: { onCapture: (blob: Blob) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<Facing>("user");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      setReady(false);
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch {
        setError(
          "Camera unavailable. Grant permission, or switch to the Upload tab to pick a photo.",
        );
      }
    }

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facing]);

  const mirrored = facing === "user";

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    // Crop the centered square so the capture matches the square preview.
    const side = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - side) / 2;
    const sy = (video.videoHeight - side) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = side;
    canvas.height = side;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, sx, sy, side, side, 0, 0, side, side);
    canvas.toBlob((blob) => blob && onCapture(blob), "image/png");
  };

  const headCy = ((GUIDES.headCrown + GUIDES.headChin) / 2) * 100;
  const headRy = ((GUIDES.headChin - GUIDES.headCrown) / 2) * 100;
  const headRx = (GUIDES.headWidth / 2) * 100;

  if (error) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-sm text-haze">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-navy-deep ring-1 ring-white/15">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-cover ${mirrored ? "-scale-x-100" : ""}`}
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <ellipse
            cx={50}
            cy={headCy}
            rx={headRx}
            ry={headRy}
            fill="none"
            stroke="#ffffff"
            strokeWidth={0.6}
            strokeDasharray="2 1.5"
            opacity={0.85}
          />
          <line
            x1={0}
            y1={GUIDES.eyeLine * 100}
            x2={100}
            y2={GUIDES.eyeLine * 100}
            stroke="var(--color-stamp)"
            strokeWidth={0.5}
            strokeDasharray="2 1.5"
          />
        </svg>
        <button
          type="button"
          onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cloud backdrop-blur transition hover:bg-black/70"
          title="Switch camera"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 10l3-3m0 0l-3-3m3 3H8a4 4 0 00-4 4m4 7l-3 3m0 0l3 3m-3-3h11a4 4 0 004-4" />
          </svg>
          {mirrored ? "Front" : "Back"}
        </button>
      </div>
      <button
        type="button"
        onClick={capture}
        disabled={!ready}
        className="w-full rounded-xl bg-stamp py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper shadow-[0_14px_30px_-12px_rgba(178,58,58,0.7)] transition hover:bg-stamp-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        Capture photo
      </button>
    </div>
  );
}
