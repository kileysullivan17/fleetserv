# FleetServ handshake video: logo compositing guide

Goal: composite the FleetServ branding onto the technician and a generic mark onto the
client, in the tech-and-driver handshake clip, so the blank patches read as real uniforms.

## Source footage

`design/video/fleetserv-handshake-983b331d.mp4` (10s, 720p, 24fps). The plate was generated
with blank patches on purpose: the tech has a blank navy cap panel and a blank chest name
patch; the client (charcoal-grey polo) has a blank oval chest patch. Two people only.

## The assets (in `design/video/assets/`)

| File | Goes on | Notes |
|---|---|---|
| `fleetserv-bars-white.png` | Tech's navy cap front panel | Teal + white skewed bars (navy bar would vanish on the navy cap). |
| `fleetserv-nametag.png` | Tech's left-chest patch | Cream patch: skewed bars + FLEETSERV wordmark + name line. Edit the name in the SVG. |
| `fleetserv-lockup.png` | Alternate: tech chest, or anywhere needing the full logo | Skewed teal+navy bars + FLEETSERV wordmark, transparent. |
| `fleetserv-bars.png` | Light surfaces needing the mark alone | Teal + navy skewed bars (the blue/green bands), no wordmark. |
| `client-mark-generic.png` | Client's chest patch | Invented "Ironwood" mark, warm rust round badge. Placeholder, not a real company. |

The logo is the FleetServ house mark from `src/components/ui/BrandMark.tsx`: two 16°-skewed bars
(teal `#22B597` + navy `#102A40`, the blue/green bands) and "FLEETSERV" set in Archivo
extra-bold italic. Each PNG is transparent (RGBA). The `.svg` sources sit beside them: re-run
`rsvg-convert -w <px> file.svg -o file.png` after any edit (Archivo must be installed:
`brew install --cask font-archivo`). To change the tech's name, edit the `KAI` text in
`fleetserv-nametag.svg` and re-rasterize.

## Editor

Written for DaVinci Resolve (free); After Effects notes in brackets. Both do planar/point
tracking with a corner-pin. Budget ~1 to 2 hours.

## Step by step (repeat per patch)

Three tracked inserts: cap glyph, tech nametag, client mark. Do them one at a time.

1. **Import.** Drop the .mp4 on the timeline. Add the logo PNG as a second layer above it.
   [AE: import both, drag logo above the footage layer.]

   - On the cap use `fleetserv-bars-white.png` (bars only); on the chest patch use the full
     `fleetserv-nametag.png`. The cap panel is small, so the bars-only mark reads better there
     than the full wordmark.

2. **Track the patch.** In Resolve, Fusion page: add a `Planar Tracker`, draw its pattern
   box around the blank patch (the cap panel / the chest patch), track forward across the clip.
   Use `Corner Pin` output. [AE: Mocha or the built-in planar tracker on the patch region;
   apply as corner-pin to the logo layer.]
   - The camera pushes in slowly, so the patch grows through the shot. Planar tracking handles
     that. If a point tracker drifts on the fabric, fall back to planar (it tracks the whole
     surface, not one dot).

3. **Pin the logo.** Connect the logo through the corner-pin so it locks to the patch and warps
   with it. Scale it to sit inside the patch with a little margin, don't fill edge to edge.

4. **Sit it into the fabric.** Drop opacity to ~90%, or set blend to `Multiply` (or `Overlay`)
   so the shirt's folds and shadows show through. A logo at 100% `Normal` reads as a flat
   sticker. Add a hair of blur (0.5 to 1px) so it matches the footage's focus.

5. **Match the grade.** The shot is warm golden-hour with a teal work lamp on wet asphalt.
   Add a slight warm tint to the FleetServ cream/teal so it doesn't look cooler than the plate.
   Sample a nearby lit area and nudge the logo's temperature toward it.

6. **Handle the handshake.** When the hands cross frame mid-clip they may pass in front of a
   chest patch for a few frames. If a hand crosses a logo, mask the logo out for those frames
   (draw a quick garbage mask on the hand, or key the logo off where it's occluded) so the
   logo doesn't float over the arm.

## Order of difficulty

- Easiest: **client chest mark** and **tech nametag** (large, front-facing, slow move).
- Hardest: **cap glyph** (curved cap surface, smaller). If the cap track fights you, it's the
  one to drop first, the two chest patches carry the branding.

## Export

Match source: H.264, 1280x720, 24fps. Name it `fleetserv-handshake-branded.mp4` in this folder.
If it's headed for the case-study hero, also export a silent, seamless-loop-trimmed version.

## If a track won't hold

Deforming fabric with a push-in is genuinely hard. If a patch drifts and won't settle,
shorten the insert to the frames where it tracks cleanly, or hold the logo static on a locked
sub-range. Better a clean 6 seconds than a wobbling 10.
