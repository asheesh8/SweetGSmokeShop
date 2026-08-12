# Sweet G's — Seedance 2.0 Shot List

Run these yourself on Higgsfield. Each shot below gives you the **prompt**, the
**negative prompt**, the settings, and the **exact filename** to save it as — if
you use those filenames and drop the files into `public/video/`, the site picks
them up with no code changes.

## Before you start — three rules that decide whether this looks real

1. **Everything is shot on one fictional camera.** Every prompt below says
   *85mm macro, shallow depth of field, handheld micro-drift*. Keep that
   phrasing in every shot. The single biggest tell of AI b-roll is that each
   clip looks like a different film crew.
2. **One light direction, one colour temperature.** Every prompt specifies a
   warm key from camera-left and a cool rim from behind. Don't mix.
3. **Shoot dark.** The site lays type over these. Anything bright and busy in
   the upper-left third will fight the headline. The prompts ask for falloff
   into shadow on purpose — resist the urge to brighten.

## Global settings

| Setting | Value |
| --- | --- |
| Model | `seedance_2_0` |
| Aspect | `16:9` for all backgrounds, `1:1` for the demo loop |
| Duration | 5s (10s only where noted) |
| Motion | Low / subtle — these are backgrounds, not action scenes |
| Seed | Lock one seed and reuse it across all shots for consistency |

## Global negative prompt — paste into every shot

```
text, watermark, logo, letters, numbers, subtitles, captions, people looking at camera, faces, hands with extra fingers, plastic CGI look, video game render, oversaturated colors, neon pink, magenta, purple haze, HDR glow, cartoon, illustration, warped geometry, melting objects, duplicate objects, jitter, flicker, fast camera moves, zoom bursts, lens flare spam
```

---

# THE ESSENTIAL FOUR

Generate these first. The site works with just these.

## 01 — Hero: the nug lands

**Save as:** `public/video/hero-nug.mp4`
**Aspect:** 16:9 · **Duration:** 5s · **This one is worth your retries.**

```
Extreme macro shot, 85mm, shallow depth of field. A single dense cannabis flower
falls in slow motion onto a dark weathered walnut counter and settles, bouncing
once. Orange pistils and frosted trichomes catch a warm tungsten key light from
camera left. Cool blue-grey rim light from behind separates it from a near-black
background that falls off into shadow. A few specks of kief drift in the air,
lit like dust motes. Handheld micro-drift, almost still. Cinematic, filmic
grain, warm amber and deep shadow, muted earthy color grade, 1970s film stock
feel. Background is empty dark space on the left third of frame.
```

**Why this framing:** the headline sits over the left third, so the prompt keeps
that side empty. If your generation puts the nug on the left, regenerate.

## 02 — The grind

**Save as:** `public/video/grind.mp4`
**Aspect:** 16:9 · **Duration:** 5s

```
Extreme macro shot, 85mm, shallow depth of field. Real hands slowly twist an
anodized metal grinder open, revealing evenly ground cannabis flower inside the
chamber. Metal teeth and knurled grip catch a warm tungsten key light from
camera left, cool rim light behind. Ground plant material is textured and
slightly uneven, real, not uniform. Near-black background falling into shadow.
Handheld micro-drift. Cinematic, filmic grain, warm amber and deep shadow,
muted earthy color grade, 1970s film stock feel.
```

## 03 — The light *(the money shot)*

**Save as:** `public/video/light.mp4`
**Aspect:** 16:9 · **Duration:** 5s · **Spend your retries here and on 01.**

```
Extreme macro shot, 85mm, shallow depth of field. A flame from a lighter meets
ground cannabis packed in a thick glass bowl. The flower catches and glows deep
orange, embers pulsing. Thick white smoke begins to rise and curl slowly through
the frame, backlit so it glows against a near-black background. Warm firelight
from the ember is the main light source, cool blue rim light behind the smoke.
Slow, heavy, hypnotic smoke movement. Handheld micro-drift. Cinematic, filmic
grain, warm amber and deep shadow, 1970s film stock feel.
```

## 04 — Ambient smoke *(seamless loop — used behind text sections)*

**Save as:** `public/video/smoke-loop.mp4`
**Aspect:** 16:9 · **Duration:** 10s · **Motion: very low**

```
Slow abstract wisps of white and grey smoke drifting upward through a pitch
black empty frame, backlit, glowing softly at the edges. Very slow, calm,
continuous movement with no beginning and no end. No objects, no hands, no
surfaces, just smoke in void. Soft focus. Cinematic, heavy filmic grain, warm
amber tint in the highlights, deep black shadows. Camera completely static.
```

