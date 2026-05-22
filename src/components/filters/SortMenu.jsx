// Sort dropdown menu.
import { ArrowUpDown } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { SORT_OPTIONS } from "../../utils/constants";

export function SortMenu() {
  const { sort, setSort } = useTasks();

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={14} className="text-slate-400" aria-hidden="true" />
      <label
        htmlFor="sort-select"
        className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap"
      >
        Sort:
      </label>
      <select
        id="sort-select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="text-xs bg-transparent text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        aria-label="Sort tasks by"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
