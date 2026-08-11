# Sweet G's Smoke Shop

Immersive storefront for **Sweet G Smoke Shop LLC** — 150 Dorset St, South
Burlington VT. Next.js 15 · React 19 · Tailwind v4 · shadcn/ui · React Three Fiber.

```bash
npm install
npm run dev
```

---

## What this is

A chapter film over real macro photography, with the shop's full inventory
searchable on the same page.

**Home** — five chapters (`The Flower → The Grind → The Pack → The Light → The
Shop`) crossfading over full-bleed photography, with the chapter readout in the
nav. Native scroll throughout: no pinning, no hijacking, no smoothing library.
Below it, the complete store, then the ritual demo, the story, and the visit
block.

**Two themes, two personalities.** The toggle swaps more than brightness — the
corner radius, the display typeface, the letter casing and the ornament all
change with it.

| | Nocturne (default) | Hippie |
| --- | --- | --- |
| Ground | near-black `#0b0a09` | cream `#f6ecd9` |
| Corners | square | fat and rounded |
| Display | **Anton**, uppercase | **Shrikhand**, mixed case |
| Accent | chartreuse `#d8cc00` | forest green `#245418` |

Both accents come from the shop's real crest, which ships in the nav and footer.

---

## Commerce: the hold list, not a cart

There is **no online checkout, deliberately.** Stripe and PayPal both prohibit
tobacco and smoking accessories, so a real cart here would be a compliance
problem rather than a feature.

Instead the site has a **hold list** — it behaves like a cart (persisted, badge
count, slide-out) but submits one enquiry so the shop can set items aside for
pickup. Money changes hands in the store.

To make the form deliver, set these and redeploy:

```
RESEND_API_KEY=…
RESEND_FROM=holds@sweetgsmokeshop.com   # domain verified in Resend
SHOP_INBOX=…                            # where hold requests land
```

Without them `/api/reserve` returns an honest `503` and the UI tells the
customer to call. It never fakes a successful send.

---

## Before this goes live

1. **Swap the placeholder inventory.** `src/lib/products.ts` — the categories
   and carried brands are real (from their BBB listing); the individual items
   are representative stand-ins. Nothing carries a price, which is both honest
   for unconfirmed stock and right for a hold-based flow.
2. **Wire the email env vars** above.
3. **Optional: add the video.** `SEEDANCE-SHOTLIST.md` has prompts, settings,
   filenames and ffmpeg encode commands. Drop clips into `public/video/` and
   they light up automatically — until then every slot falls back to a still or
   a graded gradient.
4. **Replace product photos as they're shot** — `public/products/<slug>.jpg`.

---

## Layout

```
src/
  app/                 routes · api/reserve · sitemap · robots
  components/
    film/              chapter film + chapter context
    shop/              Store (search + facets), QuickView, tiles
    hold/              hold-list provider + slide-out
    ritual/            4-step demo, R3F nug viewer
    ui/                shadcn primitives
  lib/
    shop.ts            NAP, hours, open/closed — single source of truth
    products.ts        catalogue (placeholder stock)
public/
  brand/ img/ products/ models/ video/
```

`src/lib/shop.ts` is the only place the address, phone and hours are written.
NAP consistency is the biggest lever in local SEO — change it there and nowhere
else. It feeds the nav, footer, visit page and the `TobaccoShop` JSON-LD.

---

## Notes worth keeping

- **Accessibility** — 21+ gate, skip link, `prefers-reduced-motion` respected
  (grain, parallax and the ritual autoplay all stand down), semantic tokens
  keep contrast in both themes.
- **Performance** — the R3F viewer is `next/dynamic` with `ssr: false` so three
  never touches the initial bundle; nug scans are meshopt + WebP (21MB → 4.3MB);
  chapter frames crossfade on opacity with transforms written straight from a
  rAF, not React state.
- **No CDN dependencies at runtime** — lighting is inline `Lightformer`s rather
  than a fetched HDR, and meshopt's decoder ships with three.

## Docs

| File | |
| --- | --- |
| `palette.md` | The full design system, both themes |
| `claude-design-brief.md` | Formatted for Claude Design's intake |
| `manifest.md` | Every asset, its origin, and credits spent |
| `SEEDANCE-SHOTLIST.md` | Video prompts to run on Higgsfield |
