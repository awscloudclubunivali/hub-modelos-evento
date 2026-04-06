import type { ReactNode } from "react";

type ControlSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export default function ControlSurface({ children, className }: ControlSurfaceProps) {
  return (
    <div
      className={`bg-[#12032b] rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(76,29,149,0.3)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
