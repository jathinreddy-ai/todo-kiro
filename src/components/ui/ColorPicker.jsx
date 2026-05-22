// Accent color picker — preset swatches + custom color panel.
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Pipette } from "lucide-react";
import { useUI, ACCENT_COLORS } from "../../context/UIContext";
import { CustomColorPicker } from "./CustomColorPicker";
import { useTheme } from "../../context/ThemeContext";

export function ColorPicker() {
  const { accentColor, setAccentColor, customHex, applyCustomColor } = useUI();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowCustom(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset to preset view when closed
  useEffect(() => {
    if (!open) setShowCustom(false);
  }, [open]);

  const current =
    accentColor === "custom"
      ? {
          primary: customHex,
          label: "Custom",
          vars: {
            "--accent-400": customHex,
            "--accent-600": customHex,
            "--accent-glow": "rgba(0,0,0,0.2)",
          },
        }
      : ACCENT_COLORS.find((c) => c.id === accentColor) || ACCENT_COLORS[0];

  const isDark = theme === "dark";

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose accent color"
        aria-expanded={open}
        aria-haspopup="true"
        title="Accent color"
        className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 accent-ring"
      >
        <Palette size={18} aria-hidden="true" />
        <span
          className="absolute bottom-1 right-1 w-2 h-2 rounded-full border-2 border-white dark:border-slate-900"
          style={{ backgroundColor: current.primary }}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            transition={{ type: "spring", duration: 0.25 }}
            className="absolute right-0 top-full mt-2 z-50 p-4 rounded-2xl glass shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="Accent color picker"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!showCustom ? (
                /* ── Preset grid view ── */
                <motion.div
                  key="presets"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", duration: 0.22 }}
                  className="w-[272px]"
                >
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                    Accent Color
                  </p>

                  {/* 5-column preset grid */}
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {ACCENT_COLORS.map((color) => {
                      const isSelected = accentColor === color.id;
                      return (
                        <button
                          key={color.id}
                          onClick={() => {
                            setAccentColor(color.id);
                            setOpen(false);
                          }}
                          aria-label={`${color.label}${isSelected ? " (selected)" : ""}`}
                          aria-pressed={isSelected}
                          title={color.label}
                          className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                          style={{ "--tw-ring-color": color.primary }}
                        >
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
                            style={{
                              background: `linear-gradient(135deg, ${color.vars["--accent-400"]}, ${color.vars["--accent-600"]})`,
                              boxShadow: isSelected
                                ? `0 0 0 2px white, 0 0 0 4px ${color.primary}, 0 4px 12px ${color.vars["--accent-glow"]}`
                                : `0 2px 6px ${color.vars["--accent-glow"]}`,
                              transform: isSelected ? "scale(1.15)" : undefined,
                            }}
                          >
                            {isSelected && (
                              <Check
                                size={13}
                                className="text-white"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium leading-none truncate w-full text-center">
                            {color.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px bg-white/20 dark:bg-white/10 mb-3"
                    aria-hidden="true"
                  />

                  {/* Custom Color button */}
                  <button
                    onClick={() => setShowCustom(true)}
                    aria-label="Open custom color picker"
                    className={`
                      w-full flex items-center justify-center gap-2
                      px-4 py-2.5 rounded-xl text-sm font-semibold
                      transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                      focus-visible:outline-none focus-visible:ring-2 accent-ring
                      border
                      ${
                        isDark
                          ? "bg-black/50 backdrop-blur-md border-white/10 text-white hover:bg-black/60"
                          : "bg-white/70 backdrop-blur-md border-white/60 text-slate-900 hover:bg-white/90"
                      }
                      ${accentColor === "custom" ? "ring-2 ring-offset-1" : ""}
                    `}
                    style={
                      accentColor === "custom"
                        ? { "--tw-ring-color": customHex }
                        : {}
                    }
                  >
                    <Pipette size={15} aria-hidden="true" />
                    Custom Color
                    {accentColor === "custom" && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 ml-1"
                        style={{ backgroundColor: customHex }}
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {/* Current color preview */}
                  <div className="mt-3 pt-3 border-t border-white/20 dark:border-white/10 flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg shadow-sm flex-shrink-0"
                      style={{
                        background:
                          accentColor === "custom"
                            ? customHex
                            : `linear-gradient(135deg, ${current.vars["--accent-400"]}, ${current.vars["--accent-600"]})`,
                        boxShadow: `0 2px 8px ${current.vars["--accent-glow"]}`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">
                      {current.label}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto font-mono text-[10px]">
                      {current.primary}
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* ── Custom color panel ── */
                <CustomColorPicker
                  key="custom"
                  initialColor={
                    accentColor === "custom" ? customHex : current.primary
                  }
                  onBack={() => setShowCustom(false)}
                  onApply={(hex) => {
                    applyCustomColor(hex);
                    setOpen(false);
                    setShowCustom(false);
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
