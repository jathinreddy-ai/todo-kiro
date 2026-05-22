// Custom color picker panel — color wheel, hex input, RGB sliders.
// Shown when user clicks "Custom Color" in the ColorPicker popover.
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from "@uiw/react-color-shade-slider";
import {
  hsvaToHex,
  hexToHsva,
  hsvaToRgba,
  rgbaToHsva,
} from "@uiw/color-convert";
import { useAccentStyle } from "../../hooks/useAccentStyle";

// Clamp a number between min and max
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Convert hex string to { r, g, b } — returns null if invalid
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const n = parseInt(clean, 16);
  if (isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// Zero-pad a hex component
const toHex2 = (n) =>
  Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, "0");

export function CustomColorPicker({
  onBack,
  onApply,
  initialColor = "#6366f1",
}) {
  const [hsva, setHsva] = useState(() => hexToHsva(initialColor));
  const [hexInput, setHexInput] = useState(
    initialColor.replace("#", "").toUpperCase(),
  );
  const [hexError, setHexError] = useState(false);
  const { filled } = useAccentStyle();

  const currentHex = "#" + hsvaToHex(hsva).toUpperCase();
  const { r, g, b } = hsvaToRgba(hsva);

  // ── Sync helpers ────────────────────────────────────────────────────────────
  const applyHsva = useCallback((newHsva) => {
    setHsva(newHsva);
    setHexInput(hsvaToHex(newHsva).toUpperCase());
    setHexError(false);
  }, []);

  // ── Hex input ───────────────────────────────────────────────────────────────
  const handleHexChange = (e) => {
    const raw = e.target.value.replace("#", "").toUpperCase();
    setHexInput(raw);
    if (raw.length === 6) {
      const rgb = hexToRgb(raw);
      if (rgb) {
        setHsva(hexToHsva("#" + raw));
        setHexError(false);
      } else {
        setHexError(true);
      }
    } else {
      setHexError(raw.length > 0);
    }
  };

  // ── RGB channel change ──────────────────────────────────────────────────────
  const handleRgbChange = (channel, value) => {
    const val = clamp(parseInt(value) || 0, 0, 255);
    const newRgb = {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
      [channel]: val,
    };
    const newHsva = rgbaToHsva({ ...newRgb, a: 1 });
    applyHsva(newHsva);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", duration: 0.25 }}
      className="w-[272px]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          aria-label="Back to color presets"
          className="p-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 accent-ring"
        >
          <ArrowLeft size={15} aria-hidden="true" />
        </button>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          Custom Color
        </p>
      </div>

      {/* Color wheel */}
      <div className="flex justify-center mb-3">
        <Wheel
          color={hsva}
          onChange={(c) => applyHsva({ ...hsva, ...c.hsva })}
          width={200}
          height={200}
        />
      </div>

      {/* Shade / brightness slider */}
      <div className="mb-4">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
          Brightness
        </p>
        <ShadeSlider
          hsva={hsva}
          onChange={(v) => applyHsva({ ...hsva, ...v })}
          style={{ width: "100%", height: 14, borderRadius: 8 }}
        />
      </div>

      {/* Hex input */}
      <div className="mb-4">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
          Hex
        </p>
        <div className="flex items-center gap-2">
          {/* Live preview swatch */}
          <div
            className="w-8 h-8 rounded-lg flex-shrink-0 shadow-sm border border-white/30 dark:border-white/10"
            style={{ backgroundColor: currentHex }}
            aria-hidden="true"
          />
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono select-none">
              #
            </span>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              maxLength={6}
              spellCheck={false}
              aria-label="Hex color value"
              aria-invalid={hexError}
              className={`w-full pl-7 pr-3 py-2 text-sm font-mono rounded-xl border bg-white/40 dark:bg-white/5 text-slate-900 dark:text-white outline-none transition-all focus:ring-2 ${
                hexError
                  ? "border-red-400 focus:ring-red-400/40"
                  : "border-white/40 dark:border-white/10 focus:border-[var(--accent-500)] focus:ring-[var(--accent-500)]/30"
              }`}
            />
          </div>
        </div>
        {hexError && (
          <p className="text-[10px] text-red-500 mt-1">
            Enter a valid 6-digit hex
          </p>
        )}
      </div>

      {/* RGB sliders */}
      <div className="mb-5 space-y-2.5">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
          RGB
        </p>
        {[
          {
            label: "R",
            channel: "r",
            value: Math.round(r),
            color: "#ef4444",
            track: "from-black to-red-500",
          },
          {
            label: "G",
            channel: "g",
            value: Math.round(g),
            color: "#22c55e",
            track: "from-black to-green-500",
          },
          {
            label: "B",
            channel: "b",
            value: Math.round(b),
            color: "#3b82f6",
            track: "from-black to-blue-500",
          },
        ].map(({ label, channel, value, color, track }) => (
          <div key={channel} className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold w-3 flex-shrink-0"
              style={{ color }}
            >
              {label}
            </span>
            <input
              type="range"
              min={0}
              max={255}
              value={value}
              onChange={(e) => handleRgbChange(channel, e.target.value)}
              aria-label={`${label} channel: ${value}`}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #000 0%, ${color} 100%)`,
                accentColor: color,
              }}
            />
            <input
              type="number"
              min={0}
              max={255}
              value={value}
              onChange={(e) => handleRgbChange(channel, e.target.value)}
              aria-label={`${label} value`}
              className="w-10 text-center text-xs font-mono rounded-lg border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[var(--accent-500)] py-1"
            />
          </div>
        ))}
      </div>

      {/* Apply button */}
      <button
        onClick={() => onApply(currentHex)}
        style={filled}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      >
        <Check size={15} aria-hidden="true" />
        Apply Color
      </button>
    </motion.div>
  );
}
