# Hero Section – Build Prompt (Learners Park · Complete SSB Preparation)

Build a pixel-faithful, responsive hero section (HTML + Tailwind/CSS, or React) matching the reference
`Complete_SSB_Preparation_Landing_Page.png` (1672×941 desktop frame). Use the files in `/assets` as provided.

## 1. Brand tokens
| Token | Value | Use |
|---|---|---|
| --crimson | #6B0812 | CTA button, headline accent, nav CTA |
| --crimson-shape | #7B1A22 | large diagonal diamond behind soldier |
| --ink | #06150D (near-black green) | headline line 1, nav text, outline buttons |
| --olive | #8A9271 / #444F2E | right-side green panel, logo green |
| --sage | #B7BFA3 / #909876 | chevrons, star insignia, faded decor |
| --gold | #CE9A3A | logo star |
| --bg-light | #F3F4EB → #E4E7D8 | hero background gradient (top-left to bottom) |
| --white | #FFFFFF | navbar, WhatsApp/Telegram glyphs |

Typography: a tight, condensed-feeling grotesque sans (Inter Tight / Plus Jakarta Sans / Manrope).
- Headline line 1 "One Destination for": weight 400–500, ~76px, letter-spacing -0.03em, colour --ink
- Headline line 2 "Complete SSB Preparation": weight 700–800, ~76px, letter-spacing -0.04em, colour --crimson
- Eyebrow + exam row: weight 600, uppercase, wide tracking (0.25em for eyebrow, 0.2em for NDA • CDS • AFCAT)
- Sub line "Start your SSB journey for free": 26px, weight 400, --ink
- Bottom micro-nav: 12–13px, uppercase, tracking 0.25em, colour #55604f

## 2. Layout (desktop, 1672 wide)
Height: 100vh (min 720px). Two layers: background scene + foreground content.

**Navbar** (height 83px, white, subtle bottom shadow, sticky)
- Left (x=66): `logo_full_transparent.png`, height ~56px
- Centre links: CSSS · OPAM · PPDT · Mentorship — 22px, weight 500, ~64px gap, hover underline in crimson
- Right: "Get Started →" button, crimson, white text, radius 8px, padding 14×36, uses `icon_arrow_right.svg`

**Left content column** (x=66, max-width ~900px)
1. Eyebrow (y≈200): 70px hairline in crimson, then `DISCIPLINE • GUIDANCE • SUCCESS` with crimson dot separators
2. H1 two lines (y≈260–420), see typography
3. Exam row (y≈464): `NDA • CDS • AFCAT`, bold, tracking 0.2em, dot separators crimson, then a 130px thin hairline
4. Sub line (y≈557)
5. Buttons row (y≈604–668, gap 26px), all height 64px, radius 8px:
   - Primary "Get Started for Free →" crimson fill, white text, width ~282px
   - Outline "CSSS Test Free" with `icon_document.svg`, 2px --ink border, transparent bg, ~220px
   - Outline "OPAM Test Free" with `icon_document.svg`, same style
6. Bottom-left micro nav (y≈885): 3px × 55px crimson vertical bar, then `LEARN | PRACTICE | IMPROVE | SUCCEED` separated by thin vertical dividers

**Right visual column** (x≈860 → 1672, full hero height)
- Layer A (back): olive green panel – a large slanted parallelogram occupying the top-right corner (from x≈1300 at top sloping to ≈ x=820 at bottom), colour --olive at ~85% opacity with faint topographic contour lines and a thin circular HUD ring (≈360px diameter, 1px sage stroke, with tick marks) centred behind the soldier's shoulder.
- Layer B: crimson rounded diamond `diamond_shape.svg`, ~760×800, rotated slightly (skew −12°), left edge ≈ x=870, top ≈ y=165. It sits behind the soldier's head and shoulder.
- Layer C: `rank_insignia.svg` (star + chevron) at ~x=1430–1530, y=450–560, and `triple_chevron.svg` at x≈1555–1610, y=262–350, both low-contrast sage, partly hidden behind the soldier.
- Layer D (front): `soldier_cutout.png` – anchored to bottom-right, rendered ~860px tall, left edge ≈ x=915. The sword rises past the top of the navbar edge (sword tip goes under the navbar at y≈83). Add a soft drop shadow on the left edge: `filter: drop-shadow(-10px 10px 24px rgba(0,0,0,.25))`.

