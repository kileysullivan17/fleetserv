import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // The palette, mirroring design/tokens.css. The pre-redesign brand.*,
        // surface.* and status.* scales were removed once src/ held no uses of
        // them; the CSS custom properties in index.css remain the source.
        fs: {
          navy: {
            950: "#0B1B2A",
            900: "#102A40",
            800: "#17364F",
            700: "#1C4667",
            100: "#D9E4EE",
            50: "#EDF3F8",
          },
          teal: {
            500: "#22B597",
            200: "#8FDCC9",
          },
          ink: {
            900: "#16232E",
            600: "#43535F",
            500: "#55636E",
            450: "#6A7883", // contrast-corrected tertiary text tier
          },
          line: {
            300: "#B9C4CD",
            200: "#D7DEE4",
          },
          bg: "#F1F4F6",
          surface: "#FFFFFF",
          // Destructive actions. #8F1D18 carries white at 8.9:1; the old
          // brand.coral failed AA at 3.8:1 and must not back white text.
          danger: { DEFAULT: "#8F1D18", hover: "#731714", subtle: "#FBE3E1" },
          // Status grounds — dot + text + bg per state.
          draft: { bg: "#E9EDF1", text: "#3E4E5B", dot: "#75858F" },
          sent: { bg: "#E1EDFA", text: "#14508F", dot: "#2D72C4" },
          accepted: { bg: "#DCF3EC", text: "#0B5E4A", dot: "#12977A" },
          invoiced: { bg: "#FCEFD7", text: "#7A4A06", dot: "#C7860F" },
          paid: { bg: "#147A3D", text: "#FFFFFF", dot: "#8CE0AC" },
          overdue: { bg: "#FBE3E1", text: "#8F1D18", dot: "#C63D34" },
        },
      },
      fontFamily: {
        // Two faces, matching design/tokens.css. Archivo is the UI voice and
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
        // Redesign elevation + focus ring (design/tokens.css).
        "fs-card": "0 1px 2px rgba(13, 30, 45, 0.08)",
        "fs-focus": "0 0 0 3px rgba(28, 70, 103, 0.35)",
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
