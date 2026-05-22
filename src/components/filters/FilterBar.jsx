// Horizontal filter chip row: status, category, priority filters.
import { useTasks } from "../../hooks/useTasks";
import {
  STATUS_FILTERS,
  DEFAULT_CATEGORIES,
  PRIORITIES,
} from "../../utils/constants";
import { X } from "lucide-react";
import { useAccentStyle } from "../../hooks/useAccentStyle";

function Chip({ label, active, onClick, color }) {
  const { filled } = useAccentStyle();
  return (
    <button
      onClick={onClick}
      style={active ? filled : {}}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
        active
          ? ""
          : "bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-white/10"
      }`}
      aria-pressed={active}
    >
      {color && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      {label}
    </button>
  );
}

export function FilterBar() {
  const { filter, setFilter } = useTasks();
  const hasActiveFilters =
    filter.status !== "all" || filter.category || filter.priority;
  const clearFilters = () =>
    setFilter({ status: "all", category: null, priority: null, search: "" });

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
      {STATUS_FILTERS.map((s) => (
        <Chip
          key={s.id}
          label={s.label}
          active={filter.status === s.id}
          onClick={() => setFilter({ status: s.id })}
        />
      ))}

      <div
        className="w-px h-4 bg-white/30 dark:bg-white/10 flex-shrink-0 mx-1"
        aria-hidden="true"
      />

      {DEFAULT_CATEGORIES.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.label}
          active={filter.category === cat.id}
          color={cat.color}
          onClick={() =>
            setFilter({ category: filter.category === cat.id ? null : cat.id })
          }
        />
      ))}

      <div
        className="w-px h-4 bg-white/30 dark:bg-white/10 flex-shrink-0 mx-1"
        aria-hidden="true"
      />

      {PRIORITIES.map((p) => (
        <Chip
          key={p.id}
          label={p.label}
          active={filter.priority === p.id}
          color={p.color}
          onClick={() =>
            setFilter({ priority: filter.priority === p.id ? null : p.id })
          }
        />
      ))}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-500 bg-red-50/80 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ml-1"
          aria-label="Clear all filters"
        >
          <X size={11} aria-hidden="true" />
          Clear
        </button>
      )}
    </div>
  );
}
