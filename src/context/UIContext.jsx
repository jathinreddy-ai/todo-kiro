// UI customization context — glass mode toggle + accent color + gradient picker.
import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const ACCENT_COLORS = [
  // ── Row 1 ──────────────────────────────────────────────────────────────────
  {
    id: "indigo",
    label: "Indigo",
    primary: "#6366f1",
    vars: {
      "--accent-50": "#f0f4ff",
      "--accent-100": "#e0e9ff",
      "--accent-200": "#c7d7fe",
      "--accent-300": "#a5b4fc",
      "--accent-400": "#818cf8",
      "--accent-500": "#6366f1",
      "--accent-600": "#4f46e5",
      "--accent-700": "#4338ca",
      "--accent-glow": "rgba(99,102,241,0.35)",
      "--orb1": "rgba(99,102,241,0.45)",
      "--orb2": "rgba(139,92,246,0.35)",
      "--orb3": "rgba(236,72,153,0.25)",
    },
  },
  {
    id: "violet",
    label: "Violet",
    primary: "#8b5cf6",
    vars: {
      "--accent-50": "#f5f3ff",
      "--accent-100": "#ede9fe",
      "--accent-200": "#ddd6fe",
      "--accent-300": "#c4b5fd",
      "--accent-400": "#a78bfa",
      "--accent-500": "#8b5cf6",
      "--accent-600": "#7c3aed",
      "--accent-700": "#6d28d9",
      "--accent-glow": "rgba(139,92,246,0.35)",
      "--orb1": "rgba(139,92,246,0.45)",
      "--orb2": "rgba(99,102,241,0.35)",
      "--orb3": "rgba(236,72,153,0.25)",
    },
  },
  {
    id: "purple",
    label: "Purple",
    primary: "#a855f7",
    vars: {
      "--accent-50": "#faf5ff",
      "--accent-100": "#f3e8ff",
      "--accent-200": "#e9d5ff",
      "--accent-300": "#d8b4fe",
      "--accent-400": "#c084fc",
      "--accent-500": "#a855f7",
      "--accent-600": "#9333ea",
      "--accent-700": "#7e22ce",
      "--accent-glow": "rgba(168,85,247,0.35)",
      "--orb1": "rgba(168,85,247,0.45)",
      "--orb2": "rgba(139,92,246,0.35)",
      "--orb3": "rgba(236,72,153,0.25)",
    },
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    primary: "#d946ef",
    vars: {
      "--accent-50": "#fdf4ff",
      "--accent-100": "#fae8ff",
      "--accent-200": "#f5d0fe",
      "--accent-300": "#f0abfc",
      "--accent-400": "#e879f9",
      "--accent-500": "#d946ef",
      "--accent-600": "#c026d3",
      "--accent-700": "#a21caf",
      "--accent-glow": "rgba(217,70,239,0.35)",
      "--orb1": "rgba(217,70,239,0.45)",
      "--orb2": "rgba(232,121,249,0.35)",
      "--orb3": "rgba(99,102,241,0.25)",
    },
  },
  // ── Row 2 ──────────────────────────────────────────────────────────────────
  {
    id: "pink",
    label: "Pink",
    primary: "#ec4899",
    vars: {
      "--accent-50": "#fdf2f8",
      "--accent-100": "#fce7f3",
      "--accent-200": "#fbcfe8",
      "--accent-300": "#f9a8d4",
      "--accent-400": "#f472b6",
      "--accent-500": "#ec4899",
      "--accent-600": "#db2777",
      "--accent-700": "#be185d",
      "--accent-glow": "rgba(236,72,153,0.35)",
      "--orb1": "rgba(236,72,153,0.45)",
      "--orb2": "rgba(244,114,182,0.35)",
      "--orb3": "rgba(139,92,246,0.25)",
    },
  },
  {
    id: "rose",
    label: "Rose",
    primary: "#f43f5e",
    vars: {
      "--accent-50": "#fff1f2",
      "--accent-100": "#ffe4e6",
      "--accent-200": "#fecdd3",
      "--accent-300": "#fda4af",
      "--accent-400": "#fb7185",
      "--accent-500": "#f43f5e",
      "--accent-600": "#e11d48",
      "--accent-700": "#be123c",
      "--accent-glow": "rgba(244,63,94,0.35)",
      "--orb1": "rgba(244,63,94,0.45)",
      "--orb2": "rgba(251,113,133,0.35)",
      "--orb3": "rgba(139,92,246,0.25)",
    },
  },
  {
    id: "red",
    label: "Red",
    primary: "#ef4444",
    vars: {
      "--accent-50": "#fef2f2",
      "--accent-100": "#fee2e2",
      "--accent-200": "#fecaca",
      "--accent-300": "#fca5a5",
      "--accent-400": "#f87171",
      "--accent-500": "#ef4444",
      "--accent-600": "#dc2626",
      "--accent-700": "#b91c1c",
      "--accent-glow": "rgba(239,68,68,0.35)",
      "--orb1": "rgba(239,68,68,0.45)",
      "--orb2": "rgba(248,113,113,0.35)",
      "--orb3": "rgba(217,70,239,0.25)",
    },
  },
  {
    id: "orange",
    label: "Orange",
    primary: "#f97316",
    vars: {
      "--accent-50": "#fff7ed",
      "--accent-100": "#ffedd5",
      "--accent-200": "#fed7aa",
      "--accent-300": "#fdba74",
      "--accent-400": "#fb923c",
      "--accent-500": "#f97316",
      "--accent-600": "#ea580c",
      "--accent-700": "#c2410c",
      "--accent-glow": "rgba(249,115,22,0.35)",
      "--orb1": "rgba(249,115,22,0.45)",
      "--orb2": "rgba(251,146,60,0.35)",
      "--orb3": "rgba(245,158,11,0.25)",
    },
  },
  // ── Row 3 ──────────────────────────────────────────────────────────────────
  {
    id: "amber",
    label: "Amber",
    primary: "#f59e0b",
    vars: {
      "--accent-50": "#fffbeb",
      "--accent-100": "#fef3c7",
      "--accent-200": "#fde68a",
      "--accent-300": "#fcd34d",
      "--accent-400": "#fbbf24",
      "--accent-500": "#f59e0b",
      "--accent-600": "#d97706",
      "--accent-700": "#b45309",
      "--accent-glow": "rgba(245,158,11,0.35)",
      "--orb1": "rgba(245,158,11,0.45)",
      "--orb2": "rgba(251,191,36,0.35)",
      "--orb3": "rgba(244,63,94,0.25)",
    },
  },
  {
    id: "yellow",
    label: "Yellow",
    primary: "#eab308",
    vars: {
      "--accent-50": "#fefce8",
      "--accent-100": "#fef9c3",
      "--accent-200": "#fef08a",
      "--accent-300": "#fde047",
      "--accent-400": "#facc15",
      "--accent-500": "#eab308",
      "--accent-600": "#ca8a04",
      "--accent-700": "#a16207",
      "--accent-glow": "rgba(234,179,8,0.35)",
      "--orb1": "rgba(234,179,8,0.45)",
      "--orb2": "rgba(250,204,21,0.35)",
      "--orb3": "rgba(249,115,22,0.25)",
    },
  },
  {
    id: "lime",
    label: "Lime",
    primary: "#84cc16",
    vars: {
      "--accent-50": "#f7fee7",
      "--accent-100": "#ecfccb",
      "--accent-200": "#d9f99d",
      "--accent-300": "#bef264",
      "--accent-400": "#a3e635",
      "--accent-500": "#84cc16",
      "--accent-600": "#65a30d",
      "--accent-700": "#4d7c0f",
      "--accent-glow": "rgba(132,204,22,0.35)",
      "--orb1": "rgba(132,204,22,0.45)",
      "--orb2": "rgba(163,230,53,0.35)",
      "--orb3": "rgba(16,185,129,0.25)",
    },
  },
  {
    id: "green",
    label: "Green",
    primary: "#22c55e",
    vars: {
      "--accent-50": "#f0fdf4",
      "--accent-100": "#dcfce7",
      "--accent-200": "#bbf7d0",
      "--accent-300": "#86efac",
      "--accent-400": "#4ade80",
      "--accent-500": "#22c55e",
      "--accent-600": "#16a34a",
      "--accent-700": "#15803d",
      "--accent-glow": "rgba(34,197,94,0.35)",
      "--orb1": "rgba(34,197,94,0.45)",
      "--orb2": "rgba(74,222,128,0.35)",
      "--orb3": "rgba(16,185,129,0.25)",
    },
  },
  // ── Row 4 ──────────────────────────────────────────────────────────────────
  {
    id: "emerald",
    label: "Emerald",
    primary: "#10b981",
    vars: {
      "--accent-50": "#ecfdf5",
      "--accent-100": "#d1fae5",
      "--accent-200": "#a7f3d0",
      "--accent-300": "#6ee7b7",
      "--accent-400": "#34d399",
      "--accent-500": "#10b981",
      "--accent-600": "#059669",
      "--accent-700": "#047857",
      "--accent-glow": "rgba(16,185,129,0.35)",
      "--orb1": "rgba(16,185,129,0.45)",
      "--orb2": "rgba(52,211,153,0.35)",
      "--orb3": "rgba(99,102,241,0.25)",
    },
  },
  {
    id: "teal",
    label: "Teal",
    primary: "#14b8a6",
    vars: {
      "--accent-50": "#f0fdfa",
      "--accent-100": "#ccfbf1",
      "--accent-200": "#99f6e4",
      "--accent-300": "#5eead4",
      "--accent-400": "#2dd4bf",
      "--accent-500": "#14b8a6",
      "--accent-600": "#0d9488",
      "--accent-700": "#0f766e",
      "--accent-glow": "rgba(20,184,166,0.35)",
      "--orb1": "rgba(20,184,166,0.45)",
      "--orb2": "rgba(45,212,191,0.35)",
      "--orb3": "rgba(99,102,241,0.25)",
    },
  },
  {
    id: "cyan",
    label: "Cyan",
    primary: "#06b6d4",
    vars: {
      "--accent-50": "#ecfeff",
      "--accent-100": "#cffafe",
      "--accent-200": "#a5f3fc",
      "--accent-300": "#67e8f9",
      "--accent-400": "#22d3ee",
      "--accent-500": "#06b6d4",
      "--accent-600": "#0891b2",
      "--accent-700": "#0e7490",
      "--accent-glow": "rgba(6,182,212,0.35)",
      "--orb1": "rgba(6,182,212,0.45)",
      "--orb2": "rgba(34,211,238,0.35)",
      "--orb3": "rgba(14,165,233,0.25)",
    },
  },
  {
    id: "sky",
    label: "Sky",
    primary: "#0ea5e9",
    vars: {
      "--accent-50": "#f0f9ff",
      "--accent-100": "#e0f2fe",
      "--accent-200": "#bae6fd",
      "--accent-300": "#7dd3fc",
      "--accent-400": "#38bdf8",
      "--accent-500": "#0ea5e9",
      "--accent-600": "#0284c7",
      "--accent-700": "#0369a1",
      "--accent-glow": "rgba(14,165,233,0.35)",
      "--orb1": "rgba(14,165,233,0.45)",
      "--orb2": "rgba(56,189,248,0.35)",
      "--orb3": "rgba(99,102,241,0.25)",
    },
  },
  // ── Row 5 ──────────────────────────────────────────────────────────────────
  {
    id: "blue",
    label: "Blue",
    primary: "#3b82f6",
    vars: {
      "--accent-50": "#eff6ff",
      "--accent-100": "#dbeafe",
      "--accent-200": "#bfdbfe",
      "--accent-300": "#93c5fd",
      "--accent-400": "#60a5fa",
      "--accent-500": "#3b82f6",
      "--accent-600": "#2563eb",
      "--accent-700": "#1d4ed8",
      "--accent-glow": "rgba(59,130,246,0.35)",
      "--orb1": "rgba(59,130,246,0.45)",
      "--orb2": "rgba(96,165,250,0.35)",
      "--orb3": "rgba(14,165,233,0.25)",
    },
  },
  {
    id: "cobalt",
    label: "Cobalt",
    primary: "#1d4ed8",
    vars: {
      "--accent-50": "#eff6ff",
      "--accent-100": "#dbeafe",
      "--accent-200": "#bfdbfe",
      "--accent-300": "#93c5fd",
      "--accent-400": "#3b82f6",
      "--accent-500": "#1d4ed8",
      "--accent-600": "#1e40af",
      "--accent-700": "#1e3a8a",
      "--accent-glow": "rgba(29,78,216,0.35)",
      "--orb1": "rgba(29,78,216,0.45)",
      "--orb2": "rgba(59,130,246,0.35)",
      "--orb3": "rgba(99,102,241,0.25)",
    },
  },
  {
    id: "slate",
    label: "Slate",
    primary: "#64748b",
    vars: {
      "--accent-50": "#f8fafc",
      "--accent-100": "#f1f5f9",
      "--accent-200": "#e2e8f0",
      "--accent-300": "#cbd5e1",
      "--accent-400": "#94a3b8",
      "--accent-500": "#64748b",
      "--accent-600": "#475569",
      "--accent-700": "#334155",
      "--accent-glow": "rgba(100,116,139,0.35)",
      "--orb1": "rgba(100,116,139,0.45)",
      "--orb2": "rgba(148,163,184,0.35)",
      "--orb3": "rgba(99,102,241,0.25)",
    },
  },
  {
    id: "crimson",
    label: "Crimson",
    primary: "#dc143c",
    vars: {
      "--accent-50": "#fff0f3",
      "--accent-100": "#ffe0e6",
      "--accent-200": "#ffc0cc",
      "--accent-300": "#ff8fa3",
      "--accent-400": "#ff4d6d",
      "--accent-500": "#dc143c",
      "--accent-600": "#c0122f",
      "--accent-700": "#9b0e26",
      "--accent-glow": "rgba(220,20,60,0.35)",
      "--orb1": "rgba(220,20,60,0.45)",
      "--orb2": "rgba(255,77,109,0.35)",
      "--orb3": "rgba(217,70,239,0.25)",
    },
  },
];

