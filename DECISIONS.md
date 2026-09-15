# Decision log

Judgment calls made during the UI redesign. Newest first.

## 2026-07-21 — Print treatment

### Hairlines darken via a scoped print rule, not just the token
The token override `--fs-line-200: #9AA5AD` only reaches styles that read the CSS
variable, but the artifact draws its hairlines with Tailwind's static
`border-fs-line-200`. So the print block adds a scoped rule,
`.fs-doc [class*="border-fs-line-200"] { border-color:#9AA5AD !important }`, plus
`print-color-adjust: exact` so the navy rules, total bars, and PAID stamp survive
the browser's default background stripping. The `.fs-doc` card drops its border,
radius, shadow, and padding in print; `@page` (Letter, 0.75in) owns the margins.

### Remit block states no bank numbers
Invoices swap in a print-only PAYMENT + QUESTIONS block; quotes swap in an
APPROVED BY / DATE signature line (board 1g). Consistent with the C4 call, the
remit says "Check payable to FleetServ Hawaii" and "reference the number with
payment" and invents no ACH routing or account numbers.

## 2026-07-21 — Desktop builder density

### Desktop is a workspace + rail, not a generic part/labor grid
Board 1f is a dense editable table with ITEM / TYPE / QTY / RATE / LINE TOTAL
columns and a summary + customer rail. The app's line items are service-type
specific (oil grade, tire PSI, an inspection pass/fail grid), so a single fixed
column table can't hold them without flattening the domain. Instead, at `lg+`
the builder becomes a two-column workspace: the service cards (already real
inputs, mono and right-aligned, with computed non-editable line totals from C3)
on the left, and a sticky rail on the right carrying the Subtotal / Visit total
summary, the Save/Cancel actions, and a live customer-and-vehicle context card
driven by the selected truck. The mobile thumb bar is preserved below `lg`.

## 2026-07-21 — Customer, vehicle, new customer

### New-customer form: two required fields (safe against the schema)
Board 1e wants only company name + mobile required. The `companies` columns
`contact_name / contact_email / billing_address / contact_phone` are all
`not null default ''`, so omitting them inserts cleanly. The form now requires
name + mobile; contact name, email, and address are optional. This is a
validation relaxation, not a data-layer change: the insert path and columns are
untouched, and it matches the board. Mobile renders in mono; inputs are 52px
with the shared navy focus ring.

### Money band and inline history omitted, not faked
Board 1d leads with YTD billed + open balance and shows service history inline
under each truck. Both need aggregate queries across invoices/visits per company
that the current hooks don't run, and the data layer is frozen. Rather than
fabricate figures, the customer page shows the real contact card (Call / Text /
Email wired to the actual phone/email), the GET rate, and the trucks; per-truck
history stays on the existing TruckDetailPage (routing preserved), which is
reskinned to the 1d history rows. If additive read-only queries are later
allowed, the money band drops straight in.

### No odometer, so no PM-on-odometer line
The board rides a "PM due in ~1,600 mi" reminder on an odometer line. The truck
schema has no mileage/odometer field, so that line would be invented. The
vehicle meta line shows VIN + plate instead.

## 2026-07-21 — Document view

### Business identity is not fabricated
Board 1c/1g show a full letterhead: street address, phone, email, GET license
number, and ACH routing/account numbers. Those are illustrative canvas values;
the app stores no business profile (the existing PDFs carry only the name
"FleetServ Hawaii" and a tagline). Inventing a GET license or bank routing
number on a customer-facing artifact would be misleading, so the shared
`DocumentArtifact` shows the brand mark, name, and tagline, plus only real data:
the customer (bill-to), the vehicle (unit / year-make-model / VIN), the line
items, GET at the company's rate, totals, and dates. Remit language is generic
("Check payable to FleetServ Hawaii"), with no fabricated account numbers.

### One artifact, both routes; page chrome tagged for print
`DocumentArtifact` renders the customer-facing paper for both QuoteDetailPage and
InvoiceDetailPage (kind flips title, meta labels, and terms; `paid` stamps the
PAID mark). The surrounding breadcrumb, status chip, and action bar are wrapped
in `.fs-app-chrome` so the print treatment (C7) hides them and prints only the
artifact. No mutation or PDF-download logic changed.

## 2026-07-21 — Mobile quote builder

### GET is not shown on the visit builder; it lives on the quote
Board 1b pins Subtotal + GET + Total in the builder footer. In this app, GET is
computed at quote generation from the selected company's Hawaii rate
(`useGenerateQuote`), and the new-visit builder never has that rate: its data
hook fetches `companies(name)` only, and the data layer is frozen. So the mobile
builder's pinned footer shows Subtotal + Visit total (pre-tax) above the
thumb-zone Save button, with a one-line note that GET is itemized on the quote.
The full Subtotal / GET / Total treatment appears where the rate actually exists:
the document view (C4) and desktop builder (C6).

### Steppers set the registered field; math untouched
The 44px quantity steppers call react-hook-form `setValue` on the existing
`quantity` field. The field stays registered (typing still works) and
`computeSubtotal` is unchanged, so no pricing logic moved. Steppers appear only
on quantity-based service types (oil, fluid, fuel, add-on); tire PSI and
inspection have no qty. Per-line "qty unit @ rate" and the computed line total
render as read-only mono, never editable.

## 2026-07-21 — Status system + job list

