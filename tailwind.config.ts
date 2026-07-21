import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette: deep ocean navy anchor, warm slate for surfaces,
        // Pacific teal accent, coral for alerts, sand for backgrounds.
        brand: {
          navy: "#1B2B45",
          "navy-dark": "#111D2E",
          "navy-muted": "#2C3F5C",
          teal: "#0E8C7A",
          "teal-light": "#12A991",
          "teal-subtle": "#E6F5F3",
          coral: "#D95C3A",
          "coral-subtle": "#FDF0EC",
          sand: "#F5F3EF",
          "sand-dark": "#EAE7E1",
        },
        // Semantic surface tokens
        surface: {
          page: "#F5F3EF",
          card: "#FFFFFF",
          sidebar: "#1B2B45",
          "sidebar-hover": "#2C3F5C",
        },
        // Redesign token palette (design/tokens.css). Additive: the brand.*
        // and status.* scales above stay in place through the migration.
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
          // Status grounds — dot + text + bg per state.
          draft: { bg: "#E9EDF1", text: "#3E4E5B", dot: "#75858F" },
          sent: { bg: "#E1EDFA", text: "#14508F", dot: "#2D72C4" },
          accepted: { bg: "#DCF3EC", text: "#0B5E4A", dot: "#12977A" },
          invoiced: { bg: "#FCEFD7", text: "#7A4A06", dot: "#C7860F" },
          paid: { bg: "#147A3D", text: "#FFFFFF", dot: "#8CE0AC" },
          overdue: { bg: "#FBE3E1", text: "#8F1D18", dot: "#C63D34" },
        },
        // Status badge colors
        status: {
          draft: "#6B7280",
          "draft-bg": "#F3F4F6",
          quoted: "#1D4ED8",
          "quoted-bg": "#EFF6FF",
          approved: "#15803D",
          "approved-bg": "#F0FDF4",
          invoiced: "#9333EA",
          "invoiced-bg": "#FAF5FF",
          paid: "#0E8C7A",
          "paid-bg": "#E6F5F3",
          sent: "#1D4ED8",
          "sent-bg": "#EFF6FF",
          accepted: "#15803D",
          "accepted-bg": "#F0FDF4",
          declined: "#DC2626",
          "declined-bg": "#FEF2F2",
          overdue: "#DC2626",
          "overdue-bg": "#FEF2F2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        // Redesign faces. archivo is the UI voice; money is the mono used for
        // every dollar figure, ID, VIN, and table date.
        archivo: ["Archivo", "system-ui", "sans-serif"],
        money: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
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
