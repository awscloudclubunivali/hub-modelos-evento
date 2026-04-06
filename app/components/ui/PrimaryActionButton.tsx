import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryActionButtonProps = {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  icon: ReactNode;
  loadingIcon?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export default function PrimaryActionButton({
  label,
  loading = false,
  loadingLabel = "Carregando...",
  icon,
  loadingIcon,
  className,
  disabled,
  type,
  ...buttonProps
}: PrimaryActionButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type ?? "button"}
      aria-busy={loading}
      disabled={isDisabled}
      className={`px-6 py-2.5 rounded-xl inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12032b] ${className ?? ""}`}
      {...buttonProps}
    >
      {loading ? loadingIcon ?? icon : icon}
      {loading ? loadingLabel : label}
    </button>
  );
}
