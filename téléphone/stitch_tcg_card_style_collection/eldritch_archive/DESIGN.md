---
name: Eldritch Archive
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353438'
  on-surface: '#e4e1e6'
  on-surface-variant: '#cfc2d6'
  inverse-surface: '#e4e1e6'
  inverse-on-surface: '#303033'
  outline: '#988d9f'
  outline-variant: '#4d4354'
  surface-tint: '#ddb7ff'
  primary: '#ddb7ff'
  on-primary: '#490080'
  primary-container: '#b76dff'
  on-primary-container: '#400071'
  inverse-primary: '#842bd2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#e9c349'
  on-tertiary: '#3c2f00'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#131316'
  on-background: '#e4e1e6'
  surface-variant: '#353438'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is a fusion of **Dark Fantasy** and **Ornate Brutalism**. It targets seasoned TCG collectors who value immersion, ritual, and the feeling of uncovering forbidden knowledge. The UI evokes the emotional response of a digital grimoire—heavy, mysterious, and pulse-quickening.

The aesthetic balance relies on the tension between "Obsidian" depth and "Ether" luminance. We employ physical metaphors through metallic filigree and aged parchment textures, but maintain digital usability through clean layout structures and purposeful glow effects. 

**Visual Pillars:**
- **The Ritualistic Interface:** Interactions should feel like casting spells (glows, fading transitions, and crystalline pulses).
- **Materiality:** Use layers of dark stone, brushed obsidian, and gold-leaf accents to create a tactile, premium feel.
- **The Glow:** High-contrast accents are not just colors; they are light sources that cast ambient shadows on surrounding UI elements.

## Colors

The palette is rooted in the "Void," using deep, desaturated tones to allow mystical accents to "pop" with an ethereal intensity.

- **Primary (Mystic Purple):** `#A855F7`. Used for high-level magical elements, active states, and primary calls to action.
- **Secondary (Emerald Bloom):** `#10B981`. Reserved for nature-themed cards, health indicators, and positive success states.
- **Tertiary (Antique Gold):** `#D4AF37`. Used exclusively for ornate borders, filigree details, and "Legendary" rarity status.
- **Neutral (Obsidian & Charcoal):** `#0F0F12` (Base), `#1A1A1E` (Surface), `#2D2D33` (Stroke).
- **Background Texture:** A subtle parchment overlay `#C4B59D` at 5% opacity should be applied over obsidian surfaces to provide a "weathered" feel.

## Typography

The typography system balances "Ancient Authority" with "Technical Precision."

- **Headlines:** Uses a high-contrast serif to mimic the inscriptions found on rare cards and old manuscripts. Large displays should use "Old Style" figures where possible.
- **Body:** A modern, neutral sans-serif ensures card descriptions and lore text are readable against dark, textured backgrounds.
- **Stats & Labels:** A monospaced font is used for card numbers, attack/defense stats, and metadata to provide a "crawled" or "etched" data feel that stays perfectly aligned in grids.
- **Styling:** Headings should often use a subtle vertical gradient (from white to light grey) to mimic the way light hits a metallic engraving.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy, creating a "Stage" for the cards to occupy. 

- **Desktop:** A 12-column grid with wide 64px margins. This creates a sense of focused isolation, as if the UI is a physical table in a dark room.
- **Rhythm:** Use an 8px base scaling system for components, but use 4px for fine-grained internal card details.
- **Composition:** Large amounts of "Void" (negative space) are required to let the glow effects from cards bleed into the background without clutter.
- **Mobile:** Transition to a 4-column fluid grid. Ornate borders should simplify to single-pixel gold lines to maximize screen real estate for card art.

## Elevation & Depth

Depth in the design system is achieved through **Luminance Layering** rather than traditional drop shadows.

- **The Base:** The deepest obsidian layer (`#0F0F12`) represents the "void."
- **Surfaces:** Floating containers use a slight purple-tinted charcoal (`#16121A`) with a 1px inner gold border.
- **Glow Elevation:** Higher elevation is communicated via "Inner Radiance." The more important the element, the stronger its outer bloom (`box-shadow: 0 0 20px rgba(168, 85, 247, 0.4)`).
- **Backdrop:** Use heavy blurs (20px+) behind modal overlays to maintain the "dark room" atmosphere while focusing the user on the "ritual" at hand.

## Shapes

The shape language is **Angular & Architectural**. 

- **Corners:** Use "Soft" (`0.25rem`) roundedness for most UI elements to prevent them from feeling too modern or "friendly." 
- **The Octagon:** Reference the card frames in the images by using chamfered (clipped) corners for primary buttons and stat displays.
- **Borders:** Containers should utilize "Filigree Strokes"—variable width borders that are thicker at the corners and thinner in the middle, mimicking hand-forged metal frames.

## Components

- **Cards:** The primary container. It must feature a "Frame within a Frame" style. A dark stone outer border, a 1px gold inset, and a parchment-textured text area at the bottom.
- **Action Buttons:** Octagonal shapes with a center-to-edge gradient. The "Hover" state triggers a "Mana Pulse"—a rapid expansion of a purple glow.
- **Chips/Tags:** Styled as "Runes." Small, dark pill shapes with gold etched text and no background fill, only a subtle border.
- **Input Fields:** Styled like "Inscribed Stone." Deeply recessed (inner shadow) with a flashing "Calligraphy Nib" cursor in primary purple.
- **Modals:** These should appear to "Manifest" from the center of the screen with a radial blur transition, framed in heavy metallic filigree.
- **Scrollbars:** Custom ultra-thin gold tracks with a purple "Gemstone" thumb.