# Dorset Nocturne — Sweet G's Smoke Shop

The design system for Sweet G's Smoke Shop LLC, 150 Dorset St, South Burlington VT.

One shop, two personalities. The site ships a theme toggle, and it switches more
than brightness — the radius, the display typeface, the casing and the ornament
all change with it. That's the point: it should read as flipping the sign on the
door, not as inverting a stylesheet.

| | **NOCTURNE** (default, dark) | **HIPPIE** (light) |
| --- | --- | --- |
| Feel | Cinematic. Real macro footage, deep shadow, one ember accent. | 1970s head shop. Cream paper, marigold and rust, warm and hand-made. |
| Corners | Square (`--radius: 0`) | Fat and rounded (`--radius: 1.15rem`) |
| Display face | **Anton** — heavy condensed poster caps | **Shrikhand** — fat, bulging, Cooper Black lineage |
| Casing | `uppercase` | as written |
| Ornament | none | sun mark, warm bloom |

---

## Tokens

Everything is built on semantic tokens, which is what lets one set of components
carry both looks. Components never reference a raw hex.

### NOCTURNE (dark)

| Token | Hex | Role |
| --- | --- | --- |
| `background` | `#0b0a09` | The ground. Near-black, warm-biased, never pure `#000`. |
| `card` | `#14120f` | Raised surfaces, product tiles, the filter rail. |
| `secondary` | `#211d18` | Chips, quiet fills. |
| `foreground` | `#ede8df` | Primary text. Bone, not white. |
| `muted-foreground` | `#9a9287` | Body copy, labels, everything secondary. |
| `primary` | `#e8873a` | Ember. CTAs, active states, the one warm light source. |
| `accent` | `#d9a441` | Gold. Highlights and the element tile. |
| `destructive` | `#b4502a` | Rust. Errors and closed state. |
| `border` | `rgba(237,232,223,0.13)` | Hairlines. Never heavier. |

### HIPPIE (light)

| Token | Hex | Role |
| --- | --- | --- |
| `background` | `#f6ecd9` | Cream paper. |
| `card` | `#fffaf0` | Raised surfaces. |
| `secondary` | `#e9d8b6` | Warm sand fills. |
| `foreground` | `#2a1e14` | Dark brown. Never black. |
| `muted-foreground` | `#7b6549` | Body copy. |
| `primary` | `#c2571c` | Burnt orange. |
| `accent` | `#d9982b` | Marigold. |
| `destructive` | `#a83612` | Deep rust. |
| `border` | `#d9c39a` | Warm tan hairlines. |

### Constant across both

`herb` `#6e7a4a` — the open/closed dot. It has to mean the same thing in either
theme, so it doesn't move.

---

## Type

| Role | Face | Notes |
| --- | --- | --- |
| Display (Nocturne) | **Anton** | Caps only. Tracking `+0.005em` — it's already tightly fitted, negative tracking closes the counters. |
| Display (Hippie) | **Shrikhand** | Mixed case. Its lowercase is the character. |
| Body & UI | **Space Grotesk** | Quirky rather than neutral. Chosen specifically to avoid the default-grotesk look. |
| Labels, eyebrows, buttons | **Space Mono** | Uppercase, `0.14–0.22em` tracking. Every small label on the site is mono. |

The eyebrow — a short rule then a mono uppercase label — is the system's
signature and appears above every section heading.

---

## Photography

Every frame follows one camera and one lighting setup, and that consistency is
the single thing that makes twenty separately generated images read as one shoot:

> 85mm macro, shallow depth of field. Warm tungsten key from camera left, cool
> blue-grey rim from behind, near-black background falling into deep shadow.
> Heavy filmic grain, warm amber highlights, crushed blacks, muted earthy 1970s
> film stock grade.

**Compose for type.** Chapter frames leave one third of the frame empty so the
headline has somewhere to sit. If a generation fills the frame edge to edge,
regenerate it.

**No text in any photograph.** Type lives in the DOM where it can be read aloud,
translated, and edited without a re-render.

---

## Do / don't

**Do** keep the accent rare. Ember is a light source, not a brand colour to
coat things in — one CTA per view, maybe an active state.

**Do** let the photography carry the emotion and keep the interface quiet
around it. Hairline borders, mono labels, generous space.

**Do** put the address, hours and phone within one scroll of any page. This is
a local business; the site's job is to get somebody onto Dorset Street.

**Don't** use gradients on flat interface elements. Gradient belongs to light
and smoke only.

**Don't** reintroduce hot pink, day-glo, or sticker-poster maximalism. That
direction was explored and cut — it read as costume rather than shop.

**Don't** add scroll smoothing or scroll hijacking. Native scroll, always.

---

## Provenance

Photography generated with Higgsfield `nano_banana_pro` from prompts written for
this project; prompts and per-file cost are recorded in `manifest.md`. The two
3D nug specimens are photogrammetry scans supplied by the client. No
third-party artwork ships in this repository.
