// Toggle button that switches gradient mode on/off for the entire UI.
// When on: buttons, icons, background, nav items, progress bar all use gradients.
// When off: everything uses the flat accent color.
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Minus } from "lucide-react";
import { useUI } from "../../context/UIContext";

export function GradientToggle() {
  const { gradientMode, toggleGradient } = useUI();

  return (
    <button
      onClick={toggleGradient}
      aria-label={
        gradientMode ? "Disable gradient mode" : "Enable gradient mode"
      }
      title={gradientMode ? "Gradient mode on" : "Gradient mode off"}
      className="relative p-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 accent-ring"
      style={
        gradientMode
          ? {
              background:
                "linear-gradient(135deg, var(--accent-500), var(--accent-700))",
              boxShadow: "0 2px 10px var(--accent-glow)",
            }
          : {}
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {gradientMode ? (
          <motion.span
            key="on"
            initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center"
          >
            <Sparkles size={18} className="text-white" aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="off"
            initial={{ scale: 0.6, opacity: 0, rotate: 30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, rotate: -30 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center"
          >
            <Sparkles
              size={18}
              className="text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
