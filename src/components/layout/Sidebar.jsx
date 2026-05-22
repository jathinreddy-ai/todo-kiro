// Responsive sidebar navigation.
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Tag,
  LayoutDashboard,
} from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { DEFAULT_CATEGORIES } from "../../utils/constants";
import { useAccentStyle } from "../../hooks/useAccentStyle";

const NAV_ITEMS = [
  {
    id: "all",
    label: "All Tasks",
    icon: LayoutDashboard,
    filter: { status: "all", category: null },
  },
  {
    id: "active",
    label: "Active",
    icon: Clock,
    filter: { status: "active", category: null },
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle2,
    filter: { status: "completed", category: null },
  },
  {
    id: "today",
    label: "Due Today",
    icon: Calendar,
    filter: { status: "active", category: null },
  },
];

function SidebarContent({ onNewTask, onClose }) {
  const { filter, setFilter, tasks } = useTasks();
  const { filled, filledSm, text, gradientText } = useAccentStyle();

  const handleNavClick = (navFilter) => {
    setFilter(navFilter);
    onClose?.();
  };
  const handleCategoryClick = (catId) => {
    setFilter({ category: filter.category === catId ? null : catId });
    onClose?.();
  };
  const getCategoryCount = (catId) =>
    tasks.filter((t) => t.categories.includes(catId) && !t.completed).length;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/20 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={filledSm}
          >
            <CheckSquare size={16} className="text-white" aria-hidden="true" />
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={gradientText}
          >
            Taskflow
          </span>
        </div>
      </div>

      {/* New Task Button */}
      <div className="px-4 py-4">
        <button
          onClick={onNewTask}
          aria-label="Create new task"
          style={filled}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Plus size={16} aria-hidden="true" />
          New Task
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1 overflow-y-auto" aria-label="Main navigation">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Views
        </p>
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              filter.status === item.filter.status &&
              filter.category === item.filter.category;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.filter)}
                  style={
                    isActive
                      ? {
                          ...filled,
                          boxShadow: `0 2px 10px ${filled.boxShadow?.split(" ").pop() || "rgba(0,0,0,0.2)"}`,
                        }
                      : {}
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    isActive
                      ? ""
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={17} aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Categories */}
        <p className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Tag size={11} aria-hidden="true" />
          Categories
        </p>
        <ul className="space-y-0.5" role="list">
          {DEFAULT_CATEGORIES.map((cat) => {
            const isActive = filter.category === cat.id;
            const count = getCategoryCount(cat.id);
            return (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    isActive
                      ? "bg-white/60 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  aria-pressed={isActive}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-left">{cat.label}</span>
                  {count > 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/20 dark:border-white/5">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Taskflow — Stay productive
        </p>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onClose, onNewTask, glassMode }) {
  const sidebarClass = glassMode
    ? "glass border-r border-white/30 dark:border-white/8"
    : "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800";

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 ${sidebarClass}`}
      >
        <SidebarContent onNewTask={onNewTask} />
      </aside>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed left-0 top-0 bottom-0 z-50 w-64 shadow-2xl lg:hidden ${sidebarClass}`}
              aria-label="Navigation drawer"
            >
              <SidebarContent onNewTask={onNewTask} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
