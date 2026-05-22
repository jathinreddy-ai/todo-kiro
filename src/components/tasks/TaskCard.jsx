// Individual task card with priority bar, badges, due date, and action buttons.
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useUI } from "../../context/UIContext";
import {
  Pencil,
  Trash2,
  GripVertical,
  Calendar,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { useTasks } from "../../hooks/useTasks";
import { PRIORITIES, DEFAULT_CATEGORIES } from "../../utils/constants";
import { isOverdue, isDueToday } from "../../utils/taskHelpers";
import toast from "react-hot-toast";

const PRIORITY_BAR = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const TaskCard = memo(function TaskCard({
  task,
  dragHandleProps,
  isDragging,
}) {
  const { toggleTask, deleteTask } = useTasks();
  const { glassMode } = useUI();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const priority = PRIORITIES.find((p) => p.id === task.priority);
  const categories = DEFAULT_CATEGORIES.filter((c) =>
    task.categories.includes(c.id),
  );
  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);

  const handleToggle = () => {
    toggleTask(task.id);
    toast.success(task.completed ? "Task reopened" : "Task completed! 🎉");
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteTask(task.id);
      toast.error("Task deleted");
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, scale: 0.95 }}
      whileHover={!isDragging ? { scale: 1.005, y: -1 } : {}}
      transition={{ duration: 0.18 }}
      className={`group relative flex items-start gap-3 p-4 ${glassMode ? "glass-card" : "solid-card"} overflow-hidden transition-shadow ${
        isDragging ? "shadow-2xl ring-2 ring-brand-500/40" : ""
      } ${task.completed ? "opacity-70" : ""}`}
    >
      {/* Priority color bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${PRIORITY_BAR[task.priority]} rounded-l-2xl`}
        aria-hidden="true"
      />

      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="flex-shrink-0 mt-0.5 text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Drag to reorder"
        role="button"
        tabIndex={0}
      >
        <GripVertical size={16} aria-hidden="true" />
      </div>

      {/* Checkbox */}
      <button
        onClick={handleToggle}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        aria-pressed={task.completed}
        className="flex-shrink-0 mt-0.5 text-slate-300 dark:text-slate-600 hover:text-brand-500 dark:hover:text-brand-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        {task.completed ? (
          <CheckCircle2
            size={20}
            className="text-green-500"
            aria-hidden="true"
          />
        ) : (
          <Circle size={20} aria-hidden="true" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            task.completed
              ? "line-through text-slate-400 dark:text-slate-500"
              : "text-slate-900 dark:text-white"
          }`}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {/* Priority badge */}
          {priority && (
            <Badge
              label={priority.label}
              bgClass={priority.bgClass}
              textClass={priority.textClass}
            />
          )}

          {/* Category badges */}
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              label={cat.label}
              bgClass={cat.bgClass}
              textClass={cat.textClass}
            />
          ))}

          {/* Due date chip */}
          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                overdue
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : dueToday
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
              aria-label={`Due ${overdue ? "overdue: " : dueToday ? "today: " : ""}${formatDate(task.dueDate)}`}
            >
              <Calendar size={10} aria-hidden="true" />
              {overdue ? "Overdue · " : dueToday ? "Today · " : ""}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        {/* Edit — passed via prop from TaskList */}
        <button
          data-edit-btn
          aria-label={`Edit task: ${task.title}`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Pencil size={14} aria-hidden="true" />
        </button>

        {/* Delete with inline confirm */}
        <button
          onClick={handleDelete}
          aria-label={
            confirmDelete ? "Confirm delete" : `Delete task: ${task.title}`
          }
          className={`p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
            confirmDelete
              ? "text-white bg-red-500 hover:bg-red-600"
              : "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          }`}
        >
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
});
