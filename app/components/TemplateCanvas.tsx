import { memo, useMemo } from "react";
import type { ReactNode } from "react";
import BaseTemplateLayout from "./BaseTemplateLayout";
import CaptureBannerContent from "./CaptureBannerContent";
import ClubPromoBanner from "./ClubPromoBanner";
import EventWaitingBanner from "./EventWaitingBanner";
import GalacticBanner from "./GalacticBanner";
import WeeklyPostBanner from "./WeeklyPostBanner";
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
  const resolvedTemplate = useMemo<ReactNode>(() => {
    if (pageView === "weekly-post") {
      return (
        <WeeklyPostBanner
          eventConfig={eventConfig}
          exportDebugMode={exportDebugMode}
          aspectRatio={captureAspectRatio}
          widthClass={captureWidthClass}
          format={format}
        />
      );
    }

    if (pageView === "event-waiting") {
      return (
        <EventWaitingBanner
          eventConfig={eventConfig}
          exportDebugMode={exportDebugMode}
          aspectRatio={captureAspectRatio}
          widthClass={captureWidthClass}
        />
      );
    }

    if (isProfileBannerView) {
      const activeRenderer = (
        <GalacticBanner
          eventConfig={eventConfig}
          variant={profileBannerVariant}
          exportDebugMode={exportDebugMode}
        />
      );

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

    if (isClubPromoView) {
      const activeRenderer = (
        <ClubPromoBanner
          eventConfig={eventConfig}
          sizes={sizes}
          format={format}
          exportDebugMode={exportDebugMode}
        />
      );

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

    if (isMeetupEventView) {
      const activeRenderer = (
        <GalacticBanner
          eventConfig={eventConfig}
          variant="meetup"
          eventHeadline={eventConfig.event.bannerEventTitle}
          exportDebugMode={exportDebugMode}
        />
      );

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

    const activeRenderer = (
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

    return (
      <BaseTemplateLayout
        aspectRatio={captureAspectRatio}
        widthClass={captureWidthClass}
        exportDebugMode={exportDebugMode}
      >
        {activeRenderer}
      </BaseTemplateLayout>
    );
  }, [
    activeSpeaker,
    activeSpeakerKey,
    activeSponsor,
    activeSupporter,
    captureAspectRatio,
    captureWidthClass,
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

  return resolvedTemplate;
}

export default memo(TemplateCanvas);
