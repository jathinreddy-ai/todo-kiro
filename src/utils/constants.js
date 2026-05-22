// Shared constants for priorities, categories, filter options, and sort options.

export const PRIORITIES = [
  {
    id: "high",
    label: "High",
    color: "#ef4444",
    bgClass: "bg-red-100 dark:bg-red-900/30",
    textClass: "text-red-700 dark:text-red-400",
    dotClass: "bg-priority-high",
  },
  {
    id: "medium",
    label: "Medium",
    color: "#f59e0b",
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    textClass: "text-amber-700 dark:text-amber-400",
    dotClass: "bg-priority-medium",
  },
  {
    id: "low",
    label: "Low",
    color: "#22c55e",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    textClass: "text-green-700 dark:text-green-400",
    dotClass: "bg-priority-low",
  },
];

export const DEFAULT_CATEGORIES = [
  {
    id: "work",
    label: "Work",
    color: "#6366f1",
    bgClass: "bg-indigo-100 dark:bg-indigo-900/30",
    textClass: "text-indigo-700 dark:text-indigo-400",
  },
  {
    id: "personal",
    label: "Personal",
    color: "#ec4899",
    bgClass: "bg-pink-100 dark:bg-pink-900/30",
    textClass: "text-pink-700 dark:text-pink-400",
  },
  {
    id: "shopping",
    label: "Shopping",
    color: "#14b8a6",
    bgClass: "bg-teal-100 dark:bg-teal-900/30",
    textClass: "text-teal-700 dark:text-teal-400",
  },
  {
    id: "health",
    label: "Health",
    color: "#f97316",
    bgClass: "bg-orange-100 dark:bg-orange-900/30",
    textClass: "text-orange-700 dark:text-orange-400",
  },
  {
    id: "learning",
    label: "Learning",
    color: "#8b5cf6",
    bgClass: "bg-violet-100 dark:bg-violet-900/30",
    textClass: "text-violet-700 dark:text-violet-400",
  },
];

export const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

export const SORT_OPTIONS = [
  { id: "manual", label: "Manual Order" },
  { id: "priority", label: "Priority" },
  { id: "dueDate", label: "Due Date" },
  { id: "createdAt", label: "Creation Date" },
  { id: "status", label: "Status" },
];

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
