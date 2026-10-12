---
name: FleetServ
description: Scheduled fleet maintenance on a tablet. Neutral canvas, navy structure, one teal accent, one functional red.

# Colors carry the shadcn-semantic slug names. Values are OKLCH (sRGB hex
# equivalents are in the sidecar tokens.css beside each token). Light mode is
# the normative source here; the dark values live in tokens.css, which the
# app ships as a Light, Dark, or System choice.
canonical-canvas: light

colors:
  background: "oklch(0.9654 0.0042 236.50)"
  foreground: "oklch(0.2495 0.0277 244.76)"
  card: "oklch(1.0000 0.0000 0.00)"
  card-foreground: "oklch(0.2495 0.0277 244.76)"
  popover: "oklch(1.0000 0.0000 0.00)"
  popover-foreground: "oklch(0.2495 0.0277 244.76)"
  primary: "oklch(0.4606 0.0903 169.64)"
  primary-foreground: "oklch(1.0000 0.0000 0.00)"
  secondary: "oklch(0.9135 0.0181 245.40)"
  secondary-foreground: "oklch(0.2765 0.0519 246.66)"
  muted: "oklch(0.9611 0.0093 242.84)"
  muted-foreground: "oklch(0.4919 0.0246 241.76)"
  accent: "oklch(0.4606 0.0903 169.64)"
  accent-foreground: "oklch(1.0000 0.0000 0.00)"
  destructive: "oklch(0.4010 0.1202 21.88)"
  destructive-foreground: "oklch(1.0000 0.0000 0.00)"
  border: "oklch(0.8970 0.0112 243.67)"
  input: "oklch(0.8145 0.0175 242.48)"
  ring: "oklch(0.3812 0.0733 245.23)"
  chart-1: "oklch(0.2765 0.0519 246.66)"
  chart-2: "oklch(0.5210 0.0797 247.91)"
  chart-3: "oklch(0.4606 0.0903 169.64)"
  chart-4: "oklch(0.9135 0.0181 245.40)"
  chart-5: "oklch(0.5509 0.1298 22.27)"
  sidebar: "oklch(0.2164 0.0369 248.45)"
  sidebar-foreground: "oklch(0.9611 0.0093 242.84)"
  sidebar-primary: "oklch(0.6932 0.1247 174.42)"
  sidebar-primary-foreground: "oklch(0.2164 0.0369 248.45)"
  sidebar-accent: "oklch(0.3812 0.0733 245.23)"
  sidebar-accent-foreground: "oklch(1.0000 0.0000 0.00)"
  sidebar-border: "oklch(0.3812 0.0733 245.23)"
  sidebar-ring: "oklch(0.8389 0.0811 176.90)"

typography:
  display:
    fontFamily: "var(--font-sans)"
    fontSize: "clamp(1.75rem, 1rem + 2.5vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.15
  heading:
    fontFamily: "var(--font-sans)"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "var(--font-sans)"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "var(--font-sans)"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-sans)"
    fontSize: "0.85rem"
    fontWeight: 600
    letterSpacing: "0em"
  mono:
    fontFamily: "var(--font-mono)"
    fontSize: "0.95rem"
    fontWeight: 500

rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "20px"

spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "999px"
    padding: "0 1.375rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label}"
    rounded: "999px"
    padding: "0 1.375rem"
    height: "52px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "0.875rem 1rem"
  input-text:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.75rem 0.875rem"
    height: "52px"
  nav-link:
    textColor: "{colors.secondary}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.sidebar-primary}"
---

# Design System: FleetServ

Adopted from exploration candidate B4 (Route Tablet, 60-30-10, with the round 5 logo pill). `tokens.css` at the repo root is the token source for this file and for the app.

**Where the app stands.** The dark theme ships as described here. The light theme is being moved over screen by screen: until a screen is restyled it keeps its earlier values for the primary button (navy-900), the status chips (blue for quoted and sent, ochre for invoiced, green for approved and paid), a 10px medium radius, 16px body text, and a light card shadow. `tokens.css` carries both: the semantic tokens below, and the `--fs-*` names the app reads today.

