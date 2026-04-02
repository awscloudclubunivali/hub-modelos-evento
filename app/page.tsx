"use client";

import { Calendar, Camera, Link, MapPin } from "lucide-react";
import { toBlob, toPng } from "html-to-image";
import { useEffect, useMemo, useState } from "react";
import BannerFooter from "./components/BannerFooter";
import Controls from "./components/Controls";
import AssetImage from "./components/AssetImage";
import FeaturedSpeakerCard from "./components/FeaturedSpeakerCard";
import GalacticBanner from "./components/GalacticBanner";
import MainTalkCards from "./components/MainTalkCards";
import { getAspectRatio, getSizes } from "./components/config";
import { defaultEventConfig, loadEventConfig } from "./components/event-config";
import type {
  EventBannerVariant,
  EventConfig,
  Format,
  PageView,
  ProfileBannerVariant,
  SpeakerKey,
} from "./components/types";

const resolveSpeakerKey = (pageView: PageView, fallback: SpeakerKey): SpeakerKey => {
  if (pageView === "main" || pageView === "galactic") {
    return fallback;
  }
  return pageView.replace("speaker:", "");
};

const sanitizeFilePart = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function Page() {
  const [format, setFormat] = useState<Format>("a4");
  const [pageView, setPageView] = useState<PageView>("main");
  const [eventBannerVariant, setEventBannerVariant] =
    useState<EventBannerVariant>("default");
  const [profileBannerVariant, setProfileBannerVariant] =
    useState<ProfileBannerVariant>("meetup");
  const [isDownloading, setIsDownloading] = useState(false);
  const [eventConfig, setEventConfig] =
    useState<EventConfig>(defaultEventConfig);

  useEffect(() => {
    let active = true;
    loadEventConfig().then((config) => {
      if (active) {
        setEventConfig(config);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const sizes = useMemo(() => getSizes(format), [format]);
  const isHorizontal = format === "linkedin";
  const orderedSpeakerIds =
    eventConfig.speakerOrder.length > 0
      ? eventConfig.speakerOrder
      : Object.keys(eventConfig.speakers);
  const fallbackSpeakerId = orderedSpeakerIds[0] ?? "";
  const activeSpeakerKey = resolveSpeakerKey(pageView, fallbackSpeakerId);
  const activeSpeaker =
    eventConfig.speakers[activeSpeakerKey] ??
    eventConfig.speakers[fallbackSpeakerId];
  const pageButtons: Array<{
    value: PageView;
    label: string;
    color: "cyan" | "purple";
  }> = [
    { value: "galactic", label: "Banner - Perfil", color: "purple" },
    { value: "main", label: "Banner - Evento", color: "purple" },
    ...orderedSpeakerIds.map((speakerId, idx) => ({
      value: `speaker:${speakerId}` as PageView,
      label: eventConfig.speakers[speakerId]?.shortName ?? speakerId,
      color: (idx === orderedSpeakerIds.length - 1 ? "purple" : "cyan") as
        | "cyan"
        | "purple",
    })),
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    const node = document.getElementById("banner-capture");

    if (!node) {
      alert("Nao foi possivel encontrar o banner para exportacao.");
      setIsDownloading(false);
      return;
    }

    try {
      await new Promise((r) => setTimeout(r, 100));

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const images = Array.from(node.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }),
      );

      const options = {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        backgroundColor: "#0a0216",
      };

      const blob = await toBlob(node, options);
      const href = blob ? URL.createObjectURL(blob) : await toPng(node, options);

      const pagePart =
        pageView === "main"
          ? eventBannerVariant === "meetup"
            ? "banner-evento-meetup"
            : "banner-evento"
          : pageView === "galactic"
            ? `banner-perfil-${profileBannerVariant}`
            : `speaker-${activeSpeakerKey}`;
      const formatPart =
        pageView === "galactic"
          ? profileBannerVariant
          : pageView === "main" && eventBannerVariant === "meetup"
            ? "meetup"
            : format;
      const fileName = `${sanitizeFilePart(eventConfig.event.downloadPrefix)}_${sanitizeFilePart(pagePart)}_${sanitizeFilePart(formatPart)}.png`;

      const link = document.createElement("a");
      link.download = fileName;
      link.href = href;
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (href.startsWith("blob:")) {
        URL.revokeObjectURL(href);
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      alert(
        "Falha ao gerar imagem. Abra o console (F12) para ver o erro detalhado; normalmente e CORS de imagem ou bloqueio de recurso externo.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#05050a] flex flex-col items-center justify-center p-4 md:p-8 text-slate-100"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Space+Grotesk:wght@300;500;700&display=swap');
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-space { font-family: 'Space Grotesk', sans-serif; }

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
      `,
        }}
      />

      <Controls
        format={format}
        pageView={pageView}
        isDownloading={isDownloading}
        pageButtons={pageButtons}
        eventBannerVariant={eventBannerVariant}
        onChangeEventBannerVariant={setEventBannerVariant}
        profileBannerVariant={profileBannerVariant}
        onChangeProfileBannerVariant={setProfileBannerVariant}
        availableFormats={pageView === "galactic" ? ["linkedin"] : ["a4", "instagram", "linkedin"]}
        onChangeFormat={setFormat}
        onChangePage={setPageView}
        onDownload={handleDownload}
      />

      <div
        id="banner-capture"
        style={{
          aspectRatio:
            pageView === "galactic"
              ? profileBannerVariant === "linkedin"
                ? "4200 / 700"
                : "1.91 / 1"
              : pageView === "main" && eventBannerVariant === "meetup"
                ? "1.91 / 1"
              : getAspectRatio(format),
        }}
        className={`w-full ${pageView === "galactic" ? (profileBannerVariant === "linkedin" ? "max-w-[1600px]" : "max-w-[1000px]") : pageView === "main" && eventBannerVariant === "meetup" ? "max-w-[1000px]" : isHorizontal ? "max-w-[1000px]" : "max-w-[600px]"} relative overflow-hidden flex flex-col transition-all duration-500 ease-in-out rounded-none`}
      >
        {pageView === "galactic" ? (
          <GalacticBanner
            eventConfig={eventConfig}
            variant={profileBannerVariant}
          />
        ) : pageView === "main" && eventBannerVariant === "meetup" ? (
          <GalacticBanner
            eventConfig={eventConfig}
            variant="meetup"
            eventHeadline={eventConfig.event.bannerEventTitle}
          />
        ) : (
          <>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0216] via-[#1a0833] to-[#2a0845] z-0"></div>
        <div className="absolute inset-0 bg-grid-pattern z-0 opacity-40"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-cyan-600/20 blur-[120px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
        <div className="absolute -bottom-[10%] -left-[20%] w-[70%] h-[70%] bg-purple-600/30 blur-[130px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
        <div className="absolute inset-0 stars-organic opacity-70 pointer-events-none mix-blend-screen z-0"></div>

        <div className={`relative z-10 flex flex-col w-full h-full ${sizes.containerPad}`}>
          <div
            className={`flex-1 min-h-0 flex ${isHorizontal ? "flex-row gap-6 lg:gap-8 items-center" : "flex-col justify-start"}`}
          >
            <div className={`${isHorizontal ? "w-[50%] flex flex-col" : "flex flex-col mb-1 sm:mb-2"}`}>
              <div className="flex items-center gap-3 sm:gap-5 mb-2 z-20">
                <AssetImage
                  src={eventConfig.assets.mascot}
                  alt="Mascote"
                  className={`object-cover rounded-full shadow-2xl shrink-0 border border-purple-500/30 ${sizes.mascot}`}
                />
                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-[2px] w-4 sm:w-6 bg-cyan-400"></div>
                    <span className="font-orbitron text-cyan-400 tracking-[0.1em] text-[8px] sm:text-[10px] font-semibold uppercase">
                      {eventConfig.event.badge}
                    </span>
                  </div>
                  <h1
                    className={`font-space font-bold text-white leading-[1.05] tracking-tight whitespace-nowrap ${sizes.title}`}
                  >
                    {eventConfig.event.title}
                  </h1>
                  <h2
                    className={`font-space font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 whitespace-nowrap ${sizes.subtitle}`}
                  >
                    {eventConfig.event.subtitle}
                  </h2>
                </div>
              </div>

              <p className={`font-space text-cyan-100/80 leading-relaxed max-w-sm ${sizes.desc}`}>
                {eventConfig.event.description}
              </p>

              <div className={`flex items-center justify-start ${sizes.pillGroup}`}>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 shadow-lg">
                  <Calendar className="text-cyan-400 shrink-0" size={sizes.iconSize} />
                  <span className={`font-medium text-white whitespace-nowrap ${sizes.pillText}`}>
                    {eventConfig.event.dateTime}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 shadow-lg">
                  <MapPin className="text-cyan-400 shrink-0" size={sizes.iconSize} />
                  <span className={`font-medium text-white whitespace-nowrap ${sizes.pillText}`}>
                    {eventConfig.event.location}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 shadow-lg">
                  <div className="flex items-center gap-1.5 border-r border-white/20 pr-1.5 sm:pr-2">
                    <Camera size={sizes.iconSize} className="text-cyan-400" />
                    <Link size={sizes.iconSize} className="text-cyan-400" />
                  </div>
                  <span
                    className={`font-space font-medium text-white tracking-wider whitespace-nowrap ${sizes.socialText}`}
                  >
                    {eventConfig.event.socialHandle}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`${isHorizontal ? "w-[50%] h-full flex flex-col justify-center min-h-0" : "flex-1 flex flex-col min-h-0"}`}
            >
              <div className={`flex flex-col flex-1 justify-center ${sizes.cardContainer}`}>
                {pageView === "main" ? (
                  <MainTalkCards
                    sizes={sizes}
                    talks={eventConfig.talks}
                    speakers={eventConfig.speakers}
                  />
                ) : activeSpeaker ? (
                  <FeaturedSpeakerCard
                    speaker={activeSpeaker}
                    isTalk2={activeSpeakerKey === orderedSpeakerIds[orderedSpeakerIds.length - 1]}
                    isHorizontal={isHorizontal}
                    format={format}
                    sizes={sizes}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <BannerFooter
            sizes={sizes}
            labels={eventConfig.labels}
            assets={eventConfig.assets}
          />
        </div>
          </>
        )}
      </div>
    </div>
  );
}
