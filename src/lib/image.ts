// Helpers for turning files / blobs into decoded <img> elements, with a cap on
// dimensions so the editor stays responsive on very large photos.

export const MAX_SOURCE_SIDE = 2000;

export function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode this image. Try a JPG, PNG, or WebP file."));
    };
    img.src = url;
  });
}

// Decodes a blob and, if it exceeds MAX_SOURCE_SIDE, returns a downscaled copy.
// Returns both the image (for the editor) and a blob (for background removal).
export async function prepareSource(
  blob: Blob,
): Promise<{ image: HTMLImageElement; blob: Blob }> {
  const image = await blobToImage(blob);
  const longest = Math.max(image.width, image.height);
  if (longest <= MAX_SOURCE_SIDE) return { image, blob };

  const ratio = MAX_SOURCE_SIDE / longest;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * ratio);
  canvas.height = Math.round(image.height * ratio);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { image, blob };
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const scaledBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Downscaling failed."))),
      "image/png",
    );
  });
  return { image: await blobToImage(scaledBlob), blob: scaledBlob };
}
