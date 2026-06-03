"use client";

import { useState } from "react";
import SourcePicker from "@/components/SourcePicker";
import PhotoEditor from "@/components/PhotoEditor";
import Controls, { type BgStatus } from "@/components/Controls";
import ExportPanel from "@/components/ExportPanel";
import Stamp from "@/components/Stamp";

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-ink/50 p-5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      <h2 className="mb-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
        <span className="h-1 w-1 rounded-full bg-stamp" />
        {label}
      </h2>
      {children}
    </section>
  );
}
import { initialEditState, type EditState } from "@/lib/transform";
import { prepareSource, blobToImage } from "@/lib/image";
import { removeBackgroundToWhite } from "@/lib/background";

export default function Home() {
  const [stage, setStage] = useState<"source" | "edit">("source");
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalBlob, setOriginalBlob] = useState<Blob | null>(null);
  const [bgRemovedImage, setBgRemovedImage] = useState<HTMLImageElement | null>(null);
  const [bgEnabled, setBgEnabled] = useState(false);

  const [editState, setEditState] = useState<EditState>(initialEditState);
  const [showGuides, setShowGuides] = useState(true);
  const [bgStatus, setBgStatus] = useState<BgStatus>("idle");
  const [bgProgress, setBgProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const workingImage = bgEnabled && bgRemovedImage ? bgRemovedImage : originalImage;

  const handleSelect = async (blob: Blob) => {
    setLoadError(null);
    try {
      const { image, blob: prepared } = await prepareSource(blob);
      setOriginalImage(image);
      setOriginalBlob(prepared);
      setBgRemovedImage(null);
      setBgEnabled(false);
      setBgStatus("idle");
      setEditState(initialEditState);
      setStage("edit");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load that image.");
    }
  };

  const toggleBackground = async () => {
    if (bgEnabled) {
      setBgEnabled(false);
      return;
    }
    if (bgRemovedImage) {
      setBgEnabled(true);
      return;
    }
    if (!originalBlob) return;
    setBgStatus("processing");
    setBgProgress(0);
    try {
      const whiteBlob = await removeBackgroundToWhite(originalBlob, setBgProgress);
      const image = await blobToImage(whiteBlob);
      setBgRemovedImage(image);
      setBgEnabled(true);
      setBgStatus("done");
    } catch {
      setBgStatus("error");
    }
  };

  const startOver = () => {
    setStage("source");
    setOriginalImage(null);
    setOriginalBlob(null);
    setBgRemovedImage(null);
    setBgEnabled(false);
    setBgStatus("idle");
    setEditState(initialEditState);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:py-14">
      <header className="rise relative mb-10">
        <Stamp className="absolute -top-3 right-0 hidden h-24 w-24 -rotate-[7deg] sm:block lg:h-28 lg:w-28" />
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-gold">
          U.S. Travel Document
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-[0.95] tracking-tight text-cloud sm:text-5xl">
          Passport Photo
          <br />
          <span className="text-gold">Studio</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-haze">
          Make a compliant 2&times;2&nbsp;inch US passport photo right in your browser. Nothing is
          uploaded&mdash;every pixel stays on your device.
        </p>
      </header>

      {stage === "source" && (
        <div className="rise flex flex-1 flex-col items-center justify-center">
          <SourcePicker onSelect={handleSelect} />
          {loadError && <p className="mt-4 font-mono text-xs text-stamp">{loadError}</p>}
        </div>
      )}

      {stage === "edit" && workingImage && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rise space-y-4">
            <PhotoEditor
              image={workingImage}
              state={editState}
              onChange={setEditState}
              showGuides={showGuides}
            />
            <p className="text-center font-mono text-[11px] uppercase tracking-wider text-haze">
              Drag to reposition &middot; scroll to zoom &middot; align eyes to the band, head to the oval
            </p>
            <button
              type="button"
              onClick={startOver}
              className="mx-auto block font-mono text-xs uppercase tracking-wider text-haze transition hover:text-gold"
            >
              &larr; Choose a different photo
            </button>
          </div>

          <div className="rise space-y-5" style={{ animationDelay: "0.08s" }}>
            <Panel label="Adjust">
              <Controls
                state={editState}
                onChange={setEditState}
                onReset={() => setEditState(initialEditState)}
                showGuides={showGuides}
                onToggleGuides={() => setShowGuides((g) => !g)}
                bgStatus={bgStatus}
                bgProgress={bgProgress}
                bgEnabled={bgEnabled}
                onToggleBackground={toggleBackground}
              />
            </Panel>

            <Panel label="Export">
              <ExportPanel image={workingImage} state={editState} />
            </Panel>
          </div>
        </div>
      )}

      <footer className="mt-12 overflow-hidden border-t border-white/10 pt-4">
        <p className="truncate font-mono text-[11px] tracking-[0.25em] text-white/20">
          P&lt;USA&lt;PASSPORT&lt;&lt;PHOTO&lt;STUDIO&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </p>
      </footer>
    </main>
  );
}
