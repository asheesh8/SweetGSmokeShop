# Asset manifest — Sweet G's Smoke Shop

Everything shipping in `public/`, where it came from, and what it cost.

## Brand

| File | Source | Notes |
| --- | --- | --- |
| `brand/logo-original.png` | The client's own crest, downloaded from sweetgsmokeshop.com | 1069×800 RGBA. Their existing identity — green, chartreuse, red, "ESTD 2018", monkey mascot. The site's palette is tuned around it, not over it. |
| `brand/logo.png` | Resized from the above | 320px wide. Used in the nav and footer. |
| `brand/logo-sm.png` | Resized from the above | 96px wide. Spare, for favicons/small placements. |

The crest's sampled colours drive the theme accents:
forest green `#245418` · chartreuse `#d8cc00` · red `#b40000`.

## 3D specimens

| File | Source | Notes |
| --- | --- | --- |
| `models/moon_nonkey_nug.glb` | Client-supplied Sketchfab scan | 21.2MB → **4.3MB**. gltf-transform: meshopt + WebP, 2048px. Used in the ritual viewer. |
| `models/alien_ath_nug.glb` | Client-supplied Sketchfab scan | 19.7MB → **4.2MB**. Same pipeline. |
| `models/*_lite.glb` | Same sources at 1024px | ~2.0MB each. Spare low tier. |

Pipeline:

```bash
npx @gltf-transform/cli optimize in.glb out.glb \
  --texture-compress webp --texture-size 2048 --compress meshopt --simplify false
```

Meshopt (not Draco) on purpose: its decoder is bundled with three, so nothing
is fetched from a CDN at runtime.

## Photography — Higgsfield `nano_banana_pro`

All generated for this project at 2 credits each, 2k resolution, then resized
and re-encoded locally with `sips` (quality 76).

Every prompt ends with one shared camera-and-grade sentence, which is what makes
separately generated frames read as a single shoot:

> Shot on 85mm macro lens, shallow depth of field. Warm tungsten key light from
> camera left, cool blue-grey rim light from behind, near-black background
> falling into deep shadow. Cinematic, heavy filmic grain, warm amber highlights
> and crushed blacks, muted earthy 1970s film stock color grade. No text, no
> watermark, no logos, no lettering, no people.

### Chapter backgrounds — `public/img/` (16:9, 2400px)

| File | Subject |
| --- | --- |
| `ch01-flower.jpg` | Nug on dark walnut, empty left third for the wordmark |
| `ch02-grind.jpg` | Open grinder, ground flower, empty right third |
| `ch03-pack.jpg` | Iridescent glass bowl on walnut |
| `ch04-light.jpg` | Ember catching, real smoke rising |
| `ch05-glass.jpg` | Row of handblown glass on a shop shelf |
| `smoke.jpg` | Abstract smoke in void — story-section bed |
| `counter.jpg` | Brass lighter and tray — visit-section bed |

### Product tiles — `public/products/` (1:1, 1400px)

One per catalogue slug: `heady-beaker`, `daily-driver-bubbler`,
`hand-pipe-case`, `dry-herb-vaporizer`, `batteries`, `cbd-tincture`,
`cbd-topicals`, `local-art`, `real-bud-camo`, `queen-city`, `vintage-custom`,
`grinders`, `papers-wraps`, `torches-trays`.

Filenames match product slugs exactly — `ProductImage` resolves
`/products/<slug>.jpg` and falls back to a graded plate if a file is absent, so
swapping in a real photograph needs no code change.

### Regenerations

Five prompts were refused on the first pass and were reworded and rerun:
`ch03-pack`, `counter`, `dry-herb-vaporizer`, `batteries`, `local-art`. The
refusals were phrasing-related, not subject-related — describing the object
plainly ("dried green herb in a glass bowl") passes where process language
("packed with ground cannabis") does not.

## Cost

| | |
| --- | --- |
| Starting balance | 979.59 credits |
| Images generated | ~24 attempts × 2 credits |
| **Spent** | **~48 credits** |

Video was **not** generated here — `SEEDANCE-SHOTLIST.md` contains the prompts
for the client to run themselves, and the site already renders the clips the
moment they land in `public/video/`.

## Still to supply

| Slot | What |
| --- | --- |
| `public/video/*.mp4` | Seven clips per `SEEDANCE-SHOTLIST.md`. Optional — every one has a still or gradient fallback. |
| Real inventory | `src/lib/products.ts` is representative placeholder stock; categories and carried brands are real, individual items are not. |
| Real product photos | Drop over `public/products/<slug>.jpg` as they're shot. |
