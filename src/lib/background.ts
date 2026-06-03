// In-browser background removal via @imgly/background-removal (ML segmentation),
// then composited over solid white for passport compliance. The model (~tens of
// MB) is fetched on first use and cached by the browser thereafter.

export async function removeBackgroundToWhite(
  source: Blob | string,
  onProgress?: (fraction: number) => void,
): Promise<Blob> {
  // Imported lazily so the heavy package stays out of the initial bundle.
  const { removeBackground } = await import("@imgly/background-removal");

  const cutout = await removeBackground(source, {
    output: { format: "image/png" },
    progress: (_key: string, current: number, total: number) => {
      if (onProgress && total > 0) onProgress(current / total);
    },
  });

  const bitmap = await createImageBitmap(cutout);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a 2D canvas context.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Compositing failed."))),
      "image/png",
    );
  });
}
