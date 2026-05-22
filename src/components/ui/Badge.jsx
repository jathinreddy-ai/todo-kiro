export function Badge({ label, bgClass, textClass, className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClass} ${textClass} ${className}`}
    >
      {label}
    </span>
  );
}
