# Social card fonts

`next/og` (Satori) cannot read the woff2 files that `next/font` serves, and it
renders variable fonts at their default instance. These are static, Latin
subsets of the same families the site uses, read by `../card.tsx`.

| File | Family | Instance | Used for |
| --- | --- | --- | --- |
| `Fraunces-96pt-SemiBold.ttf` | Fraunces | opsz 96, wght 600 | title, stamp |
| `Archivo-Regular.ttf` | Archivo | wght 400 | subline |
| `Archivo-Medium.ttf` | Archivo | wght 500 | spare |
| `SpaceMono-Regular.ttf` | Space Mono | 400 | machine readable line |
| `SpaceMono-Bold.ttf` | Space Mono | 700 | eyebrow, labels |

All three families are licensed under the SIL Open Font License 1.1; the
license texts are in `licenses/`.

## Glyph set

Basic Latin (U+0020 to U+007E), no-break space, `·` (U+00B7) and `×` (U+00D7).
Anything else renders as a missing glyph, so if the card copy needs another
character, regenerate the subset with it included. The set intentionally omits
the em dash.

## Regenerating

Static instances come from the Google Fonts CSS API (request a single axis
value and a non-woff2 user agent to get a `.ttf`), then are subset with
fonttools:

```sh
curl -A "curl/8" "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@96,600"
# download the .ttf named in the CSS, then:
python3 -m fontTools.subset input.ttf \
  --unicodes="U+0020-007E,U+00A0,U+00B7,U+00D7" \
  --layout-features='kern,liga,calt,ccmp,locl,mark,mkmk' \
  --no-hinting --desubroutinize --output-file=Fraunces-96pt-SemiBold.ttf
```
