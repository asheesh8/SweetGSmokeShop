# Ritual section — Seedance prompts

The ritual demo has four steps. **Step 01 is the 3D nug scan and needs no
video** — so this is three clips, not four.

| Step | File the site looks for | Poster |
| --- | --- | --- |
| 02 The Grind | `public/video/grind.mp4` | `public/video/grind.jpg` |
| 03 The Pack | `public/video/ritual-loop.mp4` | `public/video/ritual-loop.jpg` |
| 04 The Light | `public/video/light.mp4` | `public/video/light.jpg` |

Use those filenames exactly and they light up with no code change. Until then
each step shows a "footage pending" plate, so nothing looks broken while you
work through them.

---

## Three things that will bite you

**1. Turn the audio off.** `generate_audio` defaults to **`true`** on Seedance.
These are muted autoplay backgrounds, and Safari blocks autoplay on a video that
carries an audio track *even when it's muted*. Every command below passes
`--generate-audio false`, and the ffmpeg step strips it again as insurance.

**2. Shoot 4:3, not 16:9.** The ritual stage is a 4:3 box. (My earlier
`SEEDANCE-SHOTLIST.md` said 16:9 and 1:1 for these — that was written before the
stage existed. For the *chapter backgrounds* 16:9 is still right; for these
three it isn't, and a 16:9 clip gets its sides cropped off in the stage.)

**3. One camera, one light.** Every prompt ends with the same camera and grade
sentence. That is the single thing making separately generated clips look like
one shoot — don't edit it per clip.

---

## Cost

Priced against your account just now:

| | 5s @ 720p | 5s @ 1080p |
| --- | --- | --- |
| Per clip | 22.5 credits | 45 credits |
| **All three** | **67.5** | **135** |

You have **935 credits**. Go **1080p** — the stage renders around 700px wide,
which is ~1400px on a retina screen, and 720p at 4:3 is only 960px across, so it
softens. Budget roughly double for retries; even then you're under 300.

---

# The commands

Run each from the project root. `--wait` blocks and prints the result URL.

## 02 — The Grind

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --prompt "Extreme macro shot, 85mm lens, shallow depth of field. Real hands slowly twist open an anodized metal grinder resting on a dark walnut counter, revealing evenly ground green herb inside the chamber. The knurled metal grip and sharp teeth catch the light. The ground material is textured and slightly uneven, real and organic, not uniform. Handheld micro-drift, almost still. Warm tungsten key light from camera left, cool blue-grey rim light from behind, near-black background falling into deep shadow. Cinematic, heavy filmic grain, warm amber highlights and crushed blacks, muted earthy 1970s film stock color grade. No text, no watermark, no logos, no faces."
```

## 03 — The Pack

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --prompt "Extreme macro shot, 85mm lens, shallow depth of field. A thick handblown iridescent glass bowl piece rests on a dark walnut counter, dried green herb settling into it, fine golden dust drifting in the air around it. The glass shifts colour subtly as the light moves across it. Very slow, almost still, handheld micro-drift. Warm tungsten key light from camera left, cool blue-grey rim light from behind, near-black background falling into deep shadow. Cinematic, heavy filmic grain, warm amber highlights and crushed blacks, muted earthy 1970s film stock color grade. No text, no watermark, no logos, no faces."
```

## 04 — The Light *(spend your retries here)*

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --prompt "Extreme macro shot, 85mm lens, shallow depth of field. A flame meets dried herb packed in a thick glass bowl. It catches and glows deep orange, embers pulsing and brightening. Thick white smoke begins to rise and curl slowly through the frame, backlit so it glows against a near-black background. The ember is the main light source, warm firelight from below, cool blue rim light behind the smoke. Slow, heavy, hypnotic smoke movement. Cinematic, heavy filmic grain, warm amber and crushed blacks, muted earthy 1970s film stock color grade. No text, no watermark, no logos, no faces."
```

---

## On refusals

A few of the still prompts got refused first time round and went through on a
reword. The pattern: **describe the object, not the process.** "Dried green herb
in a glass bowl" passes where "packed with ground cannabis" does not. The
prompts above already use the phrasing that worked — if one still comes back
empty, swap "herb" for "dried botanical" and it'll go.

---

## The higher-quality route: drive it from a still

Seedance is strongest animating a frame you've already approved, and you
**already have three matching stills** from the chapter film:

```
public/img/ch02-grind.jpg   →  02 The Grind
public/img/ch03-pack.jpg    →  03 The Pack
public/img/ch04-light.jpg   →  04 The Light
```

Feeding those in guarantees the ritual demo and the chapter film look like the
same shoot, and you approve the composition before anything moves:

```bash
higgsfield generate create seedance_2_0 \
  --aspect-ratio 4:3 --duration 5 --resolution 1080p --mode std \
  --generate-audio false --wait \
  --start-image ./public/img/ch04-light.jpg \
  --prompt "The ember catches and pulses. Thick smoke rises slowly and curls through frame. Camera holds nearly still with faint handheld drift."
```

Keep the motion prompt that short — with a start image you're directing
movement, not describing a scene.

**One caveat:** those stills are 16:9 and you're asking for 4:3, so Seedance
reframes and you lose some of the sides. If that bothers you, regenerate the
start frame at 4:3 first (2 credits each):

```bash
higgsfield generate create nano_banana_pro \
  --aspect-ratio 4:3 --resolution 2k --wait \
  --prompt "<the full prompt from the matching section above>, still photograph, no motion"
```

---

## After they generate

Raw output is too heavy to autoplay. For each clip:

```bash
ffmpeg -i input.mp4 -vf "scale=1440:-2,fps=24" -c:v libx264 -crf 24 \
  -preset slow -movflags +faststart -an public/video/grind.mp4
```

`-an` strips audio — see gotcha 1. `+faststart` puts the index at the front so
playback begins before the whole file arrives.

Then a poster frame each, so something is on screen before the video loads:

```bash
ffmpeg -i public/video/grind.mp4 -vf "select=eq(n\,12)" -vframes 1 -q:v 3 \
  public/video/grind.jpg
```

**Make step 03 loop cleanly.** It's the one that sits there while someone reads
the copy, so a visible jump is obvious. Cross-dissolve the last second over the
first:

```bash
ffmpeg -i in.mp4 -filter_complex \
  "[0]split[a][b];[a]trim=0:4,setpts=PTS-STARTPTS[main];\
   [b]trim=4:5,setpts=PTS-STARTPTS,format=yuva420p,fade=out:st=0:d=1:alpha=1[tail];\
   [main][tail]overlay" -an public/video/ritual-loop.mp4
```

Smoke and glass are forgiving of this — you won't see the seam.

---

## Check it

```bash
npm run dev
```

Open the homepage, scroll to **The Ritual**, and click through steps 02–04. Each
should autoplay muted and loop. If a step still shows "footage pending", the
filename doesn't match the table at the top.