**Background scene (left/centre)**
- Base: linear-gradient(135deg, #F3F4EB 0%, #E4E7D8 100%) with a subtle misty/grain overlay.
- `mountains_bg.png` – place at x≈470–850, y≈480–600, opacity 0.35–0.5, mix-blend-mode: multiply, mask with a horizontal fade.
- `indiagate_parade_scene.png` – bottom strip, x≈0–820, y≈690–850, opacity ~0.55, mask-image: linear-gradient(to bottom, transparent, #000 25%, #000 80%, transparent) so it melts into the background.
- `fighter_jets.png` – top-centre, x≈725–1060, y≈165–305, opacity ~0.6, with jet contrails sweeping toward upper-right. Faint topographic line art (SVG paths, 1px sage, opacity .25) behind the jets.
- Two thin diagonal white lines (1px, opacity .6) crossing from the bottom-left of the diamond toward the top-right.

**Floating chat buttons** (fixed, right: 16px, vertical centre ≈ y=590 and 665)
- `icon_whatsapp.png` and `icon_telegram.png`, 60px circles, 12px gap, soft shadow, hover scale 1.08, link to wa.me / t.me.

## 3. Behaviour & responsiveness
- ≥1280px: layout as above.
- 768–1279px: H1 scales with clamp(40px, 5.5vw, 76px); soldier shrinks to ~55% width and stays bottom-right; hide HUD ring and jets.
- <768px: stack: navbar collapses to logo + hamburger + Get Started; headline first, buttons stack full-width, soldier placed beneath at ~85% width over the crimson diamond; micro-nav wraps into 2×2; chat buttons shrink to 48px.
- Animations (subtle, 600–900ms ease-out): headline lines fade-up with 120ms stagger; soldier slides in from right + fades; diamond scales from 0.96; jets drift 20px left→right on load; buttons lift 2px on hover with shadow; respect prefers-reduced-motion.
- Accessibility: alt text on all images (soldier: "Cadet in ceremonial uniform with sword"), buttons ≥44px, contrast of crimson on light bg ≥ 7:1.

## 4. Asset manifest (/assets)
| File | Type | Notes |
|---|---|---|
| soldier_cutout.png | RGBA PNG, 707×856 | Main subject, transparent background (see caveat) |
| logo_full_transparent.png / logo_full.png | PNG 325×75 | Emblem + "Learners Park" wordmark |
| logo_emblem_transparent.png / logo_emblem.png | PNG 70×72 | Star + chevron book emblem (favicon base) |
| fighter_jets.png | PNG 335×140 | Faded jets + contrails (use with opacity) |
| mountains_bg.png | PNG 380×120 | Faded mountain ridge |
| indiagate_parade_scene.png | PNG 800×160 | Faded India Gate + parade |
| icon_whatsapp.png, icon_telegram.png | RGBA PNG 64×64 | Circular chat icons |
| rank_insignia.svg, triple_chevron.svg, diamond_shape.svg | SVG | Vector recreations of decor shapes |
| icon_arrow_right.svg, icon_document.svg | SVG (currentColor) | Button icons |

## 5. Quality notes for the developer
- Raster crops are at the reference image's native resolution (the source frame is only 1672px wide). For crisp 2x/retina display, replace the faded background rasters with higher-res or AI-regenerated versions, or recreate them as SVG.
- Faded scene images already contain the light background tint, so use them with `mix-blend-mode: multiply` rather than on a different background colour.
- Soldier cutout was produced by automatic segmentation: a small crimson sliver remains beside the neck. It blends with the crimson diamond placed behind it, so keep the diamond layer directly behind the soldier. Replace with a professionally masked image for production.
- Licensing: the second uploaded photo (Soilder.png) carries an "SSBCrack" watermark, so it belongs to a third party. Use only a photo you own or have licensed for the final site.
