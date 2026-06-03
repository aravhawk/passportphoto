<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Passport Photo Studio

Local-use web app to make compliant US passport photos (2×2 in). Fully client-side; no backend, no uploads.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · pnpm. Dep: `@imgly/background-removal` (lazy-imported, fetches model on first use).

## Architecture
Single page (`src/app/page.tsx`) holds a `source → edit` state machine.

- `src/lib/passport.ts` — spec constants + guide geometry (fractions of frame height). Eyes 31.25–43.75% from top; head oval crown 12.5% / chin 75%.
- `src/lib/transform.ts` — `drawPhoto(ctx,img,state,size)`: single source of truth for rendering, shared by preview AND export so they're pixel-identical. State is resolution-independent (offsets are fractions of frame; `scale` is relative to a "cover" fit).
- `src/lib/image.ts` — `prepareSource` (decode + downscale >2000px), `blobToImage`.
- `src/lib/background.ts` — `removeBackgroundToWhite`: segment → composite over white.
- `src/lib/dpi.ts` — `stampDpi`: injects 300 DPI into encoded bytes (PNG pHYs / JPEG JFIF density). Verified with `sips`.
- `src/lib/export.ts` — render → encode → stampDpi → download.
- `src/components/` — SourcePicker (upload/camera tabs), CameraView (getUserMedia; mirrored preview, un-mirrored capture), PhotoEditor (canvas + drag/wheel), GuideOverlay (SVG), Controls (sliders), ExportPanel.

## Conventions
- `@/*` → `src/*`. Browser-work components need `"use client"`.
- Any new rendering MUST go through `drawPhoto` to keep preview and export identical.
- `next.config.ts` pins `turbopack.root` (a stray lockfile sits in the parent iCloud folder).

## Verify
`pnpm build` typechecks the whole pipeline. DPI logic checked by stamping a file and reading `sips -g dpiWidth`. Live canvas/camera/bg-removal need a real browser (manual).
