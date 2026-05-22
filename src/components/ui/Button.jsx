// Reusable button — primary variant uses accent from context so color picker works instantly.
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { useAccentStyle } from "../../hooks/useAccentStyle";

const MotionButton = motion.button;

const variantClass = {
  secondary:
    "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200",
  ghost:
    "hover:bg-white/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/30",
  outline:
    "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
  icon: "p-2 rounded-xl",
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    className = "",
    onClick,
    type = "button",
    "aria-label": ariaLabel,
    style,
    ...props
  },
  ref,
) {
  const { filled } = useAccentStyle();
  const isPrimary = variant === "primary";

  return (
    <MotionButton
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      style={isPrimary ? { ...filled, ...style } : style}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isPrimary ? "text-white hover:opacity-90" : variantClass[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </MotionButton>
  );
});
