// Empty state shown when no tasks match the current filters.
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";

export function TaskEmpty({ onNewTask }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-5">
        <ClipboardList
          size={36}
          className="text-brand-400"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
        No tasks here
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
        Nothing matches your current filters. Try adjusting them or create a new
        task.
      </p>
      {onNewTask && (
        <Button variant="primary" size="md" onClick={onNewTask}>
          <Plus size={16} aria-hidden="true" />
          New Task
        </Button>
      )}
    </motion.div>
  );
}
