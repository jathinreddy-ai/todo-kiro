// Global keyboard shortcut handler.
// Suppressed when focus is inside input/textarea/contenteditable.
import { useEffect } from "react";

const EDITABLE = ["INPUT", "TEXTAREA", "SELECT"];

export function useKeyboardShortcuts({
  onNewTask,
  onFocusSearch,
  onCloseModal,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      const isEditable =
        EDITABLE.includes(tag) || document.activeElement?.isContentEditable;

      if (e.key === "Escape") {
        onCloseModal?.();
        return;
      }

      if (isEditable) return;

      if ((e.key === "n" || e.key === "N") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onNewTask?.();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        onNewTask?.();
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        onFocusSearch?.();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNewTask, onFocusSearch, onCloseModal]);
}
