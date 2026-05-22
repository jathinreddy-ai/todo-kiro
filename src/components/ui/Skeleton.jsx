export function SkeletonCard() {
  return (
    <div className="glass-card p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
