import { memo } from "react";
import type { ReactNode } from "react";

type BaseTemplateLayoutProps = {
  aspectRatio: string;
  widthClass: string;
  exportDebugMode?: boolean;
  captureId?: string;
  children: ReactNode;
};

function BaseTemplateLayout({
  aspectRatio,
  widthClass,
  exportDebugMode = false,
  captureId = "banner-capture",
  children,
}: BaseTemplateLayoutProps) {
  return (
    <div
      id={captureId}
      data-export-capture-root="true"
      data-export-debug={exportDebugMode ? "true" : "false"}
      style={{ aspectRatio }}
      className={`w-full ${widthClass} relative overflow-hidden flex flex-col transition-all duration-500 ease-in-out rounded-none`}
    >
      <div data-export-content-root="true" className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

export default memo(BaseTemplateLayout);
