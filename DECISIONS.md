# Decision log

Judgment calls made during the UI redesign. Newest first.

## 2026-07-21 — Redesign foundation

### Tokens land under `theme.extend`, additive (not a replace)
The repo runs Tailwind v3.4.3 with a config file, so tokens go under
`theme.extend`. The existing `brand.*`, `status.*`, `surface.*` scales and the
`Inter`/`JetBrains Mono` families stay in place: screens migrate one commit at a
time, and nothing is allowed to break mid-flight. The redesign palette lives in a
new `fs.*` namespace, the CSS custom properties and the `.fs-chip` / `.fs-money`
component classes are ported into `src/index.css` verbatim from
`design/tokens.css`, and `Archivo` + `IBM Plex Mono` are added to the font link
without removing the incumbent faces. `body` adopts Archivo via
`--fs-font-ui`; that only changes the rendered face, not any class.

### Contrast: one spec pair failed, darkened to the nearest passing step
Computed WCAG 2.x ratios for every small-text pair the spec uses (status chips on
their grounds, inline type tags, neutral text on white and on `bg-100`, text on
the navy header and sidebar, money accents, and the print values). 29 of 30 pairs
clear 4.5:1, matching the spec's claim. The one miss:

| Usage | Pair | Ratio | Result |
|---|---|---|---|
| Muted mono meta text ("autosaved…", "gal @ $19.80", VIN, "due Aug 16") | `#75858F` on `#FFFFFF` | **3.81:1** | FAIL |

`#75858F` is defined in `tokens.css` only as `--fs-draft-dot` — a dot, which is
non-text and needs 3:1 (it clears that). The reference *canvas* reused the same
hex for small meta text, where 4.5:1 applies. Fix: keep `#75858F` for dots, and
add a compliant tertiary text tier `--fs-ink-450: #6A7883` (**4.54:1** on white,
the nearest darker step that passes) for that muted-text role. The neutral text
ramp is now ink-900 → ink-600 → ink-500 → ink-450, all AA.

Full lowest-margin pairs for the record: paid chip `#FFFFFF/#147A3D` 5.41:1,
caption `#66757F/#FFFFFF` 4.76:1, ink-450 `#6A7883/#FFFFFF` 4.54:1. All ≥ 4.5:1.
