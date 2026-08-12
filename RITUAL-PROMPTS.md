# Ritual section — Seedance prompts

Step 01 is the 3D nug scan and needs no video, so this is three clips.

| Step | File | Status |
| --- | --- | --- |
| 02 The Grind | `public/video/grind.mp4` | ✅ **done** — installed, 2.6MB, poster generated |
| 03 The Pack | `public/video/ritual-loop.mp4` | ✅ **done** — trimmed to the flake-break moment, poster generated |
| 04 The Light | `public/video/light.mp4` | ⬜ |

---

## The Pack — where v2 landed, and v3

**v1** made a glass ashtray. **v2** got most of the way there: correct beaker
bong, correct walnut counter, correct lighting, and an anatomically sound hand
with five fingers. Two things are still wrong, and they're both things the
prompt never actually described.

**Problem 1 — it's a whole nug, not ground herb.** v2 said "coarsely ground
green herb," but "herb" and "flower" both pull the model toward the iconic
cone-shaped bud, and nothing in the prompt described what ground material
*looks* like. Adjectives lose to a strong visual prior; you have to describe the
texture.

**Problem 2 — there's no bowl piece.** That little glass tube on the side of
the beaker is the **socket** (the female joint), which is moulded into the bong
itself. A bowl piece is a *separate removable part* that plugs into it, and v2
never said so — so the model rendered the socket, left it empty, and the bud
went straight down into the bong.

