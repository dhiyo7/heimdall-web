# Design System: lobehub.com

> https://lobehub.com/ · 3 page(s) · 6821 elements · 2026-09-19T16:51:57.020Z
> Design MD Generator, measured from computed CSS (no vision model; all prose derived from measurements).

Measured design tokens for rebuilding an interface in this style. No markup, copy or assets from the source site. Treat every value as exact; where one is absent it was not observable, so ask rather than substitute - and where there is nobody to ask, record it as a `TODO(spec):` marker rather than filling the gap. See `## Rules`.

## Rules

**These apply to every export of this analysis**

- These are build-time tokens for the actual product UI, not a specification for a tokens/design-system showcase page. The deliverable is the source site rebuilt as an ordinary interface a visitor would use, not documentation about these measurements: apply every value to that interface, and never render the data itself as visible page content - no color swatch grid, type-scale chart, token list, component gallery, instance count, confidence percentage, or a 'design tokens inspector' panel of any kind.
- Reference every value by its token name, never by the literal it resolves to. No hex, `rgb()` or `hsl()` literal belongs anywhere outside the single block that defines the tokens.
- Structure is not derivable from tokens. Section order, band composition and component variants are carried by the measured specification for this analysis, not by the token names: never infer a page's section order from them, and never add a section the specification does not call for.
- A value that is not here was not observable, not unimportant. Never substitute a plausible one. Ask if there is anyone to ask; if there is not, write `TODO(spec): <the exact value you need>` at the line that needs it, collect those in an `OPEN-QUESTIONS.md` at the repository root, and leave the property at its framework default rather than a value you designed. A marked gap is a correct build; a plausible invention that reads as measured is not.
- None of the source site's words, images, icons or brand assets are reproduced in any export, by design. Write your own neutral placeholder copy at the measured lengths and casing, and render a plain block at the measured aspect ratio where an image sits. Functional labels - navigation items, buttons, form labels - must read as real labels, never as lorem ipsum, because they carry the meaning of the interface. Do not reproduce the source brand name, logo or marketing copy, and do not invent a company identity, legal name or testimonial for it. Build every icon as a real SVG - from the chosen stack's icon library, or inline SVG matched to the reference screenshots otherwise - sized and coloured to its surrounding token; never substitute a Unicode emoji character for an icon.
- Before calling the build done, verify both: every colour resolves through a token name, and nothing measured about the source site - occurrence counts, painted-area percentages, confidence scores, contrast ratios - appears anywhere a visitor can see.