const UIContext = createContext(null);

// Build CSS vars from a raw hex color (generates a simple shade scale).
// Accepts hex with or without leading #.
export function buildCustomVars(rawHex) {
  const hex = /^#[0-9a-fA-F]{6}$/.test(rawHex)
    ? rawHex.toLowerCase()
    : /^[0-9a-fA-F]{6}$/.test(rawHex)
      ? `#${rawHex.toLowerCase()}`
      : "#6366f1";

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lighten = (ratio) => {
    const lr = Math.min(255, Math.round(r + (255 - r) * ratio));
    const lg = Math.min(255, Math.round(g + (255 - g) * ratio));
    const lb = Math.min(255, Math.round(b + (255 - b) * ratio));
    return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
  };
  const darken = (ratio) => {
    const dr = Math.max(0, Math.round(r * (1 - ratio)));
    const dg = Math.max(0, Math.round(g * (1 - ratio)));
    const db = Math.max(0, Math.round(b * (1 - ratio)));
    return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
  };

  return {
    c400: lighten(0.2),
    c500: hex,
    c600: darken(0.15),
    c700: darken(0.3),
    glow: `rgba(${r},${g},${b},0.35)`,
    glowStrong: `rgba(${r},${g},${b},0.45)`,
  };
}

// Resolve the current accent palette from state
function resolveAccent(accentColor, customHex) {
  if (accentColor === "custom") {
    return buildCustomVars(customHex);
  }
  const preset =
    ACCENT_COLORS.find((c) => c.id === accentColor) || ACCENT_COLORS[0];
  return {
    c400: preset.vars["--accent-400"],
    c500: preset.vars["--accent-500"],
    c600: preset.vars["--accent-600"],
    c700: preset.vars["--accent-700"],
    glow: preset.vars["--accent-glow"],
    glowStrong: preset.vars["--orb1"],
  };
}

