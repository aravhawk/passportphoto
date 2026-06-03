// Shared drawing logic so the on-screen editor preview and the exported file are
// pixel-identical. All positional state is resolution-independent (offsets are
// fractions of the frame, scale is relative to a "cover" fit), so the same state
// renders correctly at any output size.

export interface EditState {
  scale: number; // 1 = image covers the square frame
  offsetX: number; // pan, as a fraction of frame width (+right)
  offsetY: number; // pan, as a fraction of frame height (+down)
  rotation: number; // radians
  flipX: boolean;
  brightness: number; // 1 = unchanged
  contrast: number; // 1 = unchanged
}

export const initialEditState: EditState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  flipX: false,
  brightness: 1,
  contrast: 1,
};

export const SCALE_MIN = 0.5;
export const SCALE_MAX = 4;

export interface Drawable {
  width: number;
  height: number;
}

// Scale needed for the source image's shorter side to fill the square frame.
export function coverScale(img: Drawable, size: number): number {
  return size / Math.min(img.width, img.height);
}

// Renders the image into a `size` x `size` context over a white background.
export function drawPhoto(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource & Drawable,
  state: EditState,
  size: number,
) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  const s = coverScale(img, size) * state.scale;
  ctx.translate(size / 2 + state.offsetX * size, size / 2 + state.offsetY * size);
  ctx.rotate(state.rotation);
  ctx.scale(state.flipX ? -s : s, s);
  ctx.filter = `brightness(${state.brightness}) contrast(${state.contrast})`;
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();
}
