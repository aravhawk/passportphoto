"use client";

import { useRef, useState } from "react";
import CameraView from "./CameraView";

type Tab = "camera" | "upload";

export default function SourcePicker({ onSelect }: { onSelect: (blob: Blob) => void }) {
  const [tab, setTab] = useState<Tab>("upload");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) onSelect(file);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
        {(["upload", "camera"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg py-2 font-mono text-xs font-bold uppercase tracking-wider transition ${
              tab === t ? "bg-paper text-navy shadow-sm" : "text-haze hover:text-cloud"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "camera" ? (
        <CameraView onCapture={onSelect} />
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
            dragging
              ? "border-gold bg-gold/10"
              : "border-white/20 bg-white/[0.03] hover:border-gold/50 hover:bg-white/[0.06]"
          }`}
        >
          <svg
            className="mb-3 h-10 w-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-sm font-medium text-cloud">Drop a photo here or click to browse</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-haze">
            JPG · PNG · WebP
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
}
