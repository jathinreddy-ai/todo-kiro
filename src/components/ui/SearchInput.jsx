// Debounced search input wired to task filter state.
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";

export function SearchInput() {
  const { filter, setFilter } = useTasks();
  const [localValue, setLocalValue] = useState(filter.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter({ search: localValue });
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue]);

  useEffect(() => {
    if (filter.search !== localValue) setLocalValue(filter.search || "");
  }, [filter.search]);

  return (
    <div className="relative flex items-center">
      <Search
        size={15}
        className="absolute left-3 text-slate-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search tasks…"
        aria-label="Search tasks"
        className="w-full pl-9 pr-8 py-2 text-sm bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-xl outline-none text-slate-900 dark:text-white placeholder:text-slate-400 backdrop-blur-sm transition-all duration-200 focus:bg-white/70 dark:focus:bg-white/10 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-500)]/30"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => setLocalValue("")}
          aria-label="Clear search"
          className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