**Make it loop cleanly:** generate it, then in any editor cross-dissolve the
last 1s over the first 1s. Smoke is very forgiving of this — you won't see the
seam. This is the one clip that plays constantly, so it has to be invisible.

---

# THE NICE-TO-HAVES

Only worth it once the four above are locked.

## 05 — The glass case

**Save as:** `public/video/glass.mp4` · 16:9 · 5s

```
Extreme macro shot, 85mm, shallow depth of field. Slow drift past a row of
handblown borosilicate glass pipes on a shelf, colored glass catching warm
tungsten light, iridescent surfaces shifting. Dark shop interior, near-black
background, everything falling into shadow. Handheld micro-drift, very slow
lateral move. Cinematic, filmic grain, warm amber and deep shadow, muted earthy
color grade, 1970s film stock feel.
```

## 06 — Counter detail

**Save as:** `public/video/counter.mp4` · 16:9 · 5s

```
Extreme macro shot, 85mm, shallow depth of field. Rolling papers, a brass
lighter, and a worn wooden rolling tray on a dark walnut counter. Warm tungsten
key from camera left, deep shadow everywhere else. Nothing moves except a slow
drift of the camera and a faint curl of smoke crossing frame. Cinematic, filmic
grain, warm amber, muted earthy 1970s color grade.
```

## 07 — Demo loop

> ⚠️ **Superseded.** The ritual demo now has its own 4:3 stage and needs three
> clips, not one square loop. Use **`RITUAL-PROMPTS.md`** for that section —
> it has the correct aspect ratio, the audio flag, and exact commands. The
> chapter backgrounds above (01–06) are still correct at 16:9.

**Save as:** `public/video/ritual-loop.mp4` · **1:1** · 5s

```
Extreme macro shot, 85mm, shallow depth of field, square format. A dense
cannabis flower rests on dark walnut. It is slowly consumed: ground, packed into
a thick glass bowl, then lit — the ember glowing orange as smoke rises and fills
the frame, then clears back to the flower. Continuous, seamless, hypnotic loop.
Warm tungsten key from camera left, cool rim behind. Near-black background.
Cinematic, filmic grain, warm amber and deep shadow, 1970s film stock feel.
```

---

# Image-to-video: the higher-quality route

Seedance 2.0 is strongest driving motion from a still. If you want a real step
up in quality:

1. Generate the still first with `nano_banana_pro`, using the **same prompt text**
   from the shot above but ending with `still photograph, no motion`.
2. Pick the best still.
3. Feed that still into `seedance_2_0` with a **short motion-only** prompt.

Motion prompts for image-to-video — keep them this short:

| Shot | Motion prompt |
| --- | --- |
| 01 Hero | `The flower settles and rests. Dust drifts slowly. Camera holds nearly still with faint handheld drift.` |
| 02 Grind | `Hands slowly twist the grinder open. Camera holds still.` |
| 03 Light | `The ember catches and pulses. Thick smoke rises slowly and curls through frame.` |
| 04 Smoke | `Smoke drifts upward slowly and continuously. Camera static.` |

This gives you far more control over composition, because you've already
approved the frame before anything moves.

---

# Encoding before you upload

Raw Seedance output is too heavy to autoplay as a background. Run each file
through this — it typically takes a 40MB clip to under 3MB with no visible loss
at background scale:

```bash
ffmpeg -i input.mp4 -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 26 -preset slow -movflags +faststart -an output.mp4
```

Note `-an`: **strip the audio**. These are muted autoplay backgrounds; audio
tracks block autoplay in Safari and waste bandwidth.

Also export one poster frame per clip, so something is on screen before the
video loads:

```bash
ffmpeg -i hero-nug.mp4 -vf "select=eq(n\,12)" -vframes 1 -q:v 3 hero-nug.jpg
```

Save posters next to the videos as `public/video/<name>.jpg`.

---

# Where each file lands

| File | Used as |
| --- | --- |
| `hero-nug.mp4` | Homepage hero background |
| `grind.mp4` | Ritual demo, step 2 |
| `light.mp4` | Ritual demo, step 3 + the Visit section background |
| `smoke-loop.mp4` | Ambient background behind the story section |
| `ritual-loop.mp4` | The square inline ritual player |
| `glass.mp4` | Shop category header |
| `counter.mp4` | Optional second ambient bed |

Until a file exists, the site falls back to a graded still gradient in the same
palette — nothing breaks, it just gets better as you add each clip.
