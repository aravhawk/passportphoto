# Generated images

Everything here is drawn in code with `next/og` and prerendered at build time.
`_og` is a private App Router folder, so nothing in it is routable.

| File | Produces |
| --- | --- |
| `card.tsx` | the 1200x630 social card, used by `opengraph-image.tsx` and `twitter-image.tsx` |
| `icon-art.tsx` | the site mark, used by `icon.tsx`, `apple-icon.tsx` and the manifest icons (`pwa-icon/[variant]/route.tsx`) |
| `fonts/` | vendored fonts for the card, see `fonts/README.md` |

## favicon.ico

`src/app/favicon.ico` is a binary derived from the same drawing (16, 32 and
48 px). Next.js cannot generate `.ico` files, so regenerate it after changing
`icon-art.tsx`. Serve a production build (`pnpm build && pnpm start`; `next dev`
also rewrites `AGENTS.md`), then:

```sh
curl -s http://localhost:3000/pwa-icon/512 -o /tmp/icon-512.png
python3 - <<'EOF'
from PIL import Image
Image.open("/tmp/icon-512.png").convert("RGBA").save(
    "src/app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)]
)
EOF
```