### One chip component covers nine app statuses on six designed grounds
The design ships six chip grounds (draft, sent, accepted, invoiced, paid,
overdue). The app carries three more across the visit/quote/invoice flows:
quoted, approved, declined. Rather than invent three new colors, each maps onto
the nearest designed ground by meaning: quoted → sent (blue), approved →
accepted (green), declined → overdue (red). The label always renders, so mapped
states stay distinguishable and status is never carried by color alone
(WCAG 1.4.1). `StatusBadge` keeps its `status` + `label` API, so the six existing
call sites upgrade with no change; it now renders the `.fs-chip[data-status]`
system and gained a `mini` variant for dense rows.

### Jobs page is responsive, not a Kanban→list replacement
Board 1a is a flat urgency-sorted list; the current jobs page is a drag-between-
columns Kanban whose drag = status update. "Behavior is frozen," so the drag
mutation must survive. Resolution: the mobile view (`< lg`) is the 1a urgency
list (money summary band, status filter chips, ≥72px rows, right-aligned mono
amounts); the desktop view (`lg+`) keeps the existing drag pipeline, restyled to
the new tokens. Nothing is removed and the status mutation is untouched. Urgency
order: invoiced → approved → quoted → draft → paid, then most recent first.

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

## 2026-09-12: Finishing the token migration

### The spec was verified, the build was not

The 2026-07-21 entry above computed WCAG ratios for 30 pairs and fixed the one
that failed. That audit covered the **reference canvas**, the designed artboards
in `design/`. Nobody re-ran it against the compiled app, and the two had drifted:
`fs.*` and the older `brand.*` scale were both live, and the components a user
actually touches were still on `brand.*`.

Measured before this change: 215 `fs-*` utilities against 123 `brand-*` and 82
unthemed `gray`/`slate`. Two palettes on one screen, which is most of why the app
read as assembled rather than designed. The two navies (`#1B2B45` and `#102A40`)
and the two teals (`#0E8C7A` and `#22B597`) are close enough that the mismatch
looks like a rendering fault rather than a decision.

### Eight pairs were failing AA in production

Every one is the same mistake: teal asked to do a job `tokens.css` explicitly
rules out. Line 17 of that file reads `--fs-teal-500: #22b597; /* brand mark +
active nav on navy ONLY */`. Teal carries white at 2.58:1.

| Element | Before | Ratio | After | Ratio |
|---|---|---|---|---|
| Primary button | white on `#0E8C7A` | **4.16:1** | white on navy-900 | 14.71:1 |
| Primary button, hover | white on `#12A991` | **2.95:1** | white on navy-800 | 12.52:1 |
| Danger button | white on `#D95C3A` | **3.79:1** | white on `#8F1D18` | 8.91:1 |
| Sidebar active nav | white on `#0E8C7A` | **4.16:1** | white on navy-700 | 9.90:1 |
| Account avatar | white on `#0E8C7A` | **4.16:1** | white on navy-700 | 9.90:1 |
| Inline links, 18 of them | `#0E8C7A` on white | **4.16:1** | navy-700 on white | 9.90:1 |
| "Create one", 12px | `#0E8C7A` on sand | **3.75:1** | navy-700 | 8.60:1 |
| Card subtitle | `#6B7280` on white | 4.83:1 | ink-600 | 7.95:1 |

There was no destructive colour in the `fs` scale at all, so this adds
`fs.danger` (`#8F1D18` / hover `#731714` / subtle `#FBE3E1`).

### Teal keeps its documented job

The active sidebar row is navy-700 with a 3px teal inset rule. That is "active
nav on navy" as written, without asking teal to back a label. After the sweep
teal appears three times in the compiled CSS: the brand mark, the sidebar
indicator, and the accepted-status dot.

### The 44px floor was never applied to buttons

`--fs-touch-min: 44px` was wired into `.form-input` and nothing else. Buttons sat
near 36px. This quoting app is used on a phone, in a yard, in direct sun, with
gloves on, so the floor now applies to button sizes `md` and `lg`. `sm` stays
dense for inline table actions, where the row itself is the target.

### Greys were remapped by ground, not by number

`gray-400` and `gray-500` both land on `ink-500`. The obvious mapping for
`gray-400` was `ink-450`, but `ink-450` measures 4.54:1 on white and 4.11:1 on
`bg-100`, so it passes only on cards. `ink-500` clears both at 6.18:1 and 5.60:1.

**`--fs-ink-450` is a white-surface token.** It was introduced in July to fix one
failing pair on white and its 4.54:1 leaves no headroom, so on the `bg-100` app
ground it drops to 4.11:1 and fails. Two pre-existing uses were caught this way,
measured on the running app rather than found by reading: the pipeline column's
empty state, and the breadcrumb separator on five detail pages. Both moved to
`ink-500`. Use `ink-450` only on `#FFFFFF`; anything on the app ground needs
`ink-500` or darker. Disabled controls are exempt, WCAG 1.4.3 excludes inactive
components.
Slates were all on the navy sidebar and took the navy tints instead.

Two cases the blanket mapping would have got wrong, corrected by hand: the
"Saved." confirmation takes the accepted-status colour rather than the link
colour, because it is a state and not a link; and the 404 numeral is a ghost far
below 3:1 on purpose, so it is marked `aria-hidden` and the sentence beneath it
carries the meaning.

### Result

`src/` holds zero `brand-*`, `status-*`, `surface-*` or raw `gray`/`slate`
utilities: 440 `fs-*` uses, one palette. Verified against the compiled build, not
the source: every legacy hex is absent from `dist/assets/index-*.css`, and the
sign-in screen measures zero AA failures with a lowest pair of 5.60:1, against
five failures and a lowest of 3.75:1 before.

The lesson worth keeping: a verified design system is not a verified product. The
July audit was correct and the app still shipped eight failures, because nothing
re-checked the built output. Contrast belongs in the build, not only in the spec.
