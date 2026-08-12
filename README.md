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

## `/admin` — running the shop

Inventory lives in Supabase and is edited at **`/admin`**. Until Supabase is
attached, the storefront runs on its built-in catalogue and `/admin` shows the
three setup steps instead of a login — nothing breaks, it just isn't editable.

**Setup**

1. Supabase → **SQL Editor → New query** → paste all of
   [`supabase/schema.sql`](supabase/schema.sql) and run it. Creates the tables,
   the RLS policies and the image bucket, and seeds the six categories. Safe to
   re-run.
2. Copy the URL and anon key from **Project Settings → API** into `.env.local`
   (see `.env.example`), then restart.
3. Create your user under **Authentication → Users → Add user** (tick *Auto
   Confirm*), then `insert into staff (email, name) values (…);`

That last step matters: **having an account is not the same as being allowed to
edit.** Writes are gated on membership in the `staff` table, both in the UI and
in the RLS policies, so a stray signup can't touch the shop.

**What it's built for**

The shop's Facebook is a stream of *"FLAVOR OF THE DAY"* posts and stock that
turns over weekly, so the admin is shaped around that rather than around a
generic catalogue:

- **The banner** is the first thing on the dashboard — type today's flavours,
  hit post, and it's a strip across the top of the site. One tap to retire it.
- **Flavours are first-class.** Paste a whole drop in at once (newlines or
  commas), tap a flavour to mark it sold out — it disappears from the site but
  stays in the list — and clear all sold-out ones in one button when restocked.
- **One-tap in/out** and an inline price that saves on blur, straight from the
  inventory table. No opening a form to mark something out of stock.
- **Photos** drag-and-drop or come off a phone camera, straight to Storage.
- **Prices can be blank.** Renders as "Ask in store", which is honest for
  one-of-one glass rather than showing $0.

Everything is live on the storefront the moment it's saved.

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

1. **Connect Supabase and load real stock.** See `/admin` above.
   `src/lib/products.ts` is only the fallback seed — the categories and carried
   brands in it are real (from their BBB listing), the individual items are
   representative stand-ins. Once Supabase has rows, it takes over.
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
  app/
    (site)/            storefront — age gate, nav, footer, JSON-LD
    admin/             inventory management (auth-gated)
    api/reserve/
  middleware.ts        session refresh + /admin gate
  components/
    film/              chapter film + chapter context
    shop/              Store (search + facets), QuickView, tiles
    hold/              hold-list provider + slide-out
    ritual/            4-step demo, R3F nug viewer
    admin/             login, product form, uploader, variant manager
    ui/                shadcn primitives
  lib/
    shop.ts            NAP, hours, open/closed — single source of truth
    inventory.ts       server: Supabase read with static fallback
    catalog.ts         client-safe shapes + price formatting
    supabase/          browser / server clients, config
    products.ts        fallback seed catalogue
supabase/
  schema.sql           tables, RLS, storage bucket, seed
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
