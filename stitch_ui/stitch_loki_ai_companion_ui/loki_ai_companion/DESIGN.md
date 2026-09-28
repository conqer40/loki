---
name: Loki AI Companion
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#ffb9d2'
  on-tertiary: '#640039'
  tertiary-container: '#ff8dbc'
  on-tertiary-container: '#870050'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cd'
  on-tertiary-fixed: '#3e0022'
  on-tertiary-fixed-variant: '#8c0053'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an intimate, deeply reflective, and emotionally safe environment for an AI psychological companion on Android. The aesthetic fuses Google Gemini’s dynamic computational intelligence with ChatGPT’s grounded conversational clarity, built entirely around a serene OLED dark universe.

The interface evokes safety, intellectual empathy, and calm focus. It avoids clinically sterile medical tropes in favor of an organic, celestial sanctuary where users feel comfortable sharing vulnerable thoughts. The visual language utilizes:
- **Atmospheric OLED Minimalism:** Deep blacks prioritize low cognitive load, battery efficiency on AMOLED panels, and total visual serenity during late-night reflections.
- **Iridescent Aurora Intelligence:** Vibrant multi-stop gradients (Cyan `#38bdf8` to Purple `#a855f7` to Rose `#ec4899`) indicate thought synthesis, emotional resonance, and dynamic listening states.
- **Native Android Expressive Fluidity:** Material 3 edge-to-edge architecture, continuous fluid pill containers, floating capsule controls, and tactile feedback tailored for high-end mobile touch ergonomics.
- **RTL-First Parity:** Complete bidirectional harmony ensuring that typography, gestural flows, speech bubble tails, input affordances, and drawer anchors feel natively authored for Arabic speakers.

## Colors

The color palette centers on absolute darkness, preserving dynamic range for spectral gradient glows and tactile surface definition.

### Canvas & Surface Architecture
- **Pitch Black Canvas (`#0a0a0c`):** Reserved for Live Voice streaming modes, immersive grounding exercises, and sensory deprivation sessions.
- **Deep OLED Canvas (`#131314`):** Base system background for conversational feeds and settings.
- **Surface Level 1 (`#1e1f20`):** Default card background, floating bottom navigation, and passive conversational cards.
- **Surface Level 2 (`#282a2c`):** Active user message bubbles, active drawer selections, and raised popovers.
- **Surface Subtle Border (`#333538`):** 1px low-contrast dividers and card delineations.

### Iridescent Accent System
- **Cyan Resonance (`#38bdf8`):** Represents clarity, analytical insight, and prompt interaction.
- **Purple Aurora (`#a855f7`):** Represents deep emotional awareness, memory retention, and psychological presence.
- **Rose Flare (`#ec4899`):** Represents warmth, empathy, crisis care alerts, and active human-touch states.
- **Gradient Stream:** `linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #ec4899 100%)` applied to AI speech highlights, voice visualizer ribbons, and dynamic border strokes.

### Typography & Content Shades
- **Primary Text (`#e3e3e3`):** High-contrast, glare-free off-white for body copy, message bubbles, and primary headings.
- **Secondary Text (`#9ca3af`):** Neutral gray for timestamps, transcription subtitling, and contextual captions.
- **Subtle Text (`#64748b`):** Muted placeholders and passive states.

## Typography

Typography prioritizes Arabic reading comfort, line heights, and glyph rhythm alongside Latin alphanumeric elements.

### Font Pairing & Arabic Adaptation
- **Primary Typeface:** `Plus Jakarta Sans` serves as the primary system driver, accompanied by `Alexandria` and `Readex Pro` for native Arabic Android deployments.
- **RTL Baseline Ratios:** Arabic scripts demand increased line height (between 1.5x and 1.7x font size) to prevent overlapping ascenders, descenders, and tashkeel diacritics. All body and headline metrics feature expanded line heights specifically calibrated for seamless Arabic rendering.
- **Weight Strategy:** Restrict weights primarily to `400` (Regular) for sustained reading and `600` / `700` (SemiBold/Bold) for structural hierarchy. Avoid thin weights under `400` on OLED dark canvases to eradicate stroke degradation and optical fringing.

## Layout & Spacing

The layout model adheres to Android 14/15 edge-to-edge guidelines, drawing behind dynamic system navigation and status bars.

### Mobile Grid & Spatial Rhythm
- **Rhythm Unit:** 8pt spatial grid, with 4pt steps used for internal pill padding and tight micro-alignments.
- **Margins:** `1.25rem` (20px) horizontal outer margin on typical phone displays, expanding to `1.5rem` (24px) on foldable foldouts and tablets.
- **Chat Gutter:** `0.75rem` (12px) vertical gap between adjacent conversational turns; `1.5rem` (24px) between temporal session switches.
- **Safe Insets:** Bottom navigation and conversational capsules float above the Android Gesture Bar with a dynamic `max(env(safe-area-inset-bottom), 16px)` offset.