## 1. Overview: The Route Tablet

**Creative North Star: "One neutral page, one navy frame, one teal action."**

FleetServ is used by a mobile fleet maintenance business on a tablet in daylight and by the office on a laptop. The system is built for that: a clean neutral canvas that stays readable in glare, large targets a gloved thumb can hit, and a strict color budget so the one thing that needs a tap is the one thing in teal. Navy is the frame of the product: the header band, the sidebar, the money tiles, the report header, the selected card, and the quiet progress states. Teal is the action: primary buttons, the active nav marker, and the "done" states (approved, paid, pass). Everything else is neutral.

The rule is 60-30-10 with four colors total. Sixty percent neutral (app background, white surfaces, ink text, line grays). Thirty percent navy, one hue in its existing steps, carrying structure. Ten percent teal, the only accent, kept off decorative surfaces so it stays scarce. Plus one functional red that is a signal, not a brand color: overdue, fail, danger. Measured on the approved screens at wide width, the light theme lands at roughly 67 percent neutral, 32 percent navy (solid bands plus navy tints), 1 percent teal, and under 1 percent red; teal is under its ceiling by design.

FleetServ explicitly rejects: a second accent hue (no amber, no sand, no bright blue), teal on light surfaces as text or as a white-text fill, status carried by color alone, colored money, and decorative gradients or glows.

**Key Characteristics:**
- Neutral canvas: app background with white cards and rows on a navy-50 tint, ink text, hairline grays.
- Navy as structure: navy-900 header and report bands, navy-950 sidebar, navy-900 and navy-100 money tiles, navy-900 selected outline, navy outline secondary buttons.
- Teal as the single accent: deep teal for fills and text on light, teal-500 only on navy, teal-200 only as an outline on navy.
- Status chips in two families: draft, quoted, and invoiced in neutral and navy; approved and paid in teal; overdue in red. Dot plus label, always.
- Money is ink, mono, tabular, right-aligned; state lives in the chip, never in the number.
- 44px minimum tap target, 52px primary buttons and inputs, 14px card radius, pill buttons and chips, no shadows.
- Dark mode is a choice in the account menu (Light, Dark, or System, which follows the device): navy-950 ground, navy-900 cards, navy-800 and navy-700 bands and chips, teal-500 accent with navy-950 text. Documents and print stay light.

## 2. Colors: Neutral, Navy, Teal, Red

### Role map

| Share | Role | Tokens (light) | Used for | Not used for |
|---|---|---|---|---|
| 60 | Neutral | `--background` #f1f4f6, `--card` #ffffff, `--foreground` #16232e, `--muted-foreground` #55636e, `--border` #d7dee4, `--input` #b9c4cd, draft chip #e9edf1 / #3e4e5b / #75858f | page canvas, cards, body text, hairlines, input borders, the draft state, every money figure | emphasis of any kind |
| 30 | Navy | `--sidebar` #0b1b2a, `--structure` and `--selected` and `--outline` #102a40, `--secondary` #d9e4ee, `--muted` #edf3f8, quoted chip #d6e7f8 / #1c4667 / #426d95, invoiced chip #102a40 / #ffffff / #d9e4ee, `--ring` #1c4667 | header band, report header band, sidebar, unpaid and open-quotes tiles, list rows and meta on the navy-50 tint, selected card outline, secondary button outline and text, focus ring, quoted and invoiced states, "needs attention" markers with their icon and text | primary buttons, success or done states |
| 10 | Teal | `--primary` and `--accent` #046850 (deep teal), `--sidebar-primary` and `--accent-on-structure` #22b597 (teal-500), `--sidebar-ring` #8fdcc9 (teal-200), approved chip #cff6e7 / #005c45 / #046850, paid chip #046850 / #ffffff / #8fdcc9 | New visit, Send invoice, the active nav underline on the navy band, approved and paid, pass and done, the brand mark on navy, the logo pill outline | section backgrounds, decorative fills, text on light surfaces other than the deep teal step, borders on white |
| signal | Red | `--destructive` #7c2529, overdue chip #f8e2e0 / #7c2529 / #b14e4e, chart-5 #b14e4e | overdue, the failing inspection row and its Fail segment, destructive actions | attention that is not an error, branding, charts other than the error series |

