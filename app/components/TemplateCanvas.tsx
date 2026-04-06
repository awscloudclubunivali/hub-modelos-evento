import { memo, useMemo } from "react";
import type { ReactNode } from "react";
import BaseTemplateLayout from "./BaseTemplateLayout";
import CaptureBannerContent from "./CaptureBannerContent";
import ClubPromoBanner from "./ClubPromoBanner";
import GalacticBanner from "./GalacticBanner";
import type { EventConfig, Format, PageView, ProfileBannerVariant, Sizes } from "./types";

type TemplateCanvasProps = {
  eventConfig: EventConfig;
  sizes: Sizes;
  format: Format;
  pageView: PageView;
  profileBannerVariant: ProfileBannerVariant;
  exportDebugMode: boolean;
  captureAspectRatio: string;
  captureWidthClass: string;
  isHorizontal: boolean;
  isProfileBannerView: boolean;
  isClubPromoView: boolean;
  isMeetupEventView: boolean;
  isSupportersView: boolean;
  isSponsorsView: boolean;
  activeSupporter: EventConfig["partners"]["supporters"][number] | undefined;
  activeSponsor: EventConfig["partners"]["sponsors"][number] | undefined;
  activeSpeaker: EventConfig["speakers"][string] | undefined;
  activeSpeakerKey: string;
  orderedSpeakerIds: string[];
};

function TemplateCanvas({
  eventConfig,
  sizes,
  format,
  pageView,
  profileBannerVariant,
  exportDebugMode,
  captureAspectRatio,
  captureWidthClass,
  isHorizontal,
  isProfileBannerView,
  isClubPromoView,
  isMeetupEventView,
  isSupportersView,
  isSponsorsView,
  activeSupporter,
  activeSponsor,
  activeSpeaker,
  activeSpeakerKey,
  orderedSpeakerIds,
}: TemplateCanvasProps) {
  const activeRenderer = useMemo<ReactNode>(() => {
    if (isProfileBannerView) {
      return (
        <GalacticBanner
          eventConfig={eventConfig}
          variant={profileBannerVariant}
          exportDebugMode={exportDebugMode}
        />
      );
    }

    if (isClubPromoView) {
      return (
        <ClubPromoBanner
          eventConfig={eventConfig}
          sizes={sizes}
          format={format}
          exportDebugMode={exportDebugMode}
        />
      );
    }

    if (isMeetupEventView) {
      return (
        <GalacticBanner
          eventConfig={eventConfig}
          variant="meetup"
          eventHeadline={eventConfig.event.bannerEventTitle}
          exportDebugMode={exportDebugMode}
        />
      );
    }

    return (
      <CaptureBannerContent
        eventConfig={eventConfig}
        sizes={sizes}
        format={format}
        pageView={pageView}
        isHorizontal={isHorizontal}
        isSupportersView={isSupportersView}
        isSponsorsView={isSponsorsView}
        exportDebugMode={exportDebugMode}
        activeSupporter={activeSupporter}
        activeSponsor={activeSponsor}
        activeSpeaker={activeSpeaker}
        activeSpeakerKey={activeSpeakerKey}
        orderedSpeakerIds={orderedSpeakerIds}
      />
    );
  }, [
    activeSpeaker,
    activeSpeakerKey,
    activeSponsor,
    activeSupporter,
    eventConfig,
    exportDebugMode,
    format,
    isClubPromoView,
    isHorizontal,
    isMeetupEventView,
    isProfileBannerView,
    isSponsorsView,
    isSupportersView,
    orderedSpeakerIds,
    pageView,
    profileBannerVariant,
    sizes,
  ]);

  return (
    <BaseTemplateLayout
      aspectRatio={captureAspectRatio}
      widthClass={captureWidthClass}
      exportDebugMode={exportDebugMode}
    >
      {activeRenderer}
    </BaseTemplateLayout>
  );
}

export default memo(TemplateCanvas);