### RTL Flow & Axis Flipping
- Horizontal layout directions flip mirror-wise:
  - Loki (AI) bubbles align to start (`right` in RTL, `left` in LTR).
  - User response bubbles align to end (`left` in RTL, `right` in LTR).
  - Navigation drawer dismiss gestures track drag-to-right in RTL.
  - Floating capsule send vectors point to the logical end.

## Elevation & Depth

This system avoids heavy physical drop shadows, relying on layered surface tonal values, spectral luminosity, and soft atmospheric backdrops.

### Elevation Levels
- **Level 0 (Flat Canvas):** `#131314` for standard chat, `#0a0a0c` for live audio canvas. Zero elevation.
- **Level 1 (Card & Bubble Tier):** `#1e1f20` elevated with a continuous 1px micro-border `#333538` (alpha 0.4).
- **Level 2 (Active Elements):** `#282a2c` equipped with a faint directional highlight along the top rim (`rgba(255, 255, 255, 0.06)`).
- **Level 3 (Floating Controls & Navigation):** `#1e1f20` with 80% opacity and an active Gaussian background blur (`24px`).

### Ambient Glows & Spectral Halos
- **Thinking / Processing State:** Card borders transition from `#333538` to a rotating iridescent gradient stroke (`#38bdf8` -> `#a855f7` -> `#ec4899`) accompanied by an outer ambient blur: `box-shadow: 0 0 28px rgba(168, 85, 247, 0.18)`.
- **Live Voice Presence:** Central voice avatar projects a breathing, radial organic blur spanning 180px with soft falloffs (`#38bdf8` at 15% opacity scaling to `#ec4899` at 0%).

## Shapes

The shape system expresses tenderness, approachability, and contemporary Android M3 design philosophies through hyper-rounded forms and capsule geometry.

### Radius Scale
- **Pills / Fully Rounded (`9999px`):** Action chips, prompt suggestion tags, primary floating interaction bars, bottom navigation bar frames, and audio waveforms.
- **Conversational Cards & Modals (`28px`):** AI response cards, psychological insight modules, audio transcription sheets, and dialog surfaces.
- **Message Bubbles (`20px`):** Asymmetrical message containers with a contextual anchor:
  - User Bubble (RTL): 20px top-right, 20px top-left, 4px bottom-left, 20px bottom-right.
  - Companion Bubble (RTL): 20px top-right, 20px top-left, 20px bottom-left, 4px bottom-right.

## Components

### 1. Conversational Bubbles & Insights
- **Loki Companion Output:** Rendered on `#1e1f20` with subtle border stroke `#333538`. Features a gradient micro-sparkle indicator at the logical start. When generating emotional insights, the card receives a 1.5px gradient highlight along the inner edge.
- **User Reflection Bubble:** Rendered on `#282a2c` with pure `#e3e3e3` typography. No external shadow; crisp, tactile, and distinct from AI feedback.

### 2. Floating Capsule Input Bar
- Floating container anchored at the bottom with a 16px lateral margin.
- Background: Surface Level 1 (`#1e1f20`) at 85% opacity with `20px` backdrop blur.
- Roundedness: Continuous `9999px` pill.
- Border: 1px continuous `#333538`, glowing into Cyan (`#38bdf8`) upon focus.
- RTL Layout: Attachment icon at start (`right`), expandable multi-line text input in the center, Live Voice wave and Send buttons at end (`left`).

### 3. Buttons & Interaction Targets
- **Primary Action (Aurora Pill):** Gradient fill (`#38bdf8` to `#a855f7`), white bold text, full-capsule radius (`9999px`), 48px standard touch height.
- **Secondary Action (Ghost Capsule):** Translucent surface `#1e1f20`, 1px border `#333538`, text `#e3e3e3`. Active state shifts border to `#a855f7`.
- **Floating Action Button (M3 FAB):** 56x56px pill/squircle hybrid, background `#282a2c` with glowing gradient edge for instant voice journaling.

### 4. Chips & Prompt Starters
- Height: 36px, fully rounded `9999px`.
- Inactive: Background `#1e1f20`, text `#9ca3af`, border 1px `#333538`.
- Active/Tapped: Soft violet tint `#a855f7` at 15% opacity, text `#38bdf8`, border `#38bdf8`.

### 5. Drawer & Navigation Framework
- **Modal Drawer (Start-anchored):** Slides from right edge in RTL. Background `#131314` with rounded logical end corners (`28px`). Contains psychological timeline history, journal logs, and mood tracking metrics.
- **Floating Navigation Island:** Detached capsule bottom navigation, containing icon-only or icon-and-label tabs. Active tab indicated by an iridescent glowing pill indicator beneath the icon.

### 6. Live Voice Pitch-Black Overlay
- Fullscreen modal transitioning to `#0a0a0c`.
- Minimalist fluid orb in viewport center reacting via scale, hue shift, and amplitude to spoken Arabic phonetic cadences.
- Dynamic transcription rendering in real-time using `headline-md` centered or logical-start aligned text with smooth letter-by-letter gradient reveals.