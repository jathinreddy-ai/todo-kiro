// Returns inline style objects for accent-colored elements.
// Using inline styles guarantees the color always reflects the current accent,
// regardless of CSS specificity or class ordering.
import { useUI } from "../context/UIContext";

export function useAccentStyle() {
  const { accent, gradientMode } = useUI();

  // Solid filled surface (button, badge, chip)
  const filled = {
    backgroundColor: gradientMode
      ? undefined // gradient set via backgroundImage below
      : accent.c500,
    backgroundImage: gradientMode
      ? `linear-gradient(135deg, ${accent.c500}, ${accent.c700})`
      : "none",
    boxShadow: `0 4px 14px ${accent.glow}`,
    color: "#ffffff",
  };

  // Smaller filled surface (logo orb, small badge)
  const filledSm = {
    ...filled,
    boxShadow: `0 2px 8px ${accent.glow}`,
  };

  // Text color only
  const text = { color: accent.c500 };

  // Border color only
  const border = { borderColor: accent.c500 };

  // Focus ring color (for CSS custom property)
  const ring = { "--tw-ring-color": accent.c500 };

  // Progress bar fill
  const progress = {
    backgroundColor: gradientMode ? undefined : accent.c500,
    backgroundImage: gradientMode
      ? `linear-gradient(90deg, ${accent.c400}, ${accent.c600})`
      : "none",
  };

  // Gradient text (for headings/logo)
  const gradientText = gradientMode
    ? {
        background: `linear-gradient(135deg, ${accent.c500}, ${accent.c400})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : { color: accent.c500 };

  return {
    filled,
    filledSm,
    text,
    border,
    ring,
    progress,
    gradientText,
    accent,
  };
}
