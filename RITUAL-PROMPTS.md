# Ritual section — Seedance prompts

Step 01 is the 3D nug scan and needs no video, so this is three clips.

| Step | File | Status |
| --- | --- | --- |
| 02 The Grind | `public/video/grind.mp4` | ✅ **done** — installed, 2.6MB, poster generated |
| 03 The Pack | `public/video/ritual-loop.mp4` | ⬜ v2 prompt below |
| 04 The Light | `public/video/light.mp4` | ⬜ |

---

## What went wrong with the Pack, and the fix

The v1 prompt said *"a thick handblown iridescent glass bowl piece."* It
generated **a glass ashtray.** Two reasons, both mine:

1. **"Bowl piece" is shop jargon the model doesn't know.** It read "glass bowl"
   literally — a bowl-shaped glass dish. Ashtray, cereal bowl, candle holder;
   all reasonable readings of the words I gave it.
2. **Nothing in the prompt asked for a person or a bong.** I wrote that the
   bowl "rests" on the counter, so nothing moved and no hands appeared.

The fix is to stop naming the object and **describe its geometry instead** —
"a short angled glass stem projecting from the side of the pipe, ending in a
small cone-shaped chamber about the size of a thumb tip." That's a shape the
model can actually render. The v2 prompt below also names the failure modes
explicitly (`not an ashtray, not a glass dish`), which is worth doing whenever
a generation has already gone wrong in a specific way.

---

## 03 — The Pack (v2)

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --prompt "Extreme macro shot, 85mm lens, shallow depth of field. A tall handblown glass water pipe stands upright on a dark walnut counter, thick clear glass catching the light, the tube rising out of the top of frame. A short angled glass stem projects from the side of the pipe near its base, ending in a small cone-shaped chamber about the size of a thumb tip. Two fingers enter frame from the right holding a pinch of coarsely ground green herb, and slowly press it down into that small cone, packing it firmly. The fingers withdraw and the shot settles. Only a hand is visible, close and cropped, with five normal fingers. Warm tungsten key light from camera left, cool blue-grey rim light behind the glass, near-black background falling into deep shadow. Slow deliberate movement, handheld micro-drift. Cinematic, heavy filmic grain, warm amber highlights and crushed blacks, muted earthy 1970s film stock color grade. This is a smoking water pipe, not an ashtray, not a glass dish, not a cereal bowl. No text, no watermark, no logos, no face, no arms, no full body."
```

### If the hand comes out wrong

Hands are where video models fail hardest, and this shot needs one. Two things
that help before you burn credits on retries:

- **Crop in tighter.** Add `only the fingertips and the top of the hand are in
  frame` — fewer fingers visible, fewer chances to render a sixth.
- **Slow the action down.** One pinch, one press, then stillness. Fast or
  repeated hand motion is where the fingers start melting.

If two attempts still look wrong, use the two-step route below — it's more
reliable for anything involving hands, because you approve the hand *before*
anything moves.

---

## The reliable route for this shot: still first, then animate

For a shot with hands in it, this is worth the extra 2 credits.

**Step 1 — generate the frame** (2 credits, retry until the hand is right):

```bash
higgsfield generate create nano_banana_pro \
  --aspect-ratio 4:3 --resolution 2k --wait \
  --prompt "Extreme macro photograph, 85mm lens, shallow depth of field. A tall handblown glass water pipe stands upright on a dark walnut counter, thick clear glass, the tube rising out of the top of frame. A short angled glass stem projects from the side near the base, ending in a small cone-shaped chamber the size of a thumb tip. Two fingers hold a pinch of coarsely ground green herb just above that cone, about to press it in. Only a hand is visible, close and cropped, five normal fingers. Warm tungsten key light from camera left, cool blue-grey rim light behind the glass, near-black background falling into deep shadow. Cinematic, heavy filmic grain, warm amber and crushed blacks, muted earthy 1970s film stock color grade. A smoking water pipe, not an ashtray, not a glass dish. Still photograph, no motion. No text, no watermark, no face."
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
  --prompt "Extreme macro shot, 85mm lens, shallow depth of field. A flame meets dried herb packed in the small cone-shaped chamber of a glass water pipe. It catches and glows deep orange, embers pulsing and brightening. Thick white smoke begins to rise and curl slowly through the frame, backlit so it glows against a near-black background. The ember is the main light source, warm firelight from below, cool blue rim light behind the smoke. Slow, heavy, hypnotic smoke movement. Cinematic, heavy filmic grain, warm amber and crushed blacks, muted earthy 1970s film stock color grade. No text, no watermark, no logos, no face."
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
