// Progress statistics dashboard with animated progress bar.
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ListTodo,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useUI } from "../../context/UIContext";
import { useAccentStyle } from "../../hooks/useAccentStyle";

function StatCard({ icon: Icon, label, value, colorClass, glassMode }) {
  return (
    <div
      className={`${glassMode ? "glass-card" : "solid-card"} px-4 py-3 flex items-center gap-3`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
      >
        <Icon size={18} aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}

export function StatsPanel() {
  const { stats } = useTasks();
  const { glassMode } = useUI();
  const { progress, text } = useAccentStyle();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Overview
        </h2>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 accent-ring rounded"
          aria-label={collapsed ? "Expand overview" : "Collapse overview"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard
              icon={ListTodo}
              label="Total"
              value={stats.total}
              colorClass="bg-white/60 dark:bg-white/10 accent-text"
              glassMode={glassMode}
            />
            <StatCard
              icon={Circle}
              label="Active"
              value={stats.active}
              colorClass="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              glassMode={glassMode}
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={stats.completed}
              colorClass="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              glassMode={glassMode}
            />
            <StatCard
              icon={TrendingUp}
              label="Progress"
              value={`${stats.pct}%`}
              colorClass="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
              glassMode={glassMode}
            />
          </div>

          {/* Progress bar */}
          <div
            className={`${glassMode ? "glass-card" : "solid-card"} px-4 py-3 mb-2`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {stats.completed} of {stats.total} tasks completed
              </span>
              <span className="text-xs font-semibold" style={text}>
                {stats.pct}%
              </span>
            </div>
            <div className="h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={progress}
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.pct}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                role="progressbar"
                aria-valuenow={stats.pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${stats.pct}% of tasks completed`}
              />
            </div>
          </div>

          {stats.total > 0 && stats.pct === 100 && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-center text-green-600 dark:text-green-400 font-medium py-1"
            >
              🎉 All tasks complete — great work!
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
}
