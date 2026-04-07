import { memo, useEffect, useState } from "react";
import AssetImage from "./AssetImage";
import BaseTemplateLayout from "./BaseTemplateLayout";
import TemplateBackdrop from "./TemplateBackdrop";
import type { EventConfig } from "./types";

type EventWaitingBannerProps = {
  eventConfig: EventConfig;
  exportDebugMode: boolean;
  aspectRatio: string;
  widthClass: string;
};

const waitingMessages = [
  "Nosso evento começará em breve...",
  "Prepare-se! Estamos quase lá.",
  "Acomode-se, já vamos iniciar.",
];

const MESSAGE_ROTATION_MS = 5000;

function EventWaitingBanner({
  eventConfig,
  exportDebugMode,
  aspectRatio,
  widthClass,
}: EventWaitingBannerProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % waitingMessages.length);
    }, MESSAGE_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <BaseTemplateLayout
      aspectRatio={aspectRatio}
      widthClass={widthClass}
      exportDebugMode={exportDebugMode}
    >
      <TemplateBackdrop
        exportDebugMode={exportDebugMode}
        gridOpacityClass="opacity-60"
        animateStars
      />

      <div className="relative z-10 h-full w-full px-6 py-8 sm:px-10 sm:py-12 flex flex-col justify-center items-center text-center">
        <div className="mb-5 sm:mb-7 animate-float-soft">
          <AssetImage
            src={eventConfig.assets.mascot}
            alt="Mascote do evento"
            className="w-40 h-40 sm:w-60 sm:h-60 object-cover rounded-full border border-white/20 shadow-[0_18px_50px_rgba(34,211,238,0.35)]"
          />
        </div>

        {/* <p className="font-orbitron text-cyan-300 text-xs sm:text-sm tracking-[0.22em] uppercase mb-4">
          Tela de Espera
        </p> */}

        <h1 className="font-space text-white font-bold text-3xl sm:text-5xl leading-tight max-w-5xl text-balance">
          {eventConfig.event.bannerEventTitle}
        </h1>

        <p className="mt-6 font-space text-cyan-100/95 text-lg sm:text-2xl font-medium transition-opacity duration-500">
          {waitingMessages[messageIndex]}
        </p>

        <div className="mt-8 rounded-2xl border border-white/15 bg-black/25 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 inline-flex items-center gap-2 sm:gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
          <p className="font-space text-cyan-100 text-sm sm:text-base">
            {eventConfig.event.dateTime} | {eventConfig.event.location}
          </p>
        </div>
      </div>
    </BaseTemplateLayout>
  );
}

export default memo(EventWaitingBanner);
