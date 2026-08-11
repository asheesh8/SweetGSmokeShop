# Claude Design brief — Sweet G's Smoke Shop

Paste this straight into Claude Design's intake.

---

**Company name**

Sweet G's Smoke Shop

---

**Company blurb**

Sweet G's is a family-run smoke shop that's been on Dorset Street in South
Burlington, Vermont since 2018 — glass, vaporizers, CBD, local art, and vintage
and custom clothing you can't get anywhere else in the state. It's BBB A+ rated
and built on the unfashionable idea that a smoke shop should actually explain
things to you. Nobody gets pointed at a shelf and left there.

---

**Design system name**

Dorset Nocturne

---

**Other notes**

*Two personalities, one system.* The site ships a theme toggle that switches
more than brightness — corner radius, display typeface, letter casing and
ornament all change with it. Nocturne (dark, default) is cinematic: square
corners, heavy condensed caps, real macro photography, deep shadow. Hippie
(light) is a 1970s head shop: cream paper, fat rounded corners, bulging display
type, marigold and rust.

*Palette — Nocturne (dark, default)*
- Background `#0b0a09` · Card `#14120f` · Secondary `#211d18`
- Foreground `#ede8df` · Muted `#9a9287`
- Primary / ember `#e8873a` · Accent / gold `#d9a441` · Destructive / rust `#b4502a`
- Border `rgba(237,232,223,0.13)`

*Palette — Hippie (light)*
- Background `#f6ecd9` · Card `#fffaf0` · Secondary `#e9d8b6`
- Foreground `#2a1e14` · Muted `#7b6549`
- Primary `#c2571c` · Accent `#d9982b` · Destructive `#a83612`
- Border `#d9c39a`
- Constant in both: herb green `#6e7a4a` for the open/closed indicator

*Font pairing*
- Display: **Anton** in dark (condensed poster caps), **Shrikhand** in light
  (fat 70s). Body: **Space Grotesk**. Labels, buttons and eyebrows:
  **Space Mono**, uppercase, 0.14–0.22em tracking.
- Deliberately not a default UI grotesk — the type is where most of the
  personality lives.

*Tone words*
hand-made · warm · unhurried · local · straight-talking · a little feral

*Voice*
Spoken, not written. Short sentences, dry humour, zero wellness vocabulary. The
shop talks you out of the expensive thing when the cheap thing is better, and
the copy should sound like that. Never say "vibes," "curated," or "elevate."

*Do / don't*
1. **Do** let photography carry the emotion and keep the interface quiet around
   it — hairline borders, mono labels, generous space, one accent per view.
2. **Do** keep address, hours and phone within one scroll of any page. This is a
   local business; the site's job is foot traffic to Dorset Street.
3. **Don't** put text inside photographs, use gradients on flat UI, or add
   scroll smoothing. Gradient belongs to light and smoke only; scroll stays
   native.

*Commerce constraint worth knowing*
No online checkout, by design. Stripe and PayPal both prohibit tobacco and
smoking accessories, so the site uses a "hold list" instead — a cart-shaped flow
that emails the shop to set items aside for pickup. No money moves online.

*Compliance*
21+ age gate on entry; age and legal-use disclaimers in the footer.
