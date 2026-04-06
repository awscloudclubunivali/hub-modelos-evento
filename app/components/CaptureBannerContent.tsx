import { memo } from "react";
import { Calendar, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import AssetImage from "./AssetImage";
import BannerFooter from "./BannerFooter";
import MainTalkCards from "./MainTalkCards";
import PartnerSpotlightCard from "./PartnerSpotlightCard";
import SpeakerSpotlightCard from "./SpeakerSpotlightCard";
import TemplateBackdrop from "./TemplateBackdrop";
import type { EventConfig, Format, PageView, Sizes } from "./types";

type CaptureBannerContentProps = {
  eventConfig: EventConfig;
  sizes: Sizes;
  format: Format;
  pageView: PageView;
  isHorizontal: boolean;
  isSupportersView: boolean;
  isSponsorsView: boolean;
  exportDebugMode: boolean;
  activeSupporter: EventConfig["partners"]["supporters"][number] | undefined;
  activeSponsor: EventConfig["partners"]["sponsors"][number] | undefined;
  activeSpeaker: EventConfig["speakers"][string] | undefined;
  activeSpeakerKey: string;
  orderedSpeakerIds: string[];
};

function CaptureBannerContent({
  eventConfig,
  sizes,
  format,
  pageView,
  isHorizontal,
  isSupportersView,
  isSponsorsView,
  exportDebugMode,
  activeSupporter,
  activeSponsor,
  activeSpeaker,
  activeSpeakerKey,
  orderedSpeakerIds,
}: CaptureBannerContentProps) {
  const cardRendererRules: Array<{ when: boolean; render: () => ReactNode }> = [
    {
      when: pageView === "main",
      render: () => (
        <MainTalkCards
          sizes={sizes}
          talks={eventConfig.talks}
          speakers={eventConfig.speakers}
        />
      ),
    },
    {
      when: isSupportersView && Boolean(activeSupporter),
      render: () =>
        activeSupporter ? (
          <PartnerSpotlightCard
            partner={activeSupporter}
            categoryLabel="Apoiador"
            format={format}
            sizes={sizes}
          />
        ) : null,
    },
    {
      when: isSponsorsView && Boolean(activeSponsor),
      render: () =>
        activeSponsor ? (
          <PartnerSpotlightCard
            partner={activeSponsor}
            categoryLabel="Patrocinador"
            format={format}
            sizes={sizes}
          />
        ) : null,
    },
    {
      when: Boolean(activeSpeaker),
      render: () =>
        activeSpeaker ? (
          <SpeakerSpotlightCard
            speaker={activeSpeaker}
            isSecondaryTheme={
              activeSpeakerKey === orderedSpeakerIds[orderedSpeakerIds.length - 1]
            }
            isHorizontal={isHorizontal}
            format={format}
            sizes={sizes}
          />
        ) : null,
    },
  ];

  const activeCardRenderer = cardRendererRules.find((rule) => rule.when);

  return (
    <>
      <TemplateBackdrop exportDebugMode={exportDebugMode} />

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
              <div className="font-space flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 shadow-lg">
                <Calendar className="text-cyan-400 shrink-0" size={sizes.iconSize} />
                <span className={`font-space font-medium text-white whitespace-nowrap ${sizes.pillText}`}>
                  {eventConfig.event.dateTime}
                </span>
              </div>
              <div className="font-space flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 shadow-lg">
                <MapPin className="text-cyan-400 shrink-0" size={sizes.iconSize} />
                <span className={`font-space font-medium text-white whitespace-nowrap ${sizes.pillText}`}>
                  {eventConfig.event.location}
                </span>
              </div>
              <div className="font-space flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 shadow-lg">
                <div className="flex items-center gap-1.5 border-r border-white/20 pr-1.5 sm:pr-2">
                  <FaInstagram size={sizes.iconSize} className="text-cyan-400" />
                  <FaLinkedinIn size={sizes.iconSize} className="text-cyan-400" />
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
              {activeCardRenderer?.render()}
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
  );
}

export default memo(CaptureBannerContent);
