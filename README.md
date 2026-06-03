# Passport Photo Studio

A local-use web app for creating compliant **US passport photos (2×2 in)**. Capture from your webcam or upload a photo, frame it against the official guides, whiten the background, and export a print-ready **JPG or PNG** at 300 DPI. Everything runs in the browser — no photo ever leaves your machine.

## Features

- **Camera or upload** — live webcam viewer with a face-positioning overlay, or drag-and-drop / file picker.
- **Framing tools** — drag to reposition, scroll/slider to zoom, plus rotation, horizontal flip, brightness, and contrast.
- **Compliance guides** — eye-line band and head oval matching the State Department's size rules (head 50–69% of frame, eyes 1⅛–1⅜″ from the bottom).
- **Auto white background** — in-browser ML segmentation ([@imgly/background-removal](https://github.com/imgly/background-removal-js)) cuts out the subject and composites onto solid white.
- **Print-ready export** — 600×600 or 1200×1200 px, JPG (with quality slider) or PNG, with **300 DPI** metadata embedded so prints come out true 2×2″.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

> The first time you use **Whiten background**, the browser downloads a one-time segmentation model (~tens of MB) from a CDN, then caches it for offline use. All other features work fully offline.

## How to make a photo

1. **Choose a source** — Upload a photo or Capture from the camera.
2. **Frame it** — drag to center the face; align the eyes to the shaded band and the head to the dashed oval. Use the zoom/rotation sliders for fine adjustments.
3. **(Optional) Whiten background** — toggle it on; the subject is cut out onto white.
4. **Export** — pick JPG/PNG and resolution, then Download.

## Notes & limitations

- Accepts JPG, PNG, and WebP. iPhone HEIC files often can't be decoded by browsers — convert to JPG first.
- The guides help you position the photo; the app does not automatically score compliance or detect faces.
- Always review your photo against the latest official requirements: https://travel.state.gov/content/travel/en/passports/how-apply/photos.html

## Tech

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4. Fully client-side; image processing uses the Canvas API.
