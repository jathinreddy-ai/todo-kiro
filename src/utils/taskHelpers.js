// Pure utility functions for filtering, sorting, and searching tasks.
import { PRIORITY_ORDER } from "./constants";

/**
 * Filter tasks by status, category, and priority.
 */
export function filterTasks(tasks, filter) {
  return tasks.filter((task) => {
    // Status filter
    if (filter.status === "active" && task.completed) return false;
    if (filter.status === "completed" && !task.completed) return false;

    // Category filter
    if (filter.category && !task.categories.includes(filter.category))
      return false;

    // Priority filter
    if (filter.priority && task.priority !== filter.priority) return false;

    return true;
  });
}

/**
 * Search tasks by title or description (case-insensitive).
 */
export function searchTasks(tasks, query) {
  if (!query || !query.trim()) return tasks;
  const q = query.toLowerCase().trim();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(q) ||
      (task.description && task.description.toLowerCase().includes(q)),
  );
}

/**
 * Sort tasks by the given sort key.
 * 'manual' preserves the task.order field.
 */
export function sortTasks(tasks, sort) {
  const sorted = [...tasks];
  switch (sort) {
    case "priority":
      return sorted.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
      );
    case "dueDate":
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case "createdAt":
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    case "status":
      return sorted.sort((a, b) => Number(a.completed) - Number(b.completed));
    case "manual":
    default:
      return sorted.sort((a, b) => a.order - b.order);
  }
}

/**
 * Compose filter + search + sort into a single pipeline.
 */
export function getVisibleTasks(tasks, filter, sort) {
  const filtered = filterTasks(tasks, filter);
  const searched = searchTasks(filtered, filter.search);
  return sortTasks(searched, sort);
}

/**
 * Check if a task's due date is overdue (past today, not completed).
 */
export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

/**
 * Check if a task is due today.
 */
export function isDueToday(task) {
  if (!task.dueDate || task.completed) return false;
  return task.dueDate === new Date().toISOString().split("T")[0];
}

/**
 * Check if a task is due within the next 24 hours (for reminders).
 */
export function isDueSoon(task) {
  if (!task.dueDate || task.completed) return false;
  const due = new Date(task.dueDate);
  const now = new Date();
  const diff = due - now;
  return diff >= 0 && diff <= 24 * 60 * 60 * 1000;
}
