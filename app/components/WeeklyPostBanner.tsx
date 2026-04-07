import { memo } from "react";
import AssetImage from "./AssetImage";
import TemplateFooter from "./TemplateFooter";
import BaseTemplateLayout from "./BaseTemplateLayout";
import { getSizes } from "./config";
import TemplateBackdrop from "./TemplateBackdrop";
import type { EventConfig, Format } from "./types";

type WeeklyPostBannerProps = {
  eventConfig: EventConfig;
  exportDebugMode: boolean;
  aspectRatio: string;
  widthClass: string;
  format: Format;
};

function WeeklyPostBanner({
  eventConfig,
  exportDebugMode,
  aspectRatio,
  widthClass,
  format,
}: WeeklyPostBannerProps) {
  const sizes = getSizes(format);
  const isInstagram = format === "instagram";

  return (
    <BaseTemplateLayout
      aspectRatio={aspectRatio}
      widthClass={widthClass}
      exportDebugMode={exportDebugMode}
    >
      <TemplateBackdrop exportDebugMode={exportDebugMode} />

      <div className={`relative z-10 h-full w-full flex flex-col ${sizes.containerPad}`}>
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-5 sm:gap-6 md:gap-7 px-1 py-2 sm:py-3">
          <div className="w-full max-w-[760px] flex items-center justify-start gap-3 sm:gap-4">
            <div className="h-[2px] w-8 bg-cyan-400" />
            <span className="font-orbitron text-cyan-300 tracking-[0.18em] text-[10px] uppercase">
              Publicacao Semanal
            </span>
          </div>

          <div className="w-full flex justify-center min-w-0">
            <div className={`w-full min-w-0 ${isInstagram ? "max-w-[180px]" : "max-w-[250px]"}`}>
              <div className="w-full rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm p-4 sm:p-5 shadow-[0_0_32px_rgba(34,211,238,0.18)]">
                <AssetImage
                  src={eventConfig.weeklyPost.image}
                  alt="Imagem da solucao AWS"
                  className="w-full aspect-square object-contain"
                />
              </div>
            </div>
          </div>

          <h1 className="w-full max-w-[760px] text-center font-space text-white font-bold text-4xl leading-tight text-balance">
            {eventConfig.weeklyPost.title}
          </h1>

          <p className="w-full max-w-[740px] text-center font-space text-cyan-100/85 text-sm sm:text-base leading-relaxed rounded-2xl border border-white/10 bg-black/25 px-4 py-3 sm:px-5 sm:py-2">
            {eventConfig.weeklyPost.hookSentence}
          </p>
        </div>

        <TemplateFooter
          sizes={sizes}
          format={format}
          socials={eventConfig.event.socials}
        />
      </div>
    </BaseTemplateLayout>
  );
}

export default memo(WeeklyPostBanner);
