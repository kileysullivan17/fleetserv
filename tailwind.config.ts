import type { Config } from "tailwindcss";

// A Tailwind color backed by a --fs-* custom property in tokens.css.
const v = (name: string) =>
  `color-mix(in srgb, var(--fs-${name}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Every fs.* color reads a CSS variable from the repo-root tokens.css,
        // so the dark theme flows through every utility class. color-mix keeps
        // opacity modifiers working (bg-fs-navy-950/40, border-fs-focus/40):
        // Tailwind fills <alpha-value> with the modifier, or with 1 when there
        // is none. Light values live in tokens.css and match the palette the
        // app shipped with; see DESIGN.md for the system.
        fs: {
          // Brand structure on navy grounds. One value in both themes.
          navy: {
            950: v("navy-950"),
            900: v("navy-900"),
            800: v("navy-800"),
            700: v("navy-700"),
            100: v("navy-100"),
            50: v("navy-50"),
          },
          teal: {
            500: v("teal-500"),
            200: v("teal-200"),
          },
          // Neutrals: text, hairlines, app ground, cards. These flip in dark.
          ink: {
            900: v("ink-900"),
            600: v("ink-600"),
            500: v("ink-500"),
            450: v("ink-450"), // tertiary text tier, white surfaces only in light
          },
          line: {
            300: v("line-300"),
            200: v("line-200"),
          },
          bg: v("bg-100"),
          surface: v("surface"),
          // Roles: navy jobs on light surfaces. Same hex as the navy steps in
          // light; each takes its own value in dark. Use these, not navy-*,
          // anywhere the ground is a card or the app background.
          link: v("link"),
          focus: v("focus"),
          rule: v("rule"),
          strong: v("strong"),
          tint: v("tint"),
          tag: v("tag"),
          band: v("band"),
          selected: { DEFAULT: v("selected"), fg: v("selected-fg") },
          primary: {
            DEFAULT: v("primary"),
            hover: v("primary-hover"),
            fg: v("primary-fg"),
          },
          // danger is error text; danger-solid backs white text (8.9:1 light,
          // 5.2:1 dark). The old brand.coral failed AA and must not return.
          danger: {
            DEFAULT: v("danger"),
            solid: v("danger-solid"),
            hover: v("danger-hover"),
            subtle: v("danger-subtle"),
          },
          "sidebar-edge": v("sidebar-edge"),
          // Status grounds: dot + text + bg per state.
          draft: { bg: v("draft-bg"), text: v("draft-text"), dot: v("draft-dot") },
          sent: { bg: v("sent-bg"), text: v("sent-text"), dot: v("sent-dot") },
          accepted: {
            bg: v("accepted-bg"),
            text: v("accepted-text"),
            dot: v("accepted-dot"),
          },
          invoiced: {
            bg: v("invoiced-bg"),
            text: v("invoiced-text"),
            dot: v("invoiced-dot"),
          },
          paid: { bg: v("paid-bg"), text: v("paid-text"), dot: v("paid-dot") },
          overdue: {
            bg: v("overdue-bg"),
            text: v("overdue-text"),
            dot: v("overdue-dot"),
          },
        },
      },
      // The ring-offset gap matches the surface, so a focus ring never shows
      // a white halo on a dark card.
      ringOffsetColor: {
        DEFAULT: "var(--fs-surface)",
      },
      fontFamily: {
        // Two faces, matching tokens.css. Archivo is the UI voice and
        // IBM Plex Mono carries every dollar figure, ID, VIN, and table date.
        // Inter and JetBrains Mono were the pre-redesign pair and are gone:
        // font-sans appeared only in a comment and font-archivo never at all.
        sans: ["Archivo", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        // Redesign elevation + focus ring (tokens.css).
        "fs-card": "var(--fs-shadow-card)",
        "fs-focus": "var(--fs-focus-ring)",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        // Redesign radii: 8 / 10 / 14 px.
        fs: "10px",
        "fs-sm": "8px",
        "fs-lg": "14px",
      },
    },
  },
  plugins: [],
};

export default config;