The fixes: describe ground herb by **texture and analogy** ("crumbly and
shredded, like dried oregano"), and describe the bowl as **a separate object
with a familiar shape** ("a tiny glass funnel, like a small wine glass with no
base, plugged into the socket").

---

## 03 — The Pack (v3)

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --prompt "Extreme macro shot, 85mm lens, shallow depth of field. A clear glass beaker-base water pipe stands on a dark walnut counter, its tube rising out of the top of frame. Plugged into the angled socket on the side of the beaker is a separate small removable glass bowl: a tiny clear glass funnel with a wide flared rim and a short narrow stem, shaped like a small wine glass with no base, sitting in the socket at an angle. Two fingers enter from the right holding a loose pinch of finely ground plant material — crumbly, shredded and uneven, the texture of dried oregano or coarse loose-leaf green tea, made of many tiny separate fragments and flakes. The fingers crumble it so the fragments tumble down and fill the little glass funnel, a few flakes scattering onto the glass, then a fingertip gently presses the pile down and withdraws. Warm tungsten key light from camera left, cool blue-grey rim light behind the glass, near-black background falling into deep shadow. Slow, deliberate, handheld micro-drift. Cinematic, heavy filmic grain, warm amber highlights and crushed blacks, muted earthy 1970s film stock color grade. The material is loose crumbled fragments, absolutely not a single whole intact flower bud, not one solid cone-shaped nug. The herb goes into the small removable glass funnel bowl, not down the open tube. Only a hand, five normal fingers. No text, no watermark, no logos, no face, no arms."
```

### What changed and why

| Fix | The words doing the work |
| --- | --- |
| Ground, not a bud | *crumbly, shredded and uneven · texture of dried oregano or coarse loose-leaf green tea · many tiny separate fragments and flakes* |
| Reinforced by motion | *the fingers crumble it so the fragments tumble down · a few flakes scattering* — something solid can't scatter |
| Stated as a negative | *absolutely not a single whole intact flower bud, not one solid cone-shaped nug* |
| A real bowl piece | *a separate small removable glass bowl · a tiny clear glass funnel with a wide flared rim and a short narrow stem · shaped like a small wine glass with no base* |
| Where it goes | *into the small removable glass funnel bowl, not down the open tube* |

**If the bowl still doesn't appear**, the socket is winning because the model
has seen far more bongs than bowl pieces. Two options: shoot it already packed
(`the small glass funnel bowl is already seated in the socket and half full of
crumbled herb; the fingers add a last pinch and press it down`), which is an
easier frame to render, or use the still-first route below and retry the still
until the bowl is there — at 2 credits a go that's the cheap way to fight it.

---

## 03 — The Pack (v4), if you re-roll it

The v3 clip is installed and good. A later re-roll came back worse in three
ways, so if you're chasing a better take, use v4 — it guards against all three.

**1. The herb went in as a solid plug.** It held a cylindrical shape like a cork
being pushed into a bottle. v3's "many tiny fragments" describes the *material*
but not what it *does*, so the model rendered a cohesive puck. The fix is to
describe separation as an event: fragments coming apart in mid-air.

**2. The bowl was a straight tube again, not a funnel.** Same socket-vs-bowl
problem as v2 — v3 won it, this roll lost it. Worth negating the wrong shape by
name: *not a straight-walled tube.*

**3. The water came out bright blue — and that one is my prompt's fault.** Every
prompt here says *"cool blue-grey rim light."* With a beaker full of water in
frame, "blue" stopped being a lighting note and became the colour of the liquid.
It also dragged the whole grade cool, which fights the warm amber the rest of
the footage is graded in. v4 says *pale silver* instead and rules out the tint
explicitly.

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --prompt "Extreme macro shot, 85mm lens, shallow depth of field. A clear glass beaker-base water pipe stands on a dark walnut counter, its tube rising up and out of the top of the frame so the mouthpiece is not visible. The water inside is completely clear and colourless like plain tap water. Plugged into the angled socket on the side of the beaker is a separate small removable glass bowl, shaped like a tiny funnel: narrow at the bottom where it enters the socket, flaring outward and upward into a wide open cone, like a small wine glass with no base. It is a cone that widens, not a straight-walled tube. Two fingers enter from the right holding a loose pinch of finely ground plant material, crumbly and shredded like dried oregano. As the fingers rub together the pinch comes apart in mid-air: individual flakes and fragments separate and tumble down independently, scattering, filling the little cone and dusting the glass around it. The material never holds together as one solid piece. Then a fingertip lightly presses the loose pile and withdraws. Warm tungsten key light from camera left, pale silver rim light behind the glass, near-black background falling into deep shadow. Slow, deliberate, handheld micro-drift. Cinematic, heavy filmic grain, warm amber highlights and crushed blacks, muted earthy 1970s film stock colour grade, warm overall. No blue tint anywhere, no blue or coloured water, no cyan cast. Loose separated flakes, absolutely not a solid plug, puck, disc, cork or whole intact bud. Only a hand, five normal fingers. No text, no watermark, no logos, no face, no arms."
```

| Problem in the re-roll | The words fixing it |
| --- | --- |
| Solid plug of herb | *comes apart in mid-air · separate and tumble down independently · never holds together as one solid piece · not a solid plug, puck, disc, cork* |
| Straight tube, no bowl | *narrow at the bottom… flaring outward and upward into a wide open cone · a cone that widens, not a straight-walled tube* |
| Blue water and cool cast | *completely clear and colourless like plain tap water · pale silver rim light · warm overall · no blue tint anywhere, no blue or coloured water, no cyan cast* |
| Mouthpiece in shot | *rising up and out of the top of the frame so the mouthpiece is not visible* |

> **Lighting note that applies to every shot here:** naming a colour in the
> lighting clause will tint objects, not just light. If a scene has water, glass
> or smoke in it, say *pale silver* or *cool white* rather than *blue*.

---

## The reliable route for this shot: still first, then animate

For a shot with hands in it, this is worth the extra 2 credits.

**Step 1 — generate the frame** (2 credits, retry until the hand is right):

```bash
higgsfield generate create nano_banana_pro \
  --aspect-ratio 4:3 --resolution 2k --wait \
  --prompt "Extreme macro photograph, 85mm lens, shallow depth of field. A clear glass beaker-base water pipe stands on a dark walnut counter, its tube rising out of the top of frame. Plugged into the angled socket on the side of the beaker is a separate small removable glass bowl: a tiny clear glass funnel with a wide flared rim and a short narrow stem, shaped like a small wine glass with no base. That funnel is filled with finely ground plant material — crumbly, shredded, uneven, the texture of dried oregano or coarse loose-leaf green tea, many tiny separate fragments. Two fingers hover just above it holding another pinch of the same crumbled material. Only a hand, five normal fingers. Warm tungsten key light from camera left, cool blue-grey rim light behind the glass, near-black background falling into deep shadow. Cinematic, heavy filmic grain, warm amber and crushed blacks, muted earthy 1970s film stock color grade. Loose crumbled fragments, not a whole intact flower bud. Still photograph, no motion. No text, no watermark, no face."
```

**Step 2 — animate the approved frame** (short motion-only prompt):

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --start-image ./path-to-your-still.png \
  --prompt "The fingers press the herb down into the cone, pack it, and withdraw from frame. The shot settles. Camera holds nearly still with faint handheld drift."
```

Keep the motion prompt that short — with a start image you're directing
movement, not re-describing the scene.

---

## 04 — The Light

Unchanged, and still the one worth your retries.

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --prompt "Extreme macro shot, 85mm lens, shallow depth of field. A flame meets dried herb packed in the small cone-shaped chamber of a glass water pipe. It catches and glows deep orange, embers pulsing and brightening. Thick white smoke begins to rise and curl slowly through the frame, backlit so it glows against a near-black background. The ember is the main light source, warm firelight from below, pale silver rim light behind the smoke. Any water visible in the glass is clear and colourless, no blue tint. Slow, heavy, hypnotic smoke movement. Cinematic, heavy filmic grain, warm amber and crushed blacks, muted earthy 1970s film stock color grade. No text, no watermark, no logos, no face."
```

---

## Two corrections to what I told you earlier

**There is no negative-prompt field.** `higgsfield model get seedance_2_0`
lists every parameter it takes, and `negative_prompt` isn't among them — same
for `nano_banana_pro`. The "global negative prompt" block in
`SEEDANCE-SHOTLIST.md` has nowhere to go except inside the prompt text itself,
which is why every prompt here ends with its exclusions written out as a
sentence. Ignore that block; use these prompts as written.

**Muted video autoplays in Safari even with an audio track.** I said the
opposite earlier — that was wrong. WebKit's rule is that a video autoplays if
it is muted **or** has no audio track; either one is sufficient, and every
video on this site sets `muted`. So audio was never going to break playback.
It's still worth passing `--generate-audio false` — it makes the file smaller
and removes any chance of a stray unmute — but it isn't a bug if you forget.

---

## After a clip generates

You don't have ffmpeg installed, so I used macOS's built-in `avconvert` for the
grind clip — it took it from 5.6MB to 2.6MB:

```bash
avconvert --source ~/Downloads/raw.mp4 --output ./converted.mp4 \
  --preset Preset1280x720 --replace
```

On the grind clip this re-encoded at a lower bitrate and left the resolution
alone (still 1112×834), which is fine — the stage renders about 700px wide.
Then drop it in place and make a poster:

```bash
cp ./converted.mp4 public/video/ritual-loop.mp4
qlmanage -t -s 1400 -o /tmp public/video/ritual-loop.mp4
sips -Z 1400 -s format jpeg -s formatOptions 80 \
  /tmp/ritual-loop.mp4.png --out public/video/ritual-loop.jpg
```

If you do install ffmpeg later it gives finer control (`-crf`, frame-accurate
posters, and a proper cross-dissolve so step 03 loops without a visible jump) —
but none of that is blocking.

---

## Check it

```bash
npm run dev
```

Homepage → **The Ritual** → click steps 02–04. Anything still showing "footage
pending" has a filename mismatch with the table at the top.
