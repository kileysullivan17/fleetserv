import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

// Primary is the --fs-primary role: navy-900 with white text in light, and
// teal-500 with navy-950 text in dark (6.8:1). Teal never backs white text:
// it carries white at 2.6:1. Roles and values live in tokens.css.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-fs-primary text-fs-primary-fg hover:bg-fs-primary-hover focus-visible:ring-fs-focus",
  secondary:
    "bg-fs-surface text-fs-strong border border-fs-line-300 hover:bg-fs-tint focus-visible:ring-fs-focus",
  ghost:
    "text-fs-strong hover:bg-fs-tint focus-visible:ring-fs-focus",
  danger:
    "bg-fs-danger-solid text-white hover:bg-fs-danger-hover focus-visible:ring-fs-danger",
};

// 44px is the tap-target floor (--fs-touch-min): this is quoted in the yard,
// on a phone, with gloves on. sm stays dense for inline table actions.
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "min-h-[44px] px-4 py-2 text-sm",
  lg: "min-h-[44px] px-5 py-2.5 text-base",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-fs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
