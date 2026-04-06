import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type SegmentedControlProps<T extends string> = {
  options: Array<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleArrowNavigation = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const key = event.key;
    const isHorizontalMove = key === "ArrowRight" || key === "ArrowLeft";
    const isEdgeMove = key === "Home" || key === "End";

    if (!isHorizontalMove && !isEdgeMove) {
      return;
    }

    event.preventDefault();

    let nextIndex = currentIndex;
    if (key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = options.length - 1;
    }

    const nextOption = options[nextIndex];
    onChange(nextOption.value);
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`flex gap-2 ${className ?? ""}`}
    >
      {options.map((option, index) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleArrowNavigation(event, index)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-space text-sm ${
              isActive
                ? "bg-cyan-400 text-[#12032b] font-bold"
                : "hover:bg-white/10 text-cyan-100"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12032b]`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
