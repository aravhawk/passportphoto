// Renders the final passport photo at the chosen resolution and encodes it as a
// downloadable JPG/PNG with 300 DPI metadata embedded.

import { drawPhoto, type EditState, type Drawable } from "./transform";
import { stampDpi } from "./dpi";

export type ExportFormat = "jpeg" | "png";

export function renderToCanvas(
  img: CanvasImageSource & Drawable,
  state: EditState,
  size: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a 2D canvas context.");
  drawPhoto(ctx, img, state, size);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed."))),
      mime,
      quality,
    );
  });
}

export async function exportPhoto(
  img: CanvasImageSource & Drawable,
  state: EditState,
  size: number,
  format: ExportFormat,
  quality: number,
): Promise<Blob> {
  const mime = format === "png" ? "image/png" : "image/jpeg";
  const canvas = renderToCanvas(img, state, size);
  const raw = await canvasToBlob(canvas, mime, format === "jpeg" ? quality : undefined);
  const stamped = stampDpi(new Uint8Array(await raw.arrayBuffer()), mime);
  // Copy into a fresh ArrayBuffer-backed view so the Blob part is well-typed.
  return new Blob([new Uint8Array(stamped)], { type: mime });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
