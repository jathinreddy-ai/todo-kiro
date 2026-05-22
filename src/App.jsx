// Root application component.
// Wires together auth, task context, layout, and all feature components.
import { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/layout/Layout";
import { StatsPanel } from "./components/dashboard/StatsPanel";
import { FilterBar } from "./components/filters/FilterBar";
import { SortMenu } from "./components/filters/SortMenu";
import { TaskList } from "./components/tasks/TaskList";
import { TaskForm } from "./components/tasks/TaskForm";
import { SkeletonList } from "./components/ui/Skeleton";
import { TaskProvider } from "./context/TaskContext";
import { useAuth } from "./context/AuthContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useReminders } from "./hooks/useReminders";
import { useTasks } from "./hooks/useTasks";

// Inner component — needs TaskProvider already mounted
function TaskApp() {
  const { tasks, isLoading } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const openNewTask = useCallback(() => {
    setEditTask(null);
    setFormOpen(true);
  }, []);
  const openEditTask = useCallback((task) => {
    setEditTask(task);
    setFormOpen(true);
  }, []);
  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditTask(null);
  }, []);

  const focusSearch = useCallback(() => {
    document.querySelector('input[type="search"]')?.focus();
  }, []);

  useKeyboardShortcuts({
    onNewTask: openNewTask,
    onFocusSearch: focusSearch,
    onCloseModal: closeForm,
  });
  useReminders(tasks);

  return (
    <Layout onNewTask={openNewTask}>
      <StatsPanel />

      {/* Filter + Sort toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-x-auto">
          <FilterBar />
        </div>
        <div className="flex-shrink-0 border-l border-slate-200 dark:border-slate-700 pl-3">
          <SortMenu />
        </div>
      </div>

      {/* Task list or skeleton */}
      {isLoading ? (
        <div className="px-4 py-3">
          <SkeletonList count={5} />
        </div>
      ) : (
        <TaskList onNewTask={openNewTask} onEdit={openEditTask} />
      )}

      <TaskForm isOpen={formOpen} onClose={closeForm} editTask={editTask} />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        }}
      />
    </Layout>
  );
}

// Root — wraps TaskProvider with the current user's ID
export default function App() {
  const { user } = useAuth();
  return (
    <TaskProvider userId={user?.id || null}>
      <TaskApp />
    </TaskProvider>
  );
}