export function UIProvider({ children }) {
  const [glassMode, setGlassMode] = useLocalStorage("todo-app:glass", true);
  const [gradientMode, setGradientMode] = useLocalStorage(
    "todo-app:gradient",
    true,
  );
  const [accentColor, setAccentColor] = useLocalStorage(
    "todo-app:accent",
    "indigo",
  );
  const [customHex, setCustomHex] = useLocalStorage(
    "todo-app:custom-hex",
    "#6366f1",
  );

  // Resolved accent palette — recomputed whenever accentColor or customHex changes
  const accent = resolveAccent(accentColor, customHex);

  // Also write CSS vars to :root so CSS-only elements (orbs, datepicker, etc.) still work
  useEffect(() => {
    const root = document.documentElement;
    const preset =
      accentColor === "custom"
        ? null
        : ACCENT_COLORS.find((c) => c.id === accentColor) || ACCENT_COLORS[0];

    if (preset) {
      Object.entries(preset.vars).forEach(([k, v]) =>
        root.style.setProperty(k, v),
      );
    } else {
      const vars = buildCustomVars(customHex);
      root.style.setProperty("--accent-400", vars.c400);
      root.style.setProperty("--accent-500", vars.c500);
      root.style.setProperty("--accent-600", vars.c600);
      root.style.setProperty("--accent-700", vars.c700);
      root.style.setProperty("--accent-glow", vars.glow);
      root.style.setProperty("--orb1", vars.glowStrong);
    }
  }, [accentColor, customHex]);

  useEffect(() => {
    document.documentElement.classList.toggle("gradient-mode", gradientMode);
  }, [gradientMode]);

  const toggleGlass = () => setGlassMode((g) => !g);
  const toggleGradient = () => setGradientMode((g) => !g);

  const applyCustomColor = (hex) => {
    const normalised = /^#[0-9a-fA-F]{6}$/.test(hex)
      ? hex.toLowerCase()
      : /^[0-9a-fA-F]{6}$/.test(hex)
        ? `#${hex.toLowerCase()}`
        : hex;
    setCustomHex(normalised);
    setAccentColor("custom");
  };

  return (
    <UIContext.Provider
      value={{
        glassMode,
        toggleGlass,
        gradientMode,
        toggleGradient,
        accentColor,
        setAccentColor,
        customHex,
        applyCustomColor,
        accent, // <-- resolved palette, use this in components
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
