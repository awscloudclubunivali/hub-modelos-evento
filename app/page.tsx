"use client";

import { useCallback, useEffect, useState } from "react";
import Controls from "./components/Controls";
import TemplateCanvas from "./components/TemplateCanvas";
import { BannerExportError, exportBannerAsPng } from "./components/export-banner";
import { useBannerHubState } from "./components/use-banner-hub-state";

const GLOBAL_DECORATIVE_STYLES = `
  .bg-grid-pattern {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .stars-organic {
    background-image:
      radial-gradient(1px 1px at 25px 25px, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1.5px 1.5px at 75px 45px, rgba(255, 255, 255, 0.9), transparent),
      radial-gradient(2px 2px at 15px 85px, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1px 1px at 85px 95px, rgba(255, 255, 255, 0.6), transparent);
    background-size: 113px 113px, 197px 197px, 271px 271px, 331px 331px;
  }

  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.4); border-radius: 4px; }
  .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.8); }
  .no-scrollbar::-webkit-scrollbar { display: none; }

  [data-export-capture-root='true'][data-export-debug='true'] .bg-clip-text.text-transparent {
    background: none !important;
    background-image: none !important;
    color: #fff !important;
    -webkit-text-fill-color: #fff !important;
  }

  [data-export-capture-root='true'][data-export-debug='true'] [data-export-force-white='true'] {
    filter: brightness(0) saturate(100%) invert(100%) !important;
    mix-blend-mode: normal !important;
    opacity: 0.95 !important;
  }

  #banner-capture:fullscreen {
    width: 100vw;
    height: 100vh;
    padding: 1.5rem;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #05050a;
  }

  #banner-capture:fullscreen {
    width: min(100vw, 177.78vh) !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    box-shadow: none !important;
  }

  #banner-capture:fullscreen [data-export-content-root='true'] {
    overflow: hidden;
  }
`;

export default function Page() {
  const {
    format,
    setFormat,
    pageView,
    handleChangePage,
    profileBannerVariant,
    setProfileBannerVariant,
    isDownloading,
    setIsDownloading,
    exportDebugMode,
    setExportDebugMode,
    eventConfig,
    sizes,
    isHorizontal,
    orderedSpeakerIds,
    activeSpeaker,
    activeSpeakerKey,
    activeSupporter,
    activeSponsor,
    isClubPromoView,
    isMeetupEventView,
    isProfileBannerView,
    isSupportersView,
    isSponsorsView,
    pageButtons,
    carouselNavigation,
    availableFormats,
    captureFrame,
  } = useBannerHubState();
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const bannerRoot = document.getElementById("banner-capture");
      setIsFullscreen(document.fullscreenElement === bannerRoot);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!downloadError) {
      return;
    }

    const timerId = setTimeout(() => setDownloadError(null), 4500);
    return () => clearTimeout(timerId);
  }, [downloadError]);

  const handleDownload = useCallback(async () => {
    setDownloadError(null);
    setIsDownloading(true);

    try {
      await exportBannerAsPng({
        pageView,
        profileBannerVariant,
        format,
        activeSpeakerKey,
        downloadPrefix: eventConfig.event.downloadPrefix,
        isProfileBannerView,
        isMeetupEventView,
      });
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      if (error instanceof BannerExportError) {
        setDownloadError(error.userMessage);
      } else if (error instanceof Error) {
        setDownloadError(error.message);
      } else {
        setDownloadError(
          "Falha ao gerar imagem. Abra o console (F12) para ver o erro detalhado; normalmente e CORS de imagem ou bloqueio de recurso externo.",
        );
      }
    } finally {
      setIsDownloading(false);
    }
  }, [
    activeSpeakerKey,
    eventConfig.event.downloadPrefix,
    format,
    isMeetupEventView,
    isProfileBannerView,
    pageView,
    profileBannerVariant,
    setIsDownloading,
  ]);

  const handleToggleFullscreen = useCallback(async () => {
    const bannerRoot = document.getElementById("banner-capture");
    if (!bannerRoot) {
      return;
    }

    try {
      if (document.fullscreenElement === bannerRoot) {
        await document.exitFullscreen();
      } else {
        await bannerRoot.requestFullscreen();
      }
    } catch (error) {
      console.error("Falha ao alternar tela cheia:", error);
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-[#05050a] flex flex-col items-center justify-center p-4 md:p-8 text-slate-100"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: GLOBAL_DECORATIVE_STYLES,
        }}
      />

      <Controls
        format={format}
        pageView={pageView}
        isDownloading={isDownloading}
        pageButtons={pageButtons}
        carouselNavigation={carouselNavigation}
        profileBannerVariant={profileBannerVariant}
        exportDebugMode={exportDebugMode}
        onChangeProfileBannerVariant={setProfileBannerVariant}
        onToggleExportDebugMode={() => setExportDebugMode((prev) => !prev)}
        availableFormats={availableFormats}
        onChangeFormat={setFormat}
        onChangePage={handleChangePage}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        onDownload={handleDownload}
      />

      {downloadError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full max-w-3xl mb-4 rounded-lg border border-rose-300/30 bg-rose-500/15 px-4 py-3 text-sm text-rose-100"
        >
          {downloadError}
        </div>
      ) : null}

      <TemplateCanvas
        eventConfig={eventConfig}
        sizes={sizes}
        format={format}
        pageView={pageView}
        profileBannerVariant={profileBannerVariant}
        exportDebugMode={exportDebugMode}
        captureAspectRatio={captureFrame.aspectRatio}
        captureWidthClass={captureFrame.widthClass}
        isHorizontal={isHorizontal}
        isProfileBannerView={isProfileBannerView}
        isClubPromoView={isClubPromoView}
        isMeetupEventView={isMeetupEventView}
        isSupportersView={isSupportersView}
        isSponsorsView={isSponsorsView}
        activeSupporter={activeSupporter}
        activeSponsor={activeSponsor}
        activeSpeaker={activeSpeaker}
        activeSpeakerKey={activeSpeakerKey}
        orderedSpeakerIds={orderedSpeakerIds}
      />
    </div>
  );
}
