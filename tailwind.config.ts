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
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;
