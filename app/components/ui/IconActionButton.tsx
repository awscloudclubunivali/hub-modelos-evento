import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconActionButtonProps = {
  icon: ReactNode;
  label: string;
  compact?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">;

export default function IconActionButton({
  icon,
  label,
  compact = false,
  className,
  ...buttonProps
}: IconActionButtonProps) {
  const compactClass = compact
    ? "h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
    : "px-4 py-2 rounded-lg flex items-center gap-2";

  return (
    <button
      type="button"
      aria-label={label}
      className={`${compactClass} transition-all font-space text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12032b] ${className ?? ""}`}
      {...buttonProps}
    >
      {icon}
      {compact ? null : label}
    </button>
  );
}
