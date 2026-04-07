import { useCallback, useEffect, useMemo, useState } from "react";
import { getSizes } from "./config";
import { defaultEventConfig, loadEventConfig } from "./event-config";
import {
  buildPageButtons,
  getAvailableFormats,
  getCaptureFrame,
  isSpeakerView,
  resolveSpeakerKey,
} from "./page-view-config";
import type {
  CarouselNavigation,
  EventConfig,
  Format,
  PageView,
  ProfileBannerVariant,
} from "./types";

const cycleIndex = (current: number, length: number, step: 1 | -1): number =>
  (current + step + length) % length;

export const useBannerHubState = () => {
  const [format, setFormat] = useState<Format>("a4");
  const [pageView, setPageView] = useState<PageView>("main");
  const [profileBannerVariant, setProfileBannerVariant] =
    useState<ProfileBannerVariant>("meetup");
  const [supporterIndex, setSupporterIndex] = useState(0);
  const [sponsorIndex, setSponsorIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [exportDebugMode, setExportDebugMode] = useState(false);
  const [eventConfig, setEventConfig] = useState<EventConfig>(defaultEventConfig);

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

  const orderedSpeakerIds = useMemo(
    () =>
      eventConfig.speakerOrder.length > 0
        ? eventConfig.speakerOrder
        : Object.keys(eventConfig.speakers),
    [eventConfig.speakerOrder, eventConfig.speakers],
  );

  const fallbackSpeakerId = orderedSpeakerIds[0] ?? "";
  const activeSpeakerKey = resolveSpeakerKey(pageView, fallbackSpeakerId);

  const activeSpeaker = useMemo(
    () => eventConfig.speakers[activeSpeakerKey] ?? eventConfig.speakers[fallbackSpeakerId],
    [activeSpeakerKey, eventConfig.speakers, fallbackSpeakerId],
  );

  const supporters = useMemo(() => eventConfig.partners.supporters, [eventConfig.partners]);
  const sponsors = useMemo(() => eventConfig.partners.sponsors, [eventConfig.partners]);
  const effectiveSupporterIndex =
    supporters.length === 0 ? 0 : supporterIndex % supporters.length;
  const effectiveSponsorIndex = sponsors.length === 0 ? 0 : sponsorIndex % sponsors.length;
  const activeSupporter = supporters[effectiveSupporterIndex] ?? supporters[0];
  const activeSponsor = sponsors[effectiveSponsorIndex] ?? sponsors[0];

  const isMainEventView = pageView === "main";
  const isClubPromoView = pageView === "club";
  const isMeetupEventView = pageView === "main-meetup";
  const isProfileBannerView = pageView === "galactic";
  const isSupportersView = pageView === "supporters";
  const isSponsorsView = pageView === "sponsors";
  const speakerView = isSpeakerView(pageView);

  const currentSpeakerIndex = Math.max(orderedSpeakerIds.indexOf(activeSpeakerKey), 0);

  const pageButtons = useMemo(() => buildPageButtons(orderedSpeakerIds), [orderedSpeakerIds]);

  const handleChangePage = useCallback(
    (view: PageView) => {
      setPageView(view);

      const viewFormats = getAvailableFormats(view);
      if (!viewFormats.includes(format)) {
        setFormat(viewFormats[0]);
      }
    },
    [format],
  );

  const handlePrevSupporter = useCallback(() => {
    if (!supporters.length) {
      return;
    }

    setSupporterIndex((prev) => cycleIndex(prev, supporters.length, -1));
  }, [supporters.length]);

  const handleNextSupporter = useCallback(() => {
    if (!supporters.length) {
      return;
    }

    setSupporterIndex((prev) => cycleIndex(prev, supporters.length, 1));
  }, [supporters.length]);

  const handlePrevSponsor = useCallback(() => {
    if (!sponsors.length) {
      return;
    }

    setSponsorIndex((prev) => cycleIndex(prev, sponsors.length, -1));
  }, [sponsors.length]);

  const handleNextSponsor = useCallback(() => {
    if (!sponsors.length) {
      return;
    }

    setSponsorIndex((prev) => cycleIndex(prev, sponsors.length, 1));
  }, [sponsors.length]);

  const handlePrevSpeaker = useCallback(() => {
    if (!orderedSpeakerIds.length) {
      return;
    }

    const prevIndex = cycleIndex(currentSpeakerIndex, orderedSpeakerIds.length, -1);
    setPageView(`speaker:${orderedSpeakerIds[prevIndex]}`);
  }, [currentSpeakerIndex, orderedSpeakerIds]);

  const handleNextSpeaker = useCallback(() => {
    if (!orderedSpeakerIds.length) {
      return;
    }

    const nextIndex = cycleIndex(currentSpeakerIndex, orderedSpeakerIds.length, 1);
    setPageView(`speaker:${orderedSpeakerIds[nextIndex]}`);
  }, [currentSpeakerIndex, orderedSpeakerIds]);

  const carouselViewKey = isSupportersView
    ? "supporters"
    : isSponsorsView
      ? "sponsors"
      : speakerView
        ? "speaker"
        : null;

  const carouselNavigation = useMemo<CarouselNavigation | null>(() => {
    if (carouselViewKey === "supporters") {
      return activeSupporter
        ? {
            title: activeSupporter.name,
            index: effectiveSupporterIndex,
            total: supporters.length,
            canNavigate: supporters.length > 1,
            onPrevious: handlePrevSupporter,
            onNext: handleNextSupporter,
          }
        : null;
    }

    if (carouselViewKey === "sponsors") {
      return activeSponsor
        ? {
            title: activeSponsor.name,
            index: effectiveSponsorIndex,
            total: sponsors.length,
            canNavigate: sponsors.length > 1,
            onPrevious: handlePrevSponsor,
            onNext: handleNextSponsor,
          }
        : null;
    }

    if (carouselViewKey === "speaker") {
      return activeSpeaker
        ? {
            title: activeSpeaker.name,
            index: currentSpeakerIndex,
            total: orderedSpeakerIds.length,
            canNavigate: orderedSpeakerIds.length > 1,
            onPrevious: handlePrevSpeaker,
            onNext: handleNextSpeaker,
          }
        : null;
    }

    return null;
  }, [
    activeSpeaker,
    activeSponsor,
    activeSupporter,
    carouselViewKey,
    currentSpeakerIndex,
    effectiveSponsorIndex,
    effectiveSupporterIndex,
    handleNextSpeaker,
    handleNextSponsor,
    handleNextSupporter,
    handlePrevSpeaker,
    handlePrevSponsor,
    handlePrevSupporter,
    orderedSpeakerIds.length,
    sponsors.length,
    supporters.length,
  ]);

  const availableFormats = useMemo(() => getAvailableFormats(pageView), [pageView]);
  const captureFrame = useMemo(
    () =>
      getCaptureFrame({
        pageView,
        format,
        profileBannerVariant,
      }),
    [format, pageView, profileBannerVariant],
  );

  return {
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
    isMainEventView,
    isClubPromoView,
    isMeetupEventView,
    isProfileBannerView,
    isSupportersView,
    isSponsorsView,
    speakerView,
    pageButtons,
    carouselNavigation,
    availableFormats,
    captureFrame,
  };
};
