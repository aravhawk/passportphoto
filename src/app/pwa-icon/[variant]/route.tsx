import { renderIcon, type IconVariant } from "../../_og/icon-art";

// Icons referenced only by the web app manifest (src/app/manifest.ts), kept
// out of <head> so the tab icon choice stays unambiguous. Every variant is
// listed in generateStaticParams, so each one is rendered once at build time.
const VARIANTS: Record<string, { px: number; art: IconVariant }> = {
  "192": { px: 192, art: "tile" },
  "512": { px: 512, art: "tile" },
  maskable: { px: 512, art: "bleed" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant } = await params;
  const spec = VARIANTS[variant];
  if (!spec) return new Response("Not found", { status: 404 });
  return renderIcon(spec.px, spec.art);
}