### Primary
- **Deep teal** (`--primary`, #046850): the one action color on light surfaces. White text on it reads at 6.79:1. It is also the paid chip fill and the approved chip dot, so action and completion share one color.
- **Teal-500** (`--sidebar-primary`, #22b597): the brand teal. It appears only on navy: the mark, the active nav underline on the header band, the approved chip when it has to live on the navy report header (teal-500 fill with navy-950 text, 6.75:1), and, in the proposed dark theme, primary buttons and the paid chip with navy-950 text.
- **Teal-200** (`--sidebar-ring`, #8fdcc9): outline only, on navy. The logo pill border and the dark focus ring.

### Neutral
- `--background` #f1f4f6 is the app floor; `--card` #ffffff carries cards, the quote sheet, and rows; `--muted` #edf3f8 (navy-50) carries list rows, meta blocks, inspection rows, and form tiles inside a card.
- `--foreground` #16232e for all primary text and all money; `--muted-foreground` #55636e for secondary text (5.6:1 on the app background, 7.4:1 on white).
- `--border` #d7dee4 hairlines; `--input` #b9c4cd input borders and strong rules.

### Navy structure
- `--structure` #102a40 (navy-900) with white text for the header band, the report header band, and the unpaid money tile. `--secondary` #d9e4ee (navy-100) with navy-900 text for the open-quotes tile, the technician avatar, and the invoiced chip dot.
- `--sidebar` #0b1b2a (navy-950) for the logo pill and, where a sidebar exists, the sidebar; `--sidebar-accent` #1c4667 (navy-700) for the active sidebar row, with the teal-500 inset rule.
- `--selected` and `--outline` #102a40 for the selected card ring and secondary button outlines.

### State
- Draft: neutral chip #e9edf1 ground, #3e4e5b text, #75858f dot (7.30:1).
- Quoted: navy tint #d6e7f8 ground, navy-700 #1c4667 text, navy-600 #426d95 dot (7.84:1).
- Invoiced: solid navy-900 #102a40, white text, navy-100 dot (14.71:1). The only solid navy chip; it pairs with the navy unpaid tile.
- Approved: teal tint #cff6e7 ground, #005c45 text, deep teal dot (6.88:1).
- Paid: solid deep teal #046850, white text, teal-200 dot (6.79:1). The only solid teal chip.
- Overdue: #f8e2e0 ground, #7c2529 text, #b14e4e dot (7.90:1).
- Inspection Pass uses the approved chip colors; Fail uses `--destructive` with white text (9.79:1).

### Dark
- Ground `--background` navy-950 #0b1b2a; cards `--card` navy-900 #102a40; popovers, bands, and the draft, approved, and overdue chip grounds navy-800 #17364f; `--border` navy-700 #1c4667; `--input` #6a8aa6.
- Text `--foreground` navy-50 #edf3f8 (13.2:1 on a card); `--muted-foreground` #b9c4cd (8.3:1). Links are navy-300 #93b5d6 (6.9:1 on a card).
- `--primary` teal-500 with navy-950 text (6.8:1); `--ring` teal-200 #8fdcc9 (9.3:1 on a card); `--destructive` #b14e4e backs white text (5.2:1).
- Chips: draft navy-800 with navy-50 text; quoted navy-700 with navy-50 text; approved navy-800 with teal-200 text; invoiced solid navy-100 with navy-950 text; paid solid teal-500 with navy-950 text; overdue navy-800 with #eda9a8 text and a #cc6664 dot (3.4:1, so the dot clears the 3:1 non-text floor).
- The sidebar and the ground are both navy-950 in dark, so the sidebar takes a 1px navy-800 edge.

### Chart
- `--chart-1` navy-900, `--chart-2` navy-600, `--chart-3` deep teal, `--chart-4` navy-100, `--chart-5` red. Series follow the same budget: navy steps first, teal for the positive series, red only for the error series.

**The Teal-on-Navy Rule.** Teal-500 and teal-200 appear only on navy grounds. On white or the app background, teal is the deep step (#046850 fills, #005c45 text) or it is not there.

**The Money Rule.** Every dollar figure, VIN, unit number, quote or invoice number, and table date is ink-colored, mono, tabular, and right-aligned when in a column. State lives in the labeled chip beside it, never in the number.

**The Chip Rule.** A status is a ground, a text color, a dot, and a label. The label and the dot always render; color is the third cue, never the only one.

**The Paper Rule.** A quote, invoice, or service report is paper in either theme. The on-screen document stays light inside a dark page, and print and PDF output are always light.

## 3. Typography: Archivo and IBM Plex Mono

Two faces, both already loaded by the app. Archivo (`--font-sans`) is the UI voice: headings, body, labels, buttons, chips. IBM Plex Mono (`--font-mono`) carries money, IDs, VINs, plates, quote and invoice numbers, and dates in tables, with `font-variant-numeric: tabular-nums` so columns stay aligned as digits change. Display and heading share the sans; there is no serif in the product.

The body size is 17px with 1.5 leading, a step above the usual 16px because the primary reader is on a tablet at arm's length, often outdoors. Headings are 700 weight with slightly tight tracking (about -0.015em on the page title, 0 elsewhere). Weights in use: 400, 600, 700; nothing else.

**Hierarchy:**
- Display: clamp(1.75rem, 1rem + 2.5vw, 2.75rem), 700, 1.15. Rare; cover-style surfaces only.
- Heading: 1.625rem, 700, 1.15. The page title ("Jobs").
- Title: 1.25rem, 700, 1.2. Card and report titles.
- Body: 17px, 400, 1.5. Everything a technician reads.
- Label: 0.85rem, 600. Chip text, section labels, meta keys, nav links.
- Mono: 0.95rem to 1.2rem, 500 to 700. Money and identifiers; the row amount is 1.2rem 700.

**The Tablet Body Rule.** Body stays at 17px and never drops below 0.85rem for any text a technician must read in the field.

**The Mono Scope Rule.** Mono is for values with fixed width meaning: money, IDs, VINs, dates in tables. It is never used for prose, labels, or buttons.

## 4. Elevation: Flat, with Tint and Outline

There are no shadows. Depth comes from three surfaces and two outlines: the app background, white cards, and the navy-50 tint for rows inside cards; a 1px `--border` hairline on cards; a 1px navy-900 ring (`--selected`) on the selected card. Bands (header, report header, money tiles) are solid navy and need no edge. Focus is a 2px `--ring` outline with 2px offset.

**The No-Shadow Rule.** Cards, buttons, and chips are flat. If a surface needs separation, change its tint or add a hairline; never add a shadow or a glow.

## 5. Components

### Buttons
- Primary: deep teal fill, white text, pill radius, 52px tall, 700 weight. Dark: teal-500 fill with navy-950 text. One primary per screen region (New visit on the jobs list, Send invoice on the report).
- Secondary: transparent, 1.5px navy-900 outline (`--outline`) and navy-900 text, same size and shape. Dark: navy-100 outline and text. Download PDF, Export week.
- Destructive: `--destructive` fill with white text, same shape; used only for actions that remove or void.
- Minimum tap target 44px; primary and inputs 52px.

### Chips
- Pill, 0.8rem 700 text, 8px dot before the label, padding 4px 10px 4px 8px. Six states as in section 2. The approved chip on a navy band flips to teal-500 fill with navy-950 text and dot.

### Cards and Containers
- Card: white, 14px radius, 1px hairline, 14px 16px padding, 72px minimum row height for tappable rows. Selected: navy-900 border plus 1px inset ring.
- Rows inside a card (service items, inspection rows, meta grid, form tiles): navy-50 tint, 12px radius, no border.
- Bands: header and report header on navy-900 with white text and navy-100 secondary text; the money tiles on navy-900 (unpaid) and navy-100 (open quotes), 14px radius.

### Inputs and Controls
- Inputs: white, 1px `--input` border, 12px radius, 52px tall, 16px or larger text so tablets do not zoom. Focus ring navy-700.
- Segmented filter (All, To bill, Waiting, Drafts): navy-50 track, white pressed segment, pill shape, 40px tall.
- Theme control (account menu): three segments, Light, Dark, and System, each with an icon and a label, on a navy-50 track; the current choice is the pressed segment (navy-900 with white text; in dark, navy-100 with navy-950 text). Segments are 44px tall and reachable with the arrow keys.
- Pass / Fail segment: navy-50 track; the current value takes the approved colors (teal tint, teal text) or the destructive fill (red, white text).

### Navigation
- Wide: a navy-900 header band with the logo pill, nav links in navy-100 text, the active link in teal-500 with a 2px teal-500 underline, and the technician avatar on navy-100.
- Phone: a sticky bottom tab bar on white with a hairline top; the active tab is deep teal text and icon.
- Where a sidebar exists (office layouts): navy-950 ground, navy-50 text, navy-100 secondary text, active row on navy-700 with a 3px teal-500 inset rule.

### Logo pill
- The brand mark (two 16-degree skewed bars, geometry unchanged from `design/video/assets/fleetserv-bars.svg`) plus the wordmark sit in a pill on the navy header: `--brand-pill` navy-950 ground, `--brand-pill-border` 1px teal-200, white wordmark, padding 6px 16px 6px 10px, pill radius. The first bar is teal-500, the second is navy-50. The pill exists so both bars read on the navy band in light and dark; on white surfaces (documents, PDFs) the mark is used without the pill, with the second bar in navy-900.

### Chart palette
- Navy-900, navy-600, deep teal, navy-100, red, in that order. Positive series take teal; error series take red; everything else is a navy step.

## 6. Do's and Don'ts

**Do:**
- Keep the budget: neutral canvas, navy frame, teal action, red error. If a new element needs a color, give it a role from this list first.
- Put teal-500 and teal-200 on navy only. On white, use deep teal #046850 for fills and #005c45 for text.
- Make the primary action teal and everything beside it a navy outline.
- Render every status as dot plus label plus ground; keep draft, quoted, and invoiced in neutral and navy, approved and paid in teal, overdue in red.
- Keep money, IDs, VINs, and table dates in ink and IBM Plex Mono with tabular numerals.
- Keep tap targets at 44px or more and primary controls at 52px.
- Use the logo pill on navy bands; use the bare mark on paper.
- Keep the three-path token contract in `tokens.css` (light `:root`, explicit `[data-theme="dark"]`, and the `prefers-color-scheme` path for System), and check every new pair in both themes.
- Keep documents and print light, whatever theme the viewer chose.

**Don't:**
- Don't add a new hue without a role. No amber, sand, bright blue, or second green; attention that is not an error is navy plus an icon and text.
- Don't use teal-500 as text on light, or white text on teal-500 anywhere; it fails contrast.
- Don't color a dollar figure. State lives in the chip.
- Don't carry a status by color alone; the dot and label always render.
- Don't put shadows, glows, or gradients on cards, buttons, chips, headings, or metrics.
- Don't make a navy button primary; navy is structure, teal is action.
- Don't drop body text below 17px or label text below 0.85rem on technician screens.
- Don't invent business identity for documents (no license numbers, bank numbers, or addresses the app does not store).
- Don't let a dark choice reach paper: no dark quote, invoice, report, or print.
