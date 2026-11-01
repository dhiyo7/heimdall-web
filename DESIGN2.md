# Design System: wing-deck.com

> https://wing-deck.com/ · 5 page(s) · 2124 elements · 2026-09-19T18:02:46.746Z
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
- Use only what is defined below: 15 semantic color roles drawn from 16 palette colors, 11 type steps, 20 spacing steps, 7 radii and 7 shadow levels.
- Copy the `## CSS Variables` block to `:root` and reference tokens by name, never by literal value.
- Keep every size, gap and inset on the 2px grid: 2px, 4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 20px, 22px, 24px, 28px, 32px, 34px, 40px, 48px, 80px, 100px, 120px.
- Set all text in **-apple-system**, code and numerals in **ui-monospace**.
- Apply radii as measured: buttons 7px · cards 8px.
- Separate surfaces with borders (1px `#2B2E30`). This design uses borders over elevation.
- Constrain content to 1240px with 22px horizontal padding.
- Build in dark mode first; the palette below is the dark palette.
- Write your own neutral placeholder copy at the measured lengths and casing, and render a plain block at the measured aspect ratio where an image sits. Functional labels — navigation items, buttons, form labels — must read as real labels, never as lorem ipsum, because they carry the meaning of the interface.
- Build every icon as a real SVG — from the chosen stack's icon library where one is picked in `## Engineering Standards`, or inline SVG matched to what the reference screenshots show otherwise — sized and coloured to the token its surrounding element uses. Never substitute a Unicode emoji character (🔍, ⭐, 🏠, ...) for an icon: a screen reader announces one as a verbose pile of emoji names, not as the control it is meant to decorate, and it cannot be recoloured or resized to the measured token the way a real icon can.
- Hover styling was not observable in a static capture. `--color-primary-hover` (#FF9497) was derived from the measured primary by a lightness shift — use it for hover on primary controls without a sampled one. For focus, active, disabled, and any hover not sampled, derive from the tokens below (opacity, the measured border color, an existing surface) rather than introducing a new hue, and confirm against the live site.
- Use the 5 measured gradients in `### Gradients` where indicated; do not flatten them to a solid fill.
- Build the entry page's 27 bands exactly as listed in `## Page Structure`, in the same order, with the same composition and item count per band — that table is the structural blueprint, not background reading. Matching every token while getting the section order or count wrong is still a failed rebuild.
- Navigation Bar, Footer differ per page in `## Components`: build the row whose `Page` matches the page being built, rather than one version everywhere or an average of them.

**Don't**
- Do not invent a hex code, size, spacing value or radius that is not listed in this document. Tokens marked "derived" are the only sanctioned exception.
- Do not substitute a plausible value where one is missing. A missing value was not observable — ask instead. If there is nobody to ask, write `TODO(spec): <the exact value you need>` at the line that needs it, collect those in an `OPEN-QUESTIONS.md` at the repository root, and leave the property at its framework default rather than a value you designed. A marked gap is a correct build; a plausible invention that reads as measured is not.
- Do not copy the source markup, text content, imagery, icons or brand assets. Reproduce the visual language only.
- Do not reproduce the source brand name, logo or marketing copy, and do not invent a company identity, legal name or testimonial in their place.
- Do not turn this document's own measurement tables into visible page content. The figures in `## Content & Assets`, `## Cross-Page Consistency`, `## Accessibility Notes`, the palette's occurrence/painted-area columns and the `## Definition of Done` checklist describe how this document was measured, not something the source site displays — do not add a stats block, scorecard, checklist widget or dashboard section built from them unless a band in `## Page Structure` already calls for one.
- Do not add gradients, shadows, animation or effects that were not measured.
- Do not add, remove, merge, split or reorder the bands in `## Page Structure`, and do not change a band's composition (grid vs. row vs. stacked) or item count from what is listed there.
- Do not reorganize a band into a shape other than the one its `Composition` cell states — an "N-up row" or "stacked, N item(s)" builds as exactly one row or one stack of N, never wrapped into extra rows or grouped into columns of your own invention, however large N is. A menu's items that are only reachable by hovering, focusing or clicking a trigger are not part of that band's visible item count; build them as a genuinely hidden panel, not as additional always-visible rows.

_Caveats: no vision model ran, so all prose here is derived from measurements._

## Overview

A dark-scheme interface led by its 12 most-used colors and set in -apple-system / ui-monospace. Generated without a vision model.

**Inventory:** dark scheme · 40 colors · 4 font families · 11 type steps · 20 spacing steps · 7 radii · 7 shadow levels · 11 components · 5 pages

## Design Direction

Rebuild against the measured tokens below. The layout uses CSS grid for its primary structure. Content is constrained to 1240px.

- **Composition:** The entry page runs 14 band(s) top to bottom: a (stacked), then header (stacked), then section (3-col grid), then section (4-col grid, 4 item(s)), then section (2-col grid, 2 item(s)), then div (2-up row, gap 16px). 2 other page(s) were also outlined.
- **Hierarchy:** Hierarchy spans 11 type steps, from H1 at 112px to Body at 15px.
- **Density:** Spacing runs from 2px to 120px across 20 recurring steps.
- **Typography:** Typography is set in -apple-system and ui-monospace.
- **Color:** #FF6B70 carries interactive emphasis against a #08090A page surface. The most prominent band uses a gradient (rgba(224, 43, 51, 0.04) → rgba(8, 9, 10, 0.95)) rather than a flat fill.
- **Rhythm:** Corners settle around 7px; spacing and radius should be applied from the token tables.

**Keywords:** dark, grid-based, measured

## Color System

Scheme: **dark**.

### Semantic roles

| Role | Value | CSS variable |
| --- | --- | --- |
| Background | `#08090A` | `--color-background` |
| Surface | `#2B2E30` | `--color-surface` |
| Surface muted | `#212223` | `--color-surface-muted` |
| Text primary | `#FFFFFF` | `--color-text-primary` |
| Text secondary | `#E4FFEF` | `--color-text-secondary` |
| Text muted | `#FDE68A` | `--color-text-muted` |
| Border | `#111314` | `--color-border` |
| Primary | `#FF6B70` | `--color-primary` |
| Secondary | `#FDE68A` | `--color-secondary` |
| Accent | `#A62126` | `--color-accent` |
| Primary (hover, derived) | `#FF9497` | `--color-primary-hover` |
| Danger | `#FF6B70` | `--color-danger` |
| Warning | `#FDE68A` | `--color-warning` |
| Success | `#4FD18B` | `--color-success` |
| Info | `#BAE6FD` | `--color-info` |

### Palette (by painted area)

The semantic roles above are the API for this build: every color in the rebuilt interface should resolve to one of them. This table is the evidence those roles were derived from — an entry with no role is a color the source site paints somewhere the analysis could not assign a role to, not a spare color to reach for. Use one only where a band or component below names it, and otherwise ask - or record `TODO(spec): the role of <hex>` and leave it unused.

| Hex | Used as | Painted area | Occurrences |
| --- | --- | --- | --- |
| `#111314` | text, background, border | 83.9% | 194 |
| `#060708` | background | 6.7% | 28 |
| `#F1F2EF` | background | 2.6% | 2 |
| `#FFFFFF` | background, text | 1.4% | 1087 |
| `#1B150A` | background | 0.7% | 8 |
| `#A62126` | background | 0.5% | 24 |
| `#9B1E23` | background | 0.5% | 2 |
| `#78161A` | background | 0.5% | 2 |
| `#190C0D` | background | 0.5% | 3 |
| `#0D2118` | background | 0.4% | 13 |
| `#C5C8C8` | text | 0.3% | 377 |
| `#2B2E30` | border, background | 0.3% | 141 |
| `#0E1914` | background | 0.3% | 2 |
| `#0C171D` | background | 0.3% | 3 |
| `#163124` | background | 0.3% | 2 |
| `#9CA1A3` | text | 0.2% | 182 |

### Gradients

These bands are gradients, not solid fills - the stops above already list their colors individually, but do not use them as flat backgrounds where a gradient is named here. Build each one with the type and direction in its first column: a linear at the measured angle is not interchangeable with a radial, or with the same linear at another angle. Where a gradient carries no direction, the CSS default for its type applies (180deg for a linear).

| Type & direction | Stops | Used on | Occurrences |
| --- | --- | --- | --- |
| `radial-gradient`, circle at 50% 0px | `rgba(224, 43, 51, 0.04)` → `rgba(8, 9, 10, 0.95)` | section | 2 |
| `linear-gradient`, 135deg | `#9B1E23` → `#78161A` | section | 2 |
| `linear-gradient` | `rgba(24, 26, 28, 0.9)` → `rgba(14, 16, 17, 0.9)` | div | 2 |
| `radial-gradient`, circle at 90% 20% | `rgba(79, 209, 139, 0.2)` → `rgba(0, 0, 0, 0)` → `rgba(32, 116, 72, 0.22)` → `rgba(13, 16, 15, 0.94)` | aside | 2 |
| `linear-gradient`, 135deg | `rgba(224, 43, 51, 0.08)` → `rgba(10, 11, 12, 0.7)` | div | 2 |

## Typography

Base size **14px** · heading **-apple-system** · body **-apple-system** · mono **ui-monospace**.

### Families

| Family | Stack | Kind | Roles |
| --- | --- | --- | --- |
| -apple-system | `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif` | system | body, heading |
| ui-monospace | `ui-monospace, SFMono-Regular, Menlo, monospace` | system | mono |
| Arial | `Arial` | system | - |
| monospace | `monospace` | system | body, mono |

### Type scale

| Step | Size | Weight | Line height | Letter spacing | Observed on |
| --- | --- | --- | --- | --- | --- |
| H1 | 112px | 780 | 96.5px | normal | h1 |
| H2 | 50px | 730 | 52px | normal | h2 |
| Display | 48px | 760 | 52px | normal | h1 |
| H3 | 46px | 760 | 50.5px | -0.92px | h1 |
| H4 | 40px | 800 | 42px | -1.4px | span |
| H5 | 38px | 730 | 49px | -0.76px | h2 |
| H6 | 34px | 720 | 37px | -1.19px | h3, dd |
| Heading 32px | 32px | 800 | 33.5px | -1.12px | span |
| Heading 27px | 27px | 700 | 31px | normal | p, h3, h2 |
| Heading 23px | 23px | 700 | 37px | normal | h3, h2 |
| Body | 15px | 400 | 20px | -0.18px | a, span, button, p, strong, h4 |

Weights in use: 400, 600, 650, 680, 700, 720, 730, 740, 750, 760, 780, 800, 900.

## Spacing System

Base unit **2px**. Scale: 2px · 4px · 6px · 8px · 10px · 12px · 14px · 16px · 18px · 20px · 22px · 24px · 28px · 32px · 34px · 40px · 48px · 80px · 100px · 120px.

| Token | Value | Occurrences |
| --- | --- | --- |
| space-3xs | 2px | 51 |
| space-2xs | 4px | 273 |
| space-xs | 6px | 125 |
| space-sm | 8px | 107 |
| space-md | 10px | 277 |
| space-lg | 12px | 631 |
| space-xl | 14px | 128 |
| space-2xl | 16px | 76 |
| space-3xl | 18px | 123 |
| space-4xl | 20px | 180 |
| space-5xl | 22px | 151 |

container padding 22px · max width 1240px · section spacing 32px · gaps 5px, 6px, 8px, 10px, 12px, 16px, 18px, 24px.

## Border Radius

| Token | Value | Observed on |
| --- | --- | --- |
| radius-xs | 3px | span |
| radius-sm | 4px | span, code, button |
| radius-md | 6px | a, span, details, div |
| radius-lg | 7px | a, figure |
| radius-xl | 8px | a, article, div, img, aside, details |
| radius-2xl | 12px | div, section |
| radius-full | 9999px (full) | div, button, span, i, a |

Applied: cards 8px · buttons 7px · pill shapes present.

## Shadows

Surfaces are separated with **borders** more than shadows. Prefer hairline borders over elevation.

| Token | Value | Elevation | Type |
| --- | --- | --- | --- |
| shadow-xs | `rgba(0, 0, 0, 0.3) 0px 1px 3px 0px` | 2.5 | outset |
| shadow-sm | `rgba(79, 209, 139, 0.12) 0px 0px 28px 0px` | 14 | outset |
| shadow-md | `rgba(0, 0, 0, 0.4) 0px 8px 30px 0px` | 23 | outset |
| shadow-lg | `rgba(207, 48, 53, 0.16) 0px 10px 28px 0px` | 24 | outset |
| shadow-xl | `rgba(0, 0, 0, 0.3) 0px 8px 32px 0px` | 24 | outset |
| shadow-inner | `rgba(255, 255, 255, 0.035) 0px 1px 0px 0px inset` | 1 | inset |
| shadow-inner-2 | `rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset` | 1 | inset |

Borders: widths 1px · colors `#2B2E30`, `#FFFFFF`, `#4FD18B`, `#333638`, `#CF3035`.

## Layout

Each row is a measurement of the source layout to be applied to the rebuild. The container width and padding constrain the inner wrapper of every band whose `Content` cell in `## Page Structure` names a width; a band with a blank `Content` cell is full-bleed and takes no wrapper. The header and footer heights are the measured heights of those two bands. Whether the header is sticky, fixed or scrolls away was not observable in a static capture — do not pick one; mark it `TODO(spec):` and confirm against the live site.

| Property | Value |
| --- | --- |
| Container max width | 1240px |
| Container padding | 22px |
| Header height | 72px |
| Footer height | 431px |
| Uses CSS grid | yes |
| Uses flexbox | yes |
| Absolutely positioned blocks | 3 |
| Placement | CSS grid |
| Landmarks | header, nav, aside, main, hero, footer |

### Grid

Recurring `grid-template-columns`, fixed tracks normalized to `px`. Where a band in `## Page Structure` is marked a grid, build it with CSS `display: grid` and the template whose column count matches that band — not a flexbox approximation of one:

| Columns | Template | Occurrences |
| --- | --- | --- |
| 2 | `px px` | 49 |
| 3 | `px px px` | 11 |
| 4 | `px px px px` | 5 |
| 12 | `px px px px px px px px px px px px` | 1 |

Gaps in use: 5px, 6px, 8px, 10px, 12px, 16px, 18px, 24px. These are the only gap values measured on this site; do not introduce another.

## Page Structure

Top-level bands in document order - the structural blueprint, not a reference: build every band listed for a page, in this exact order, none skipped and none added. The vertical padding sets the page rhythm, `Content` is the width of the band's inner container (blank means full-bleed), and `Composition` is how its children are placed and how many of them there are. `Height` is what those values produced at the analyzed viewport - match the padding, composition and item count, not the height. The heading text identifies each band; it is not to be copied. The band count in each page heading below is the count to build.

### / — WingDeck Hub — Your desk, at your fingertips (27 band(s))

| # | Band | Heading | Padding Y | Content | Composition | Height |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `a` | - | 10px | - | stacked | 40px |
| 2 | `header` (header) | - | 0px | 1240px | stacked | 72px |
| 3 | `section` | WingDeck | 0px | 1240px | 3-col grid | 770px |
| 4 | `section` | - | 0px | - | 4-col grid, 4 item(s) | 76px |
| 5 | `section` | A second screen that earns its place. | 120px | - | 2-col grid, 2 item(s) | 1942px |
| 6 | `div` | What's New in WingDeck | 0px / 24px | - | 2-up row, gap 16px | 102px |
| 7 | `div` | - | 0px | - | 2-col grid, 6 item(s), gap 20px | 226px |
| 8 | `div` | - | 24px / 0px | - | 2-col grid, 2 item(s), gap 20px | 426px |
| 9 | `section` | Control that fits the moment. | 120px | 1240px | 2-col grid, 2 item(s) | 1703px |
| 10 | `section` | One quiet command center. | 120px | 1240px | 2-col grid, 2 item(s) | 1338px |
| 11 | `section` | Fast on your network. Direct over cable. | 120px | - | 2-col grid, 2 item(s), gap 96px | 541px |
| 12 | `section` | See WingDeck in Action | 100px | 1200px | 4-col grid | 1484px |
| 13 | `section` | Tested & Verified Devices | 60px / 80px | - | 2-col grid, 2 item(s) | 675px |
| 14 | `section` | Three steps.No IP addresses. | 120px | - | 2-col grid, 2 item(s), gap 104px | 596px |
| 15 | `div` | Download WingDeck for Your Devices | 0px | - | 2-col grid, 3 item(s) | 145px |
| 16 | `aside` (sidebar) | Real usage, shared openly. | 24px | - | 3-col grid, 3 item(s) | 133px |
| 17 | `div` | Desktop Apps & Legacy Packages Ready | 24px | 1182px | stacked, 3 item(s) | 178px |
| 18 | `div` | Desktop Apps for Windows & Mac | 0px | - | 3-col grid, 2 item(s) | 564px |
| 19 | `div` | Legacy Mobile Packages (Direct Sideload) | 0px | - | 3-col grid, 3 item(s) | 932px |
| 20 | `div` | Modern Mobile | 0px | - | 2-col grid, 3 item(s) | 610px |
| 21 | `div` | Support Independent Development | 32px | - | 2-up row, gap 32px | 216px |
| 22 | `div` | - | 28px | 1182px | stacked, 2 item(s) | 776px |
| 23 | `section` | Frequently Asked Questions | 60px / 80px | - | 2-col grid, 2 item(s) | 1015px |
| 24 | `section` | Help Keep WingDeck Free & Independent | 90px | - | 2-col grid, 3 item(s) | 877px |
| 25 | `section` | Important Disclaimers & Liability Limitations | 80px | 1240px | 2-col grid | 853px |
| 26 | `section` | Give every screen a purpose. | 56px | - | 2-up row, gap 32px | 200px |
| 27 | `footer` (footer) | - | 80px / 36px | 1240px | 2-col grid, 2 item(s) | 431px |

### /guides.html — Installation & Sideloading Guides — WingDeck (22 band(s))

| # | Band | Heading | Padding Y | Content | Composition | Height |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `header` (header) | - | 0px | 1240px | stacked | 72px |
| 2 | `header` (header) | Installation & Sideload Guides | 0px | - | stacked, 3 item(s) | 142px |
| 3 | `nav` (nav) | - | 0px | - | 4-up row, gap 10px | 38px |
| 4 | `span` | - | 4px | - | 0-up row, gap 6px | 27px |
| 5 | `h2` | - | 0px | - | stacked | 33px |
| 6 | `p` | - | 0px | - | stacked | 50px |
| 7 | `div` | - | 10px | - | 1-up row, gap 10px | 76px |
| 8 | `div` | - | 0px | - | 2-up row, gap 12px | 103px |
| 9 | `h3` | - | 0px | - | stacked | 28px |
| 10 | `ul` | - | 0px | - | stacked, 4 item(s) | 122px |
| 11 | `h3` | - | 0px | - | stacked | 28px |
| 12 | `p` | - | 0px | - | stacked | 50px |
| 13 | `ol` | - | 0px | - | stacked, 6 item(s) | 627px |
| 14 | `div` | - | 10px | - | stacked, 2 item(s) | 59px |
| 15 | `div` | - | 10px | - | stacked, 2 item(s) | 78px |
| 16 | `h3` | - | 0px | - | stacked | 28px |
| 17 | `ul` | - | 0px | - | stacked, 4 item(s) | 238px |
| 18 | `section` | Older Android APK Installation Guide | 32px | 814px | stacked, 7 item(s) | 673px |
| 19 | `section` | BlackBerry OS 7.1 Installation Guide (WingDeck Classic) | 32px | 814px | stacked, 8 item(s) | 813px |
| 20 | `section` | Desktop Companion Setup & Permissions Guide | 32px | 814px | stacked, 9 item(s) | 952px |
| 21 | `div` | - | 0px | 268px | stacked, centered | 48px |
| 22 | `footer` (footer) | - | 28px / 0px | - | 9-up row | 48px |

### /privacy — Privacy Policy — WingDeck (4 band(s))

| # | Band | Heading | Padding Y | Content | Composition | Height |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `header` (header) | - | 0px | 1240px | stacked | 72px |
| 2 | `header` (header) | Privacy Policy | 0px | - | stacked, 3 item(s) | 91px |
| 3 | `article` | Overview & Scope | 0px | - | stacked, 40 item(s) | 3349px |
| 4 | `footer` (footer) | - | 28px / 0px | - | 7-up row | 48px |

## Cross-Page Consistency

Compared 3 pages. Consistency score **40/100** (100 = every compared property matched across pages).

| Property | Severity | Observed values by page |
| --- | --- | --- |
| Button background | notable | /: #A62126; /guides.html: #08090A |
| Card radius | minor | /: 8px; /guides.html: 12px |
| Card background | notable | /: #101213; /guides.html: #181A1B |

## Content & Assets

Structural patterns only, across 3 analyzed page(s) - no text or images from the source site are reproduced here or anywhere in this document. Match the shape, not the substance.

| Signal | Value |
| --- | --- |
| Headings | avg 4.1 word(s), title case |
| Paragraphs | avg 23.3 word(s) |
| Images | 13 detected, 9 with alt text |
| Image shapes | 9 landscape, 4 square |
| Structured data | WebSite, SoftwareApplication, Offer, Organization, FAQPage, Question, Answer |
| Links | 74 internal, 27 external |

13 image(s) detected (predominantly landscape); 9 of 13 carry alt text. Generated without a vision model, so treatment (photography vs illustration) could not be assessed.

Headings average 4.1 word(s) in a title-case pattern; paragraphs average 23.3 word(s).

## Motion & Interaction

This site CSS transitions on 3 of 3 page(s).

| Properties | Duration | Easing |
| --- | --- | --- |
| transform | 1e-05s | ease |
| background, border-color | 1e-05s | ease |
| all | 1e-05s | ease |
| color | 1e-05s | ease |
| border-color, box-shadow, transform | 1e-05s | ease |
| transform, background, border-color, opacity | 1e-05s | ease |
| opacity, transform | 1e-05s | ease |
| transform, border-color, box-shadow | 1e-05s | ease |

These are the declared transition/animation timings and easing curves, measured from computed style - reproduce them on the properties named in the `Properties` column, which is where they were measured. Which element or interaction fires each one was not simulated, so do not guess a trigger: place a sample only where the property makes it unambiguous (a `background-color` transition on a hover, an `opacity`/`transform` pair on an entrance), and mark anything you cannot place `TODO(spec):` rather than inventing a choreography.

## Responsive Behavior

Captured: mobile, desktop. Layout changed at the captured widths 1440px; the real breakpoint sits between captured viewports.

### Measured differences

| Area | Observation | Desktop | Tablet | Mobile |
| --- | --- | --- | --- | --- |
| navigation | Navigation collapses into a menu toggle at mobile width. | 22 inline links | - | 3 inline links |
| columns | Grid column count reduces as the viewport narrows. | 12 columns | - | 2 columns |
| typography | Display headings scale down at narrower viewports. | 112px | - | 54px |
| container | Content container width adapts to the viewport. | 1240px | - | 320px |
| visibility | Some elements are hidden entirely at smaller viewports. | 1739 visible elements | - | 915 visible elements |
| columns | Band 3 (WingDeck) changes composition across viewports: 3-col grid at desktop, 2-up row at mobile. | 3-col grid | - | 2-up row |
| columns | Band 4 (`section`) changes composition across viewports: 4-col grid, 4 item(s) at desktop, 2-col grid, 4 item(s) at mobile. | 4-col grid, 4 item(s) | - | 2-col grid, 4 item(s) |
| columns | Band 5 (A second screen that earns its place.) changes composition across viewports: 2-col grid, 2 item(s) at desktop, stacked, 3 item(s), gap 24px at mobile. | 2-col grid, 2 item(s) | - | stacked, 3 item(s), gap 24px |
| columns | Band 6 (What's New in WingDeck) changes composition across viewports: 2-up row, gap 16px at desktop, stacked, 5 item(s), gap 16px at mobile. | 2-up row, gap 16px | - | stacked, 5 item(s), gap 16px |
| columns | Band 7 (`div`) changes composition across viewports: 2-col grid, 6 item(s), gap 20px at desktop, stacked at mobile. | 2-col grid, 6 item(s), gap 20px | - | stacked |
| columns | Band 8 (`div`) changes composition across viewports: 2-col grid, 2 item(s), gap 20px at desktop, stacked, 2 item(s) at mobile. | 2-col grid, 2 item(s), gap 20px | - | stacked, 2 item(s) |
| columns | Band 9 (Control that fits the moment.) changes composition across viewports: 2-col grid, 2 item(s) at desktop, stacked, 2 item(s) at mobile. | 2-col grid, 2 item(s) | - | stacked, 2 item(s) |
| columns | Band 10 (One quiet command center.) changes composition across viewports: 2-col grid, 2 item(s) at desktop, stacked, 2 item(s), gap 40px at mobile. | 2-col grid, 2 item(s) | - | stacked, 2 item(s), gap 40px |

### Type scaling

| Step | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| H1 | 112px | - | 54px |
| Body | 11px | - | 11px |

- Navigation collapses into a menu toggle at mobile width.
- Grid column count reduces as the viewport narrows.
- Display headings scale down at narrower viewports.
- Content container width adapts to the viewport.
- Some elements are hidden entirely at smaller viewports.
- Band 3 (WingDeck) changes composition across viewports: 3-col grid at desktop, 2-up row at mobile.
- Band 4 (`section`) changes composition across viewports: 4-col grid, 4 item(s) at desktop, 2-col grid, 4 item(s) at mobile.
- Band 5 (A second screen that earns its place.) changes composition across viewports: 2-col grid, 2 item(s) at desktop, stacked, 3 item(s), gap 24px at mobile.
- Band 6 (What's New in WingDeck) changes composition across viewports: 2-up row, gap 16px at desktop, stacked, 5 item(s), gap 16px at mobile.
- Band 7 (`div`) changes composition across viewports: 2-col grid, 6 item(s), gap 20px at desktop, stacked at mobile.
- Band 8 (`div`) changes composition across viewports: 2-col grid, 2 item(s), gap 20px at desktop, stacked, 2 item(s) at mobile.
- Band 9 (Control that fits the moment.) changes composition across viewports: 2-col grid, 2 item(s) at desktop, stacked, 2 item(s) at mobile.
- Band 10 (One quiet command center.) changes composition across viewports: 2-col grid, 2 item(s) at desktop, stacked, 2 item(s), gap 40px at mobile.

## Components

Specifications reconstructed from measured styles, not copies of the original markup.
`Confidence` reflects how reliable the detection heuristic is; below 70% is a guess worth checking.

### Navigation Bar

Primary site navigation anchored to the top of the page.

8 instances · 90% confidence · desktop/mobile · 725×72px

Navigation Bar was detected and its measured styles are listed in the Components section.

This component occurs at most once per page, so each row below is one page's version of it, not a style option — build the row whose `Page` matches the page you are building.

| Page | Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /, /guides.html, /privacy | Default | `#08090A` | `#F7F7F5` | none | 0px | none | 16px / 400 | - | 68px |
| /guides.html, /privacy | Variant 2 | transparent | `#F7F7F5` | none | 0px | none | 16px / 400 | - | 117px |

**States:** default

### Hero Section

Large introductory section at the top of the page.

2 instances · 70% confidence · desktop/mobile · 915×780px

Hero Section was detected and its measured styles are listed in the Components section.

This component occurs at most once per page, so each row below is one page's version of it, not a style option — build the row whose `Page` matches the page you are building.

| Page | Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | Default | `#111314` | `#F7F7F5` | none | 0px | none | 16px / 400 | - | 780px |

**States:** default

### Button

Interactive control used to trigger an action.

87 instances · 95% confidence · desktop/mobile · 221×48px · padding 0px 20px · gap 12px

Button was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Primary | `#A62126` | `#FFFFFF` | 1px `#000000` | 7px | none | 14px / 730 | 0px 20px | 48px |
| Secondary | `#08090A` | `#FFFFFF` | 1px `#FFFFFF` | 7px | none | 14px / 730 | 0px 20px | 48px |
| Tertiary | transparent | `#C8CBCC` | 1px `#2B2E30` | 999px | none | 13px / 600 | 8px 14px | 38px |
| Quaternary | transparent | `#FFFFFF` | 1px `#FFFFFF` | 8px | none | 13px / 700 | 8px 16px | 38px |
| Filled 5 | `#24975E` | `#E4FFEF` | 1px `#4FD18B` | 7px | `rgba(79, 209, 139, 0.12) 0px 0px 28px 0px` | 14px / 730 | 0px 20px | 48px |

**States:** default; hover (cursor: pointer observed); active / pressed (not observable from a static capture); disabled (not observable from a static capture)

### Card

Contained surface grouping related content.

139 instances · 75% confidence · desktop/mobile · 358×288px · padding 20px 18px · gap 20px

Card was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | `#101213` | `#F7F7F5` | 1px `#2B2E30` | 8px | none | 16px / 400 | 22px 22px | 258px |
| Variant 2 | `#0D0F11` | `#F7F7F5` | none | 12px | `rgba(0, 0, 0, 0.4) 0px 8px 30px 0px` | 16px / 400 | - | 524px |
| Variant 3 | `#181A1B` | `#F7F7F5` | 1px `#333638` | 8px | `rgba(255, 255, 255, 0.035) 0px 1px 0px 0px inset` | 16px / 400 | 32px 32px | 623px |
| Variant 4 | `#050606` | `#F7F7F5` | 1px `#FFFFFF` | 7px | none | 16px / 400 | - | 190px |
| Variant 5 | `#F59E0B` | `#F7F7F5` | 1px `#F59E0B` | 6px | none | 16px / 400 | 10px 12px | 85px |

**States:** default

### Price Tag

A price, standing alone, styled to draw the eye - the headline of a pricing card.

9 instances · 65% confidence · desktop/mobile · 135×34px

Price Tag was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#5BF3A4` | none | 0px | none | 40px / 800 | - | 34px |

**States:** default

### Badge

Small inline label used for status or counts.

144 instances · 70% confidence · desktop/mobile · 79×27px · padding 4px 9px · gap 2px

Badge was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#C8CBCC` | 1px `#2B2E30` | 4px | none | 11px / 650 | 4px 9px | 27px |
| Variant 2 | transparent | `#C8CBCC` | 1px `#FFFFFF` | 6px | none | 11px / 750 | - | 28px |
| Variant 3 | `#CF3035` | `#FF6B70` | 1px `#CF3035` | 4px | none | 10px / 800 | 4px 10px | 26px |
| Variant 4 | `#FFFFFF` | `#C8CBCC` | none | 4px | none | 10px / 800 | 4px 10px | 24px |
| Variant 5 | `#FFFFFF` | `#C8CBCC` | 1px `#2B2E30` | 4px | none | 11px / 400 | 2px 6px | 20px |

**States:** default

### Data Table

Tabular presentation of records.

3 instances · 90% confidence · desktop/mobile · 1182×646px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#F7F7F5` | none | 0px | none | 13px / 400 | - | 646px |

**States:** default

### List

Vertical sequence of related items.

53 instances · 50% confidence · desktop/mobile · 342×235px · padding 0px 10px · gap 12px

Navigation Bar was detected and its measured styles are listed in the Components section.

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#F7F7F5` | none | 0px | none | 16px / 400 | 0px 10px | 235px |

**States:** default

### Text Link

Inline navigation link within body copy.

150 instances · 60% confidence · desktop/mobile · 140×20px · gap 6px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#C8CBCC` | none | 0px | none | 13px / 600 | - | 20px |

**States:** default; hover (cursor: pointer observed); underlined

### Avatar

Small circular image representing a person or entity.

9 instances · 60% confidence · desktop/mobile · 42×42px

| Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Default | transparent | `#D6D9D9` | 1px `#474B4D` | full | none | 10px / 780 | - | 42px |

**States:** default

### Footer

Closing section with secondary navigation and legal links.

7 instances · 90% confidence · desktop/mobile · 1440×66px · padding 14px 0px

This component occurs at most once per page, so each row below is one page's version of it, not a style option — build the row whose `Page` matches the page you are building.

| Page | Variant | Background | Text | Border | Radius | Shadow | Font | Padding | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /guides.html, /privacy | Default | transparent | `#7F8486` | none | 0px | none | 12px / 400 | 14px 0px | 57px |
| / | Variant 2 | `#060708` | `#9CA1A3` | none | 0px | none | 16px / 400 | 58px 100px | 431px |

**States:** default

## Accessibility Notes

| Pair | Colors | Ratio | AA | AAA |
| --- | --- | --- | --- | --- |
| Body text on background | `#FFFFFF` on `#08090A` | 19.93:1 | pass | pass |
| Secondary text on background | `#E4FFEF` on `#08090A` | 18.84:1 | pass | pass |
| Body text on surface | `#FFFFFF` on `#2B2E30` | 13.67:1 | pass | pass |
| Primary on background | `#FF6B70` on `#08090A` | 7.2:1 | pass | pass |

All measured text pairs meet WCAG AA (4.5:1).

## Tech Stack (detected, not a requirement)

This site served by Cloudflare.

| Technology | Category | Confidence | Signals |
| --- | --- | --- | --- |
| Cloudflare | hosting | 90% | response header cf-cache-status is present; response header cf-ray is present |

Inferred from publicly visible signals (globals, markup, asset URLs, response headers, cookies) - treat it as observation, not as fact, and never as an instruction to rebuild on the same stack.

## CSS Variables

```css
:root {
  /* Colors */
  --color-background: #08090a;
  --color-surface: #2b2e30;
  --color-surface-muted: #212223;
  --color-text-primary: #ffffff;
  --color-text-secondary: #e4ffef;
  --color-text-muted: #fde68a;
  --color-border: #111314;
  --color-primary: #ff6b70;
  --color-secondary: #fde68a;
  --color-accent: #a62126;
  --color-primary-hover: #ff9497;
  --color-danger: #ff6b70;
  --color-warning: #fde68a;
  --color-success: #4fd18b;
  --color-info: #bae6fd;

  /* Typography */
  --font-body: '-apple-system', sans-serif;
  --font-heading: '-apple-system', sans-serif;
  --font-mono: 'ui-monospace', monospace;
  --font-size-h1: 112px;
  --font-size-h2: 50px;
  --font-size-display: 48px;
  --font-size-h3: 46px;
  --font-size-h4: 40px;
  --font-size-h5: 38px;
  --font-size-h6: 34px;
  --font-size-heading-32px: 32px;
  --font-size-heading-27px: 27px;
  --font-size-heading-23px: 23px;
  --font-size-body: 15px;

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
  --spacing-4xl: 20px;
  --spacing-5xl: 22px;
  --spacing-section: 32px;
  --container-max-width: 1240px;
  --container-padding: 22px;

  /* Radius */
  --radius-xs: 3px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 7px;
  --radius-xl: 8px;
  --radius-2xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: rgba(0, 0, 0, 0.3) 0px 1px 3px 0px;
  --shadow-sm: rgba(79, 209, 139, 0.12) 0px 0px 28px 0px;
  --shadow-md: rgba(0, 0, 0, 0.4) 0px 8px 30px 0px;
  --shadow-lg: rgba(207, 48, 53, 0.16) 0px 10px 28px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.3) 0px 8px 32px 0px;
  --shadow-inner: rgba(255, 255, 255, 0.035) 0px 1px 0px 0px inset;
  --shadow-inner-2: rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset;
}
```

The site's own custom properties, for matching authored intent:

```css
:root {
  --lightningcss-dark: initial;
  --ink: #08090a;
  --ink-soft: #0c0d0e;
  --surface: #101213;
  --surface-raised: #161819;
  --surface-bright: #1d2021;
  --line: #2b2e30;
  --line-soft: #ffffff1a;
  --text: #f7f7f5;
  --muted: #9ca1a3;
  --muted-strong: #c8cbcc;
  --paper: #f1f2ef;
  --paper-muted: #626769;
  --red: #a62126;
  --red-bright: #cf3035;
  --green: #4fd18b;
}
```

## Definition of Done

Run this against the build you actually produced, not against what you intended, and report which boxes you could not tick and why — rather than adjusting your reading of this document to match what you built.

- [ ] Every color in the build resolves to one of the 15 role tokens; no literal hex outside `:root`.
- [ ] Every margin, padding and gap is one of 2px, 4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 20px, 22px, 24px, 28px, 32px, 34px, 40px, 48px, 80px, 100px, 120px.
- [ ] Every font size is one of the 11 type steps.
- [ ] Every corner radius is one of 3px, 4px, 6px, 7px, 8px, 12px, full.
- [ ] Page content is constrained to 1240px.
- [ ] Each page matches the band order in `## Page Structure`.
- [ ] Each component matches its variant table in `## Components`.
- [ ] No icon anywhere in the build is a Unicode emoji character; every one is a real SVG.
- [ ] All text pairs still meet WCAG AA after any color substitution.
