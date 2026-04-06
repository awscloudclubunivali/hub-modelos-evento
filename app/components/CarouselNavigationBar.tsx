import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarouselNavigation } from "./types";

type CarouselNavigationBarProps = CarouselNavigation & {
  compact?: boolean;
};

export default function CarouselNavigationBar({
  title,
  index,
  total,
  canNavigate,
  onPrevious,
  onNext,
  compact = false,
}: CarouselNavigationBarProps) {
  const compactContainerClass =
    "w-auto min-w-[210px] max-w-[250px] sm:min-w-[380px] sm:max-w-[290px]";

  return (
    <div
      className={`${compact ? compactContainerClass : "w-full max-w-[1000px] mb-4"} flex items-center justify-between gap-1.5 rounded-xl border border-purple-500/30 bg-[#12032b]/70 ${compact ? "px-2 py-1.5" : "px-3 py-2"}`}
    >
      <button
        onClick={onPrevious}
        disabled={!canNavigate}
        className={`flex items-center gap-1 rounded-lg text-cyan-100 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed ${compact ? "h-8 w-8 justify-center" : "px-2 py-1"}`}
        aria-label="Anterior"
      >
        <ChevronLeft size={16} />
        {!compact ? "Anterior" : null}
      </button>
      <span
        className={`font-space text-cyan-100 text-center ${
          compact ? "text-xs max-w-[120px] truncate" : "text-xs sm:text-sm"
        }`}
      >
        {title} ({index + 1}/{total})
      </span>
      <button
        onClick={onNext}
        disabled={!canNavigate}
        className={`flex items-center gap-1 rounded-lg text-cyan-100 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed ${compact ? "h-8 w-8 justify-center" : "px-2 py-1"}`}
        aria-label="Proximo"
      >
        {!compact ? "Proximo" : null}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