**Do**
- Use only what is defined below: 13 semantic color roles drawn from 16 palette colors, 10 type steps, 19 spacing steps, 8 radii and 7 shadow levels.
- Copy the `## CSS Variables` block to `:root` and reference tokens by name, never by literal value.
- Keep every size, gap and inset on the 2px grid: 2px, 4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 22px, 24px, 26px, 28px, 32px, 48px, 88px, 96px, 114px, 160px.
- Set all text in **Geist**, code and numerals in **Geist Mono**.
- Apply radii as measured: buttons 8px · cards 8px.
- Separate surfaces with borders (1px `#EEEEEE`). This design uses borders over elevation.
- Constrain content to 1150px with 24px horizontal padding.
- Build in light mode first; the palette below is the light palette.
- Write your own neutral placeholder copy at the measured lengths and casing, and render a plain block at the measured aspect ratio where an image sits. Functional labels — navigation items, buttons, form labels — must read as real labels, never as lorem ipsum, because they carry the meaning of the interface.
- Build every icon as a real SVG — from the chosen stack's icon library where one is picked in `## Engineering Standards`, or inline SVG matched to what the reference screenshots show otherwise — sized and coloured to the token its surrounding element uses. Never substitute a Unicode emoji character (🔍, ⭐, 🏠, ...) for an icon: a screen reader announces one as a verbose pile of emoji names, not as the control it is meant to decorate, and it cannot be recoloured or resized to the measured token the way a real icon can.
- Hover styling was not observable in a static capture. `--color-primary-hover` (#005FCC) was derived from the measured primary by a lightness shift — use it for hover on primary controls without a sampled one. For focus, active, disabled, and any hover not sampled, derive from the tokens below (opacity, the measured border color, an existing surface) rather than introducing a new hue, and confirm against the live site.
- Use the 5 measured gradients in `### Gradients` where indicated; do not flatten them to a solid fill.
- Build the entry page's 18 bands exactly as listed in `## Page Structure`, in the same order, with the same composition and item count per band — that table is the structural blueprint, not background reading. Matching every token while getting the section order or count wrong is still a failed rebuild.
- Navigation Bar, Hero Section, Footer differ per page in `## Components`: build the row whose `Page` matches the page being built, rather than one version everywhere or an average of them.

**Don't**
- Do not invent a hex code, size, spacing value or radius that is not listed in this document. Tokens marked "derived" are the only sanctioned exception.
- Do not substitute a plausible value where one is missing. A missing value was not observable — ask instead. If there is nobody to ask, write `TODO(spec): <the exact value you need>` at the line that needs it, collect those in an `OPEN-QUESTIONS.md` at the repository root, and leave the property at its framework default rather than a value you designed. A marked gap is a correct build; a plausible invention that reads as measured is not.
- Do not copy the source markup, text content, imagery, icons or brand assets. Reproduce the visual language only.
- Do not reproduce the source brand name, logo or marketing copy, and do not invent a company identity, legal name or testimonial in their place.
- Do not turn this document's own measurement tables into visible page content. The figures in `## Content & Assets`, `## Cross-Page Consistency`, `## Accessibility Notes`, the palette's occurrence/painted-area columns and the `## Definition of Done` checklist describe how this document was measured, not something the source site displays — do not add a stats block, scorecard, checklist widget or dashboard section built from them unless a band in `## Page Structure` already calls for one.
- Do not add gradients, shadows, animation or effects that were not measured.
- Do not add, remove, merge, split or reorder the bands in `## Page Structure`, and do not change a band's composition (grid vs. row vs. stacked) or item count from what is listed there.
- Do not reorganize a band into a shape other than the one its `Composition` cell states — an "N-up row" or "stacked, N item(s)" builds as exactly one row or one stack of N, never wrapped into extra rows or grouped into columns of your own invention, however large N is. A menu's items that are only reachable by hovering, focusing or clicking a trigger are not part of that band's visible item count; build them as a genuinely hidden panel, not as additional always-visible rows.
- Do not reproduce the 1 text pair that fails WCAG AA in `## Accessibility Notes`; adjust the foreground instead.

_Caveats: no vision model ran, so all prose here is derived from measurements._

## Overview

A light-scheme interface led by its 12 most-used colors and set in Geist / Geist Mono. Generated without a vision model.

**Inventory:** light scheme · 40 colors · 2 font families · 10 type steps · 19 spacing steps · 8 radii · 7 shadow levels · 19 components · 3 pages

## Design Direction

Rebuild against the measured tokens below. The layout uses CSS grid for its primary structure. Content is constrained to 1150px.

- **Composition:** The entry page runs 14 band(s) top to bottom: section (stacked, 2 item(s)), then section (stacked), then section (stacked), then section (2-col grid), then h2 (stacked), then div (2-up row, gap 16px). 2 other page(s) were also outlined.
- **Hierarchy:** Hierarchy spans 10 type steps, from Display at 72px to Small at 13.5px.
- **Density:** Spacing runs from 2px to 160px across 19 recurring steps.
- **Typography:** Typography is set in Geist and Geist Mono.
- **Color:** #0072F5 carries interactive emphasis against a #F8F8F8 page surface. The most prominent band uses a gradient (#F8F8F8 → #FFFFFF) rather than a flat fill.
- **Rhythm:** Corners settle around 16px; spacing and radius should be applied from the token tables.

**Keywords:** light, grid-based, measured

## Color System

Scheme: **light**.

### Semantic roles

| Role | Value | CSS variable |
| --- | --- | --- |
| Background | `#F8F8F8` | `--color-background` |
| Text primary | `#000000` | `--color-text-primary` |
| Text secondary | `#222222` | `--color-text-secondary` |
| Text muted | `#052B56` | `--color-text-muted` |
| Border | `#EEEEEE` | `--color-border` |
| Primary | `#0072F5` | `--color-primary` |
| Secondary | `#D97757` | `--color-secondary` |
| Accent | `#FCD53F` | `--color-accent` |
| Primary (hover, derived) | `#005FCC` | `--color-primary-hover` |
| Danger | `#D97757` | `--color-danger` |
| Warning | `#FCD53F` | `--color-warning` |
| Success | `#379D4A` | `--color-success` |
| Info | `#0072F5` | `--color-info` |

### Palette (by painted area)

The semantic roles above are the API for this build: every color in the rebuilt interface should resolve to one of them. This table is the evidence those roles were derived from — an entry with no role is a color the source site paints somewhere the analysis could not assign a role to, not a spare color to reach for. Use one only where a band or component below names it, and otherwise ask - or record `TODO(spec): the role of <hex>` and leave it unused.

| Hex | Used as | Painted area | Occurrences |
| --- | --- | --- | --- |
| `#FFFFFF` | text, background, border | 80.3% | 1201 |
| `#0D0D0D` | text, background | 13.6% | 3552 |
| `#EE9E0B` | background, text | 1.2% | 3 |
| `#BD54C6` | background | 1.2% | 1 |
| `#000000` | background, text | 0.8% | 21 |
| `#EEEEEE` | border, background | 0.4% | 210 |
| `#D78CF6` | background | 0.3% | 1 |
| `#9747FF` | background | 0.3% | 1 |
| `#FFCF58` | background | 0.3% | 1 |
| `#FFA15E` | background | 0.3% | 1 |
| `#38B6FF` | background | 0.3% | 1 |
| `#6875FF` | background | 0.3% | 1 |
| `#1A1A1A` | border, background | 0.2% | 112 |
| `#999999` | text | 0.2% | 492 |
| `#222222` | background, border, text | 0.1% | 28 |
| `#666666` | text | 0.1% | 723 |

### Gradients

These bands are gradients, not solid fills - the stops above already list their colors individually, but do not use them as flat backgrounds where a gradient is named here. Build each one with the type and direction in its first column: a linear at the measured angle is not interchangeable with a radial, or with the same linear at another angle. Where a gradient carries no direction, the CSS default for its type applies (180deg for a linear).

| Type & direction | Stops | Used on | Occurrences |
| --- | --- | --- | --- |
| `linear-gradient` | `#F8F8F8` → `#FFFFFF` | section | 2 |
| `linear-gradient` | `#000000` → `#0D0D0D` | section | 1 |
| `linear-gradient`, 113.3deg | `#D78CF6` → `#9747FF` | div | 1 |
| `linear-gradient`, 113.3deg | `#FFCF58` → `#FFA15E` | div | 1 |
| `linear-gradient`, 113.3deg | `#38B6FF` → `#6875FF` | div | 1 |

## Typography

Base size **15px** · heading **Geist** · body **Geist** · mono **Geist Mono**.
Web fonts loaded: `Geist`, `Geist Mono`, `KaTeX_AMS`, `KaTeX_Caligraphic`, `KaTeX_Fraktur`, `KaTeX_Main`, `KaTeX_Math`, `KaTeX_SansSerif`, `KaTeX_Script`, `KaTeX_Size1`, `KaTeX_Size2`, `KaTeX_Size3`.

### Families

| Family | Stack | Kind | Roles |
| --- | --- | --- | --- |
| Geist | `Geist, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, "/* SC */", "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "/* FALLBACK */", ui-sans-serif, system-ui, sans-serif, "/* EMOJI */", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` | web font | body, heading |
| Geist Mono | `"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, "Cascadia Code", Consolas, "Liberation Mono", "/* SC */", "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "/* FALLBACK */", monospace, "/* EMOJI */", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` | web font | body, mono |

### Type scale

| Step | Size | Weight | Line height | Letter spacing | Observed on |
| --- | --- | --- | --- | --- | --- |
| Display | 72px | 800 | 72px | -4.32px | span |
| H2 | 48px | 700 | 57.5px | -1.92px | h2 |
| H1 | 44px | 700 | 61.5px | -1.76px | h2 |
| H3 | 40px | 700 | 50px | normal | h1 |
| H4 | 32px | 700 | 40px | normal | h2 |
| H5 | 28.5px | 700 | 29px | normal | h3, span, h2 |
| H6 | 24px | 500 | 33.5px | normal | h3, div |
| Heading 20px | 20px | 400 | 32px | normal | p, h3, h2 |
| Heading 17.5px | 17.5px | 700 | 22px | normal | h3 |
| Small | 13.5px | 400 | 21.5px | 0.32px | button, a, h2, h3, div, span |

Weights in use: 400, 500, 600, 700, 800.

## Spacing System

Base unit **2px**. Scale: 2px · 4px · 6px · 8px · 10px · 12px · 14px · 16px · 18px · 22px · 24px · 26px · 28px · 32px · 48px · 88px · 96px · 114px · 160px.

| Token | Value | Occurrences |
| --- | --- | --- |
| space-3xs | 2px | 24 |
| space-2xs | 4px | 471 |
| space-xs | 6px | 509 |
| space-sm | 8px | 794 |
| space-md | 10px | 14 |
| space-lg | 12px | 879 |
| space-xl | 14px | 51 |
| space-2xl | 16px | 1587 |
| space-3xl | 18px | 535 |
| space-4xl | 22px | 30 |
| space-5xl | 24px | 507 |

container padding 24px · max width 1150px · section spacing 48px · gaps 4px, 5px, 6px, 8px, 11px, 12px, 16px, 32px.

## Border Radius

| Token | Value | Observed on |
| --- | --- | --- |
| radius-xs | 3px | span |
| radius-sm | 6px | a, span, button |
| radius-md | 8px | a, div, button, span, li, table |
| radius-lg | 12px | div, table, th, li |
| radius-xl | 16px | div |
| radius-2xl | 20px | div |
| radius-3xl | 24px | div |
| radius-full | 9999px (full) | div, button, span, a, h2 |

Applied: cards 8px · buttons 8px · pill shapes present.

## Shadows

Surfaces are separated with **borders** more than shadows. Prefer hairline borders over elevation.

| Token | Value | Elevation | Type |
| --- | --- | --- | --- |
| shadow-xs | `rgba(0, 0, 0, 0.06) 0px 0px 1px 0px` | 0.5 | outset |
| shadow-sm | `rgb(238, 238, 238) 0px 1px 0px 0px` | 1 | outset |
| shadow-md | `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px` | 1 | outset |
| shadow-lg | `rgb(238, 238, 238) 0px 0px 0px 1px` | 1 | outset |
| shadow-xl | `rgba(0, 0, 0, 0.1) 0px 4px 16px -8px` | 12 | outset |
| shadow-inner | `rgba(0, 0, 0, 0.03) 0px 0px 0px 1px inset` | 1 | inset |
| shadow-inner-2 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset` | 1 | inset |

Borders: widths 1px, 2px · colors `#EEEEEE`, `#1A1A1A`, `#000000`, `#222222`, `#E3E3E3`.

## Layout

Each row is a measurement of the source layout to be applied to the rebuild. The container width and padding constrain the inner wrapper of every band whose `Content` cell in `## Page Structure` names a width; a band with a blank `Content` cell is full-bleed and takes no wrapper. The header and footer heights are the measured heights of those two bands. Whether the header is sticky, fixed or scrolls away was not observable in a static capture — do not pick one; mark it `TODO(spec):` and confirm against the live site.

| Property | Value |
| --- | --- |
| Container max width | 1150px |
| Container padding | 24px |
| Header height | 56px |
| Footer height | 488px |
| Uses CSS grid | yes |
| Uses flexbox | yes |
| Absolutely positioned blocks | 10 |
| Placement | CSS grid |
| Landmarks | header, nav, hero, footer |

### Grid

Recurring `grid-template-columns`, fixed tracks normalized to `px`. Where a band in `## Page Structure` is marked a grid, build it with CSS `display: grid` and the template whose column count matches that band — not a flexbox approximation of one:

| Columns | Template | Occurrences |
| --- | --- | --- |
| 2 | `px px` | 22 |
| 5 | `px px px px px` | 3 |
| 4 | `px px px px` | 2 |

Gaps in use: 4px, 5px, 6px, 8px, 11px, 12px, 16px, 32px. These are the only gap values measured on this site; do not introduce another.

## Page Structure

Top-level bands in document order - the structural blueprint, not a reference: build every band listed for a page, in this exact order, none skipped and none added. The vertical padding sets the page rhythm, `Content` is the width of the band's inner container (blank means full-bleed), and `Composition` is how its children are placed and how many of them there are. `Height` is what those values produced at the analyzed viewport - match the padding, composition and item count, not the height. The heading text identifies each band; it is not to be copied. The band count in each page heading below is the count to build.

### / — LobeHub - Your Chief Agent Operator (18 band(s))

| # | Band | Heading | Padding Y | Content | Composition | Height |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `section` | Your Chief Agent Operator | 0px | 1200px | stacked, 2 item(s) | 498px |
| 2 | `section` | - | 0px | 1200px | stacked | 824px |
| 3 | `section` | Trusted by teams worldwide | 0px | 1200px | stacked | 219px |
| 4 | `section` | Operate | 0px | 1200px | 2-col grid | 1113px |
| 5 | `h2` | - | 6px | - | stacked | 32px |
| 6 | `div` | Agents built for real work | 0px | - | 2-up row, gap 16px | 84px |
| 7 | `div` | Build Agents fast, with full control over their Skills | 0px | - | 2-up row, gap 16px | 498px |
| 8 | `div` | 333,741+ SKILLs | 0px | - | 2-col grid, 2 item(s), gap 16px | 236px |
| 9 | `section` | Collaborate | 0px | 1200px | stacked | 1345px |
| 10 | `section` | Evolve | 0px | 1200px | 2-col grid | 767px |
| 11 | `section` | Growing with the community | 0px | 1200px | stacked | 241px |
| 12 | `div` | - | 0px | - | stacked | 216px |
| 13 | `div` | - | 0px | - | stacked | 216px |
| 14 | `div` | - | 0px | - | stacked | 216px |
| 15 | `section` | Use Case | 0px | 1200px | stacked | 326px |
| 16 | `section` | Questions? Answers. | 0px | 1200px | stacked | 642px |
| 17 | `section` | Your Chief Agent Operator | 0px | 1200px | stacked | 598px |
| 18 | `section` | - | 0px | 1200px | 5-col grid | 488px |

### /pricing — Pricing · LobeHub (9 band(s))

| # | Band | Heading | Padding Y | Content | Composition | Height |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `div` | - | 0px | - | stacked | 9154px |
| 2 | `div` | Plans & Pricing | 48px / 0px | 348px | stacked, 3 item(s), gap 16px | 246px |
| 3 | `div` | Free | 0px | 1392px | 4-col grid | 869px |
| 4 | `div` | Enterprise Edition | 48px | - | 4-up row, gap 24px | 252px |
| 5 | `div` | Text Model Pricing | 16px | - | 2-up row, gap 24px | 2231px |
| 6 | `div` | Plan Comparison | 0px | - | stacked | 3799px |
| 7 | `div` | Questions? Answers. | 16px | - | 2-up row, gap 32px | 416px |
| 8 | `div` | Your Chief Agent Operator | 96px | 128px | stacked, 3 item(s), gap 32px | 556px |
| 9 | `section` | - | 0px | 1200px | 5-col grid | 488px |

### /docs — Getting LobeHub · LobeHub Docs · LobeHub (2 band(s))

| # | Band | Heading | Padding Y | Content | Composition | Height |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `section` | Getting LobeHub | 0px | 1392px | stacked | 1981px |
| 2 | `section` | - | 0px | 1200px | 5-col grid | 488px |

## Cross-Page Consistency

Compared 3 pages. Consistency score **60/100** (100 = every compared property matched across pages).

| Property | Severity | Observed values by page |
| --- | --- | --- |
| Card radius | notable | /: 8px; /pricing: 20px; /docs: 8px |
| Content max width | notable | /: 1200px; /pricing: 348px; /docs: 1392px |

## Content & Assets

Structural patterns only, across 3 analyzed page(s) - no text or images from the source site are reproduced here or anywhere in this document. Match the shape, not the substance.

| Signal | Value |
| --- | --- |
| Headings | avg 3.2 word(s), mixed case |
| Paragraphs | avg 19.8 word(s) |
| Images | 80 detected, 80 with alt text |
| Image shapes | 61 square, 17 landscape, 2 wide |
| Structured data | WebSite, SearchAction, PropertyValueSpecification, EntryPoint, WebPage, SpeakableSpecification, FAQPage, Question, Answer, BreadcrumbList |
| Links | 223 internal, 112 external |

80 image(s) detected (predominantly square); 80 of 80 carry alt text. Generated without a vision model, so treatment (photography vs illustration) could not be assessed.

Headings average 3.2 word(s) in a mixed-case pattern; paragraphs average 19.8 word(s).

## Motion & Interaction

This site CSS transitions on 3 of 3 page(s); CSS keyframe animation on 3 of 3 page(s).

| Properties | Duration | Easing |
| --- | --- | --- |
| all | 0.3s | cubic-bezier(0.645, 0.045, 0.355, 1) |
| all | 0.3s | cubic-bezier(0.215, 0.61, 0.355, 1) |
| color | 0.3s | ease |
| color, background, border-color, box-shadow | 0.16s | cubic-bezier(0.32, 0.72, 0, 1) |
| width, margin, opacity | 0.38s | cubic-bezier(0.22, 1, 0.36, 1) |
| all | 0.2s | ease-in-out |
| color, background | 0.4s | cubic-bezier(0.215, 0.61, 0.355, 1) |
| opacity | 0.15s | ease-in-out |
| all | 0.2s | ease |

| Animation | Duration | Easing | Iterations | Direction |
| --- | --- | --- | --- | --- |
| base-button-spin | 0.6s | linear | infinite | normal |
| animation-n40jav | 600s | linear | infinite | normal |
| animation-10thkf8 | 5s | ease | infinite | normal |

These are the declared transition/animation timings and easing curves, measured from computed style - reproduce them on the properties named in the `Properties` column, which is where they were measured. Which element or interaction fires each one was not simulated, so do not guess a trigger: place a sample only where the property makes it unambiguous (a `background-color` transition on a hover, an `opacity`/`transform` pair on an entrance), and mark anything you cannot place `TODO(spec):` rather than inventing a choreography.

## Responsive Behavior

Captured: mobile, desktop. Layout changed at the captured widths 1440px; the real breakpoint sits between captured viewports.

### Measured differences

| Area | Observation | Desktop | Tablet | Mobile |
| --- | --- | --- | --- | --- |
| navigation | Navigation collapses into a menu toggle at mobile width. | 74 inline links | - | 2 inline links |
| columns | Grid column count reduces as the viewport narrows. | 5 columns | - | 2 columns |
| container | Content container width adapts to the viewport. | 1150px | - | 360px |
| visibility | Some elements are hidden entirely at smaller viewports. | 3858 visible elements | - | 1369 visible elements |
| columns | Band 1 (Your Chief Agent Operator) changes composition across viewports: stacked, 2 item(s) at desktop, stacked at mobile. | stacked, 2 item(s) | - | stacked |
| columns | Band 2 (`section`) changes composition across viewports: stacked at desktop, stacked, gap 24px at mobile. | stacked | - | stacked, gap 24px |
| columns | Band 4 (Operate) changes composition across viewports: 2-col grid at desktop, stacked at mobile. | 2-col grid | - | stacked |
| columns | Band 6 (Agents built for real work) changes composition across viewports: 2-up row, gap 16px at desktop, stacked at mobile. | 2-up row, gap 16px | - | stacked |
| columns | Band 7 (Build Agents fast, with full control over their Skills) changes composition across viewports: 2-up row, gap 16px at desktop, stacked, 2 item(s), gap 32px at mobile. | 2-up row, gap 16px | - | stacked, 2 item(s), gap 32px |
| columns | Band 8 (333,741+ SKILLs) changes composition across viewports: 2-col grid, 2 item(s), gap 16px at desktop, stacked, 2 item(s) at mobile. | 2-col grid, 2 item(s), gap 16px | - | stacked, 2 item(s) |
| columns | Band 9 (Collaborate) changes composition across viewports: stacked at desktop, stacked, 2 item(s), gap 16px at mobile. | stacked | - | stacked, 2 item(s), gap 16px |
| columns | Band 10 (Evolve) changes composition across viewports: 2-col grid at desktop, stacked at mobile. | 2-col grid | - | stacked |

### Type scaling

| Step | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| H1 | 28px | - | 28px |
| Body | 28px | - | 28px |

- Navigation collapses into a menu toggle at mobile width.
- Grid column count reduces as the viewport narrows.
- Content container width adapts to the viewport.
- Some elements are hidden entirely at smaller viewports.
- Band 1 (Your Chief Agent Operator) changes composition across viewports: stacked, 2 item(s) at desktop, stacked at mobile.
- Band 2 (`section`) changes composition across viewports: stacked at desktop, stacked, gap 24px at mobile.
- Band 4 (Operate) changes composition across viewports: 2-col grid at desktop, stacked at mobile.
- Band 6 (Agents built for real work) changes composition across viewports: 2-up row, gap 16px at desktop, stacked at mobile.
- Band 7 (Build Agents fast, with full control over their Skills) changes composition across viewports: 2-up row, gap 16px at desktop, stacked, 2 item(s), gap 32px at mobile.
- Band 8 (333,741+ SKILLs) changes composition across viewports: 2-col grid, 2 item(s), gap 16px at desktop, stacked, 2 item(s) at mobile.
- Band 9 (Collaborate) changes composition across viewports: stacked at desktop, stacked, 2 item(s), gap 16px at mobile.
- Band 10 (Evolve) changes composition across viewports: 2-col grid at desktop, stacked at mobile.

## Components

Specifications reconstructed from measured styles, not copies of the original markup.
`Confidence` reflects how reliable the detection heuristic is; below 70% is a guess worth checking.

### Navigation Bar

Primary site navigation anchored to the top of the page.

7 instances · 90% confidence · desktop/mobile · 390×52px

Navigation Bar was detected and its measured styles are listed in the Components section.

This component occurs at most once per page, so each row below is one page's version of it, not a style option — build the row whose `Page` matches the page you are building.

| Page | Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /, /pricing, /docs | Default | transparent | `#080808` | none | 0px | none | 14px / 400 | - | 52px |

**States:** default

### Sidebar

Vertical navigation or supporting column beside the main content.

2 instances · 75% confidence · desktop · 240×786px · gap 24px

Sidebar was detected and its measured styles are listed in the Components section.

This component occurs at most once per page, so each row below is one page's version of it, not a style option — build the row whose `Page` matches the page you are building.

| Page | Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /docs | Default | transparent | `#080808` | none | 0px | none | 14px / 400 | - | 786px |

**States:** default

### Hero Section

Large introductory section at the top of the page.

18 instances · 70% confidence · desktop/mobile · 1152×711px · gap 20px

Hero Section was detected and its measured styles are listed in the Components section.

This component occurs at most once per page, so each row below is one page's version of it, not a style option — build the row whose `Page` matches the page you are building.

| Page | Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /, /pricing, /docs | Default | `#FFFFFF` | `#080808` | none | 0px | none | 14px / 400 | - | 1981px |
| / | Variant 2 | `#FFFFFF` | `#080808` | 1px `#EEEEEE` | 12px | none | 14px / 400 | - | 498px |
| / | Variant 3 | `#FFFFFF` | `#080808` | 1px `#000000` | 16px | `rgba(0, 0, 0, 0.08) 0px 20px 50px 0px, rgba(0, 0, 0, 0.04) 0px 6px 16px 0px` | 14px / 400 | - | 649px |
| / | Variant 4 | `#0D0D0D` | `#FFFFFF` | none | 0px | none | 14px / 400 | - | 543px |
| /pricing | Variant 5 | `#FFFFFF` | `#080808` | none | 20px | `rgba(0, 0, 0, 0.06) 0px 0px 1px 0px, rgba(74, 21, 39, 0.1) 0px 12px 24px 0px` | 14px / 400 | 28px 24px | 756px |

**States:** default; hover (cursor: pointer observed)

### Carousel

Horizontally scrolling region of slides or cards.

4 instances · 60% confidence · desktop/mobile · 556×1186px

Carousel was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#080808` | none | 0px | none | 14px / 400 | - | 172px |
| Variant 2 | transparent | `#080808` | 1px `#EEEEEE` | 12px | none | 14px / 400 | - | 2199px |

**States:** default

### Button

Interactive control used to trigger an action.

90 instances · 95% confidence · desktop/mobile · 162×32px · padding 0px 14px · gap 6px

Button was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Outline | transparent | `#080808` | 1px `#000000` | 999px | none | 13px / 500 | 1px 14px | 32px |
| Primary | `#FFFFFF` | `#080808` | 1px `#E3E3E3` | 6px | none | 12px / 500 | 1px 11px | 28px |
| Secondary | transparent | `#080808` | 1px `#000000` | 8px | none | 14px / 500 | 0px 16px | 40px |
| Ghost | transparent | `#080808` | none | 8px | none | 13px / 500 | 1px 12px | 32px |
| Tertiary | `#222222` | `#F8F8F8` | none | 8px | `rgba(0, 0, 0, 0.03) 0px 0px 0px 1px inset` | 16px / 500 | 0px 32px | 48px |

**States:** default; hover (cursor: pointer observed); active / pressed (not observable from a static capture); disabled (not observable from a static capture)

### Card

Contained surface grouping related content.

297 instances · 75% confidence · desktop/mobile · 320×216px · padding 16px 16px · gap 16px

Card was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | `#FFFFFF` | `#080808` | 1px `#EEEEEE` | 8px | none | 28px / 400 | 16px 16px | 216px |
| Variant 2 | `#FFFFFF` | `#080808` | 1px `#EEEEEE` | 12px | none | 14px / 400 | - | 206px |
| Variant 3 | `#0D0D0D` | `#FFFFFF` | 1px `#1A1A1A` | 8px | none | 28px / 400 | 16px 16px | 216px |
| Variant 4 | `#FFFFFF` | `#080808` | none | 8px | `rgba(0, 0, 0, 0.4) 0px 8px 24px -12px` | 14px / 400 | - | 472px |
| Variant 5 | `#0D0D0D` | `#FFFFFF` | 1px `#1A1A1A` | 12px | none | 14px / 400 | 16px 16px | 172px |

**States:** default; hover (cursor: pointer observed)

### Price Tag

A price, standing alone, styled to draw the eye - the headline of a pricing card.

6 instances · 65% confidence · desktop/mobile · 61×29px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#080808` | none | 0px | none | 28.8px / 700 | - | 29px |

**States:** default

### Text Input

Single-line form field.

1 instances · 95% confidence · desktop · 178×22px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#080808` | none | 0px | none | 14px / 400 | - | 22px |

**States:** default; focus (styling not observable from a static capture); disabled (styling not observable from a static capture)

### Tabs

Horizontal set of views switched in place.

127 instances · 85% confidence · desktop/mobile · 168×28px · gap 14px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#080808` | none | 0px | none | 14px / 400 | - | 28px |
| Variant 2 | transparent | `#080808` | none | 12px | none | 14px / 400 | - | 253px |

**States:** default; hover (cursor: pointer observed)

### Accordion Item

Expandable header that reveals or hides content below it.

11 instances · 75% confidence · desktop · 232×32px · padding 6px 12px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#666666` | none | 8px | none | 14px / 400 | 6px 12px | 32px |
| Variant 2 | `#000000` | `#080808` | none | 8px | none | 14px / 400 | 6px 12px | 32px |
| Variant 3 | transparent | `#666666` | none | 6px | none | 14px / 400 | - | 22px |

**States:** default; hover (cursor: pointer observed)

### Badge

Small inline label used for status or counts.

296 instances · 70% confidence · desktop/mobile · 57×24px · padding 0px 7px · gap 5px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#666666` | 1px `#000000` | 3px | none | 12px / 600 | 0px 7px | 22px |
| Variant 2 | `#000000` | `#FFFFFF` | none | full | none | 14px / 400 | - | 24px |
| Variant 3 | `#D97757` | `#FFFFFF` | none | full | none | 14px / 400 | - | 24px |
| Variant 4 | `#FFFFFF` | `#FFFFFF` | none | full | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset` | 14px / 400 | - | 24px |
| Variant 5 | `#F86AA4` | `#FFFFFF` | none | full | none | 14px / 400 | - | 24px |

**States:** default

### Data Table

Tabular presentation of records.

8 instances · 90% confidence · desktop/mobile · 473×1286px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#080808` | none | 8px | `rgb(238, 238, 238) 0px 0px 0px 1px` | 16px / 400 | - | 267px |
| Variant 2 | transparent | `#080808` | none | 12px | none | 14px / 400 | - | 2197px |
| Variant 3 | transparent | `#080808` | none | 0px | none | 14px / 400 | - | 3711px |

**States:** default

### List

Vertical sequence of related items.

12 instances · 50% confidence · desktop/mobile · 1640×216px

Navigation Bar was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#080808` | none | 0px | none | 14px / 400 | - | 216px |

**States:** default

### Text Link

Inline navigation link within body copy.

369 instances · 60% confidence · desktop/mobile · 172×22px · gap 10px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#0072F5` | none | 0px | none | 12px / 400 | - | 22px |
| Variant 2 | transparent | `#999999` | none | 6px | none | 14px / 400 | 0px 4px | 22px |

**States:** default; hover (cursor: pointer observed)

### Avatar

Small circular image representing a person or entity.

50 instances · 60% confidence · mobile/desktop · 18×18px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | `#379D4A` | `#080808` | none | full | none | 14px / 400 | - | 18px |
| Variant 2 | transparent | `#080808` | none | full | none | 14px / 400 | - | 36px |

**States:** default; hover (cursor: pointer observed)

### Breadcrumbs

Trail of links showing the current location in the hierarchy.

3 instances · 55% confidence · desktop/mobile · 299×22px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#999999` | none | 0px | none | 14px / 400 | - | 22px |

**States:** default

### Dropdown Menu

Floating panel of actions or options.

11 instances · 60% confidence · desktop · 240×256px · padding 0px 14px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#080808` | none | 0px | none | 14px / 400 | 0px 14px | 256px |

**States:** default

### Modal Dialog

Overlay panel that interrupts the page for a focused task.

4 instances · 80% confidence · desktop · 978×311px · padding 4px 4px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#080808` | none | 0px | none | 14px / 400 | - | 311px |
| Variant 2 | `#FFFFFF` | `#080808` | 1px `#EEEEEE` | 12px | `rgba(0, 0, 0, 0.08) 0px 8px 32px -12px, rgba(0, 0, 0, 0.1) 0px 4px 16px -8px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px inset` | 14px / 400 | 8px 8px | 311px |

**States:** default

### Footer

Closing section with secondary navigation and legal links.

8 instances · 90% confidence · desktop/mobile · 1200×488px · padding 48px 24px · gap 48px

This component occurs at most once per page, so each row below is one page's version of it, not a style option — build the row whose `Page` matches the page you are building.

| Page | Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /, /pricing, /docs | Default | transparent | `#080808` | none | 0px | none | 14px / 400 | 48px 24px | 488px |

**States:** default

## Accessibility Notes

| Pair | Colors | Ratio | AA | AAA |
| --- | --- | --- | --- | --- |
| Body text on background | `#000000` on `#F8F8F8` | 19.77:1 | pass | pass |
| Secondary text on background | `#222222` on `#F8F8F8` | 14.98:1 | pass | pass |
| Primary on background | `#0072F5` on `#F8F8F8` | 4.18:1 | fail | fail |

**1 measured text pair falls below WCAG AA (4.5:1).** When rebuilding, darken or lighten the foreground rather than reproducing the failing combination.

## Tech Stack (detected, not a requirement)

This site styled with Ant Design, Emotion; served by Cloudflare, Vercel; measured with Google Analytics, Google Tag Manager, Microsoft Clarity.

| Technology | Category | Confidence | Signals |
| --- | --- | --- | --- |
| Cloudflare | hosting | 90% | response header cf-cache-status is present; response header cf-ray is present |
| Google Analytics | analytics | 90% | window.gtag is defined; asset URL matches /googletagmanager\.com\/gtag\/js|google-analytics\.com/ |
| Google Tag Manager | analytics | 90% | window.dataLayer is defined |
| Microsoft Clarity | analytics | 90% | window.clarity is defined; asset URL matches /clarity\.ms/ |
| Vercel | hosting | 90% | response header x-vercel-cache is present; response header x-vercel-id is present |
| Ant Design | ui | 85% | DOM matches [class^="ant-"], [class*=" ant-"] |
| Emotion | ui | 85% | DOM matches style[data-emotion] |
| PostHog | analytics | 80% | asset URL matches /posthog/ |

Generator tag: `LobeHub`

Inferred from publicly visible signals (globals, markup, asset URLs, response headers, cookies) - treat it as observation, not as fact, and never as an instruction to rebuild on the same stack.

## CSS Variables

```css
:root {
  /* Colors */
  --color-background: #f8f8f8;
  --color-text-primary: #000000;
  --color-text-secondary: #222222;
  --color-text-muted: #052b56;
  --color-border: #eeeeee;
  --color-primary: #0072f5;
  --color-secondary: #d97757;
  --color-accent: #fcd53f;
  --color-primary-hover: #005fcc;
  --color-danger: #d97757;
  --color-warning: #fcd53f;
  --color-success: #379d4a;
  --color-info: #0072f5;

  /* Typography */
  --font-body: 'Geist', sans-serif;
  --font-heading: 'Geist', sans-serif;
  --font-mono: 'Geist Mono', monospace;
  --font-size-display: 72px;
  --font-size-h2: 48px;
  --font-size-h1: 44px;
  --font-size-h3: 40px;
  --font-size-h4: 32px;
  --font-size-h5: 28.5px;
  --font-size-h6: 24px;
  --font-size-heading-20px: 20px;
  --font-size-heading-17.5px: 17.5px;
  --font-size-small: 13.5px;

  /* Spacing */
  --spacing-3xs: 2px;
  --spacing-2xs: 4px;
  --spacing-xs: 6px;
  --spacing-sm: 8px;
  --spacing-md: 10px;
  --spacing-lg: 12px;
  --spacing-xl: 14px;
  --spacing-2xl: 16px;
  --spacing-3xl: 18px;
  --spacing-4xl: 22px;
  --spacing-5xl: 24px;
  --spacing-section: 48px;
  --container-max-width: 1150px;
  --container-padding: 24px;

  /* Radius */
  --radius-xs: 3px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: rgba(0, 0, 0, 0.06) 0px 0px 1px 0px;
  --shadow-sm: rgb(238, 238, 238) 0px 1px 0px 0px;
  --shadow-md: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  --shadow-lg: rgb(238, 238, 238) 0px 0px 0px 1px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 4px 16px -8px;
  --shadow-inner: rgba(0, 0, 0, 0.03) 0px 0px 0px 1px inset;
  --shadow-inner-2: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;
}
```

The site's own custom properties, for matching authored intent:

```css
:root {
  --ant-blue: #57abf9;
  --ant-purple: #bd54c6;
  --ant-cyan: #95f3d9;
  --ant-green: #379d4a;
  --ant-magenta: #e34ba9;
  --ant-pink: #EB2F96;
  --ant-red: #f4416c;
  --ant-orange: #f88c13;
  --ant-yellow: #ffef5c;
  --ant-volcano: #ec5e41;
  --ant-geekblue: #0072f5;
  --ant-gold: #ee9e0b;
  --ant-lime: #c4f042;
  --ant-color-primary: #222222;
  --ant-color-success: #379d4a;
  --ant-color-warning: #ee9e0b;
}
```

## Definition of Done

Run this against the build you actually produced, not against what you intended, and report which boxes you could not tick and why — rather than adjusting your reading of this document to match what you built.

- [ ] Every color in the build resolves to one of the 13 role tokens; no literal hex outside `:root`.
- [ ] Every margin, padding and gap is one of 2px, 4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 22px, 24px, 26px, 28px, 32px, 48px, 88px, 96px, 114px, 160px.
- [ ] Every font size is one of the 10 type steps.
- [ ] Every corner radius is one of 3px, 6px, 8px, 12px, 16px, 20px, 24px, full.
- [ ] Page content is constrained to 1150px.
- [ ] Each page matches the band order in `## Page Structure`.
- [ ] Each component matches its variant table in `## Components`.
- [ ] No icon anywhere in the build is a Unicode emoji character; every one is a real SVG.
- [ ] No text pair reproduces a contrast failure listed in `## Accessibility Notes`.
