// Toggle button that switches between glassmorphism and solid card styles.
import { motion } from "framer-motion";
import { Layers, Square } from "lucide-react";
import { useUI } from "../../context/UIContext";
import { Button } from "./Button";

export function GlassToggle() {
  const { glassMode, toggleGlass } = useUI();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleGlass}
      aria-label={glassMode ? "Switch to solid UI" : "Switch to glass UI"}
      title={
        glassMode
          ? "Glass mode on — click for solid"
          : "Solid mode — click for glass"
      }
    >
      <motion.span
        key={glassMode ? "glass" : "solid"}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className={glassMode ? "text-brand-500" : "text-slate-400"}
      >
        {glassMode ? (
          <Layers size={18} aria-hidden="true" />
        ) : (
          <Square size={18} aria-hidden="true" />
        )}
      </motion.span>
    </Button>
  );
}
