import { memo } from "react";

type TemplateBackdropProps = {
  starsOpacityClass?: string;
  gridOpacityClass?: string;
  exportDebugMode?: boolean;
  animateStars?: boolean;
};

function TemplateBackdrop({
  starsOpacityClass = "opacity-70",
  gridOpacityClass = "opacity-40",
  exportDebugMode = false,
  animateStars = false,
}: TemplateBackdropProps) {
  const blendSafeStyle = exportDebugMode
    ? ({ mixBlendMode: "normal", filter: "none", animation: "none" } as const)
    : undefined;

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0216] via-[#1a0833] to-[#2a0845] z-0"></div>
      <div className={`absolute inset-0 bg-grid-pattern z-0 ${gridOpacityClass}`}></div>
        <div
          data-capture-risk="blend-layer"
          data-export-opacity="0.24"
          style={
            exportDebugMode
              ? {
                  ...blendSafeStyle,
                  opacity: 0.24,
                }
              : undefined
          }
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-cyan-600/20 blur-[120px] rounded-full z-0 pointer-events-none mix-blend-screen"
        ></div>
        <div
          data-capture-risk="blend-layer"
          data-export-opacity="0.30"
          style={
            exportDebugMode
              ? {
                  ...blendSafeStyle,
                  opacity: 0.3,
                }
              : undefined
          }
          className="absolute -bottom-[10%] -left-[20%] w-[70%] h-[70%] bg-purple-600/30 blur-[130px] rounded-full z-0 pointer-events-none mix-blend-screen"
        ></div>
      <div
          data-capture-risk="blend-layer"
          data-export-opacity={starsOpacityClass === "opacity-50" ? "0.5" : "0.7"}
          style={
            exportDebugMode
              ? {
                  ...blendSafeStyle,
                  opacity: starsOpacityClass === "opacity-50" ? 0.5 : 0.7,
                }
              : undefined
          }
        className={`absolute inset-0 stars-organic pointer-events-none mix-blend-screen z-0 ${starsOpacityClass} ${
          animateStars ? "animate-stars-twinkle-drift" : ""
        }`}
      ></div>
      {animateStars ? (
        <div
          data-capture-risk="blend-layer"
          data-export-opacity="0.34"
          className="absolute inset-0 stars-organic pointer-events-none mix-blend-screen z-0 opacity-35 animate-stars-twinkle-drift-reverse"
        ></div>
      ) : null}
    </>
  );
}

export default memo(TemplateBackdrop);
