import { getAspectRatio } from "./config";
import type { Format, PageView, ProfileBannerVariant } from "./types";

type PageButtonColor = "cyan" | "purple";
type PageCategory = "content" | "partner" | "speaker";

export type PageButton = {
  value: PageView;
  label: string;
  color: PageButtonColor;
};

type StaticPageMeta = {
  label: string;
  color: PageButtonColor;
  category: PageCategory;
};

const STATIC_PAGE_META: Record<Exclude<PageView, `speaker:${string}`>, StaticPageMeta> = {
  galactic: { label: "Banner - Perfil", color: "purple", category: "content" },
  club: { label: "Banner - Clube", color: "purple", category: "content" },
  "main-meetup": {
    label: "Banner - Evento Meetup",
    color: "purple",
    category: "content",
  },
  main: { label: "Banner - Evento", color: "purple", category: "content" },
  supporters: { label: "Apoiadores", color: "cyan", category: "partner" },
  sponsors: { label: "Patrocinadores", color: "cyan", category: "partner" },
};

const STATIC_PAGE_ORDER: Array<Exclude<PageView, `speaker:${string}`>> = [
  "galactic",
  "club",
  "main-meetup",
  "main",
  "supporters",
  "sponsors",
];

const MAIN_AND_PARTNER_PAGES = new Set<PageView>([
  "main",
  "club",
  "supporters",
  "sponsors",
]);

const PAGE_DOWNLOAD_PARTS: Record<Exclude<PageView, `speaker:${string}`>, string> = {
  main: "banner-evento",
  club: "banner-clube",
  "main-meetup": "banner-evento-meetup",
  supporters: "apoiadores",
  sponsors: "patrocinadores",
  galactic: "banner-perfil",
};

export const isSpeakerView = (pageView: PageView): pageView is `speaker:${string}` =>
  pageView.startsWith("speaker:");

export const resolveSpeakerKey = (pageView: PageView, fallback: string): string =>
  isSpeakerView(pageView) ? pageView.replace("speaker:", "") : fallback;

export const getPageCategory = (pageView: PageView): PageCategory => {
  if (isSpeakerView(pageView)) {
    return "speaker";
  }

  return STATIC_PAGE_META[pageView].category;
};

export const buildPageButtons = (orderedSpeakerIds: string[]): PageButton[] => {
  const pageButtons: PageButton[] = STATIC_PAGE_ORDER
    .slice(0, 4)
    .map((page) => ({
      value: page,
      label: STATIC_PAGE_META[page].label,
      color: STATIC_PAGE_META[page].color,
    }));

  if (orderedSpeakerIds.length > 0) {
    pageButtons.push({
      value: `speaker:${orderedSpeakerIds[0]}`,
      label: "Palestrantes",
      color: "cyan",
    });
  }

  pageButtons.push(
    {
      value: "supporters",
      label: STATIC_PAGE_META.supporters.label,
      color: STATIC_PAGE_META.supporters.color,
    },
    {
      value: "sponsors",
      label: STATIC_PAGE_META.sponsors.label,
      color: STATIC_PAGE_META.sponsors.color,
    },
  );

  return pageButtons;
};

export const getAvailableFormats = (pageView: PageView): Format[] => {
  if (pageView === "galactic") {
    return ["linkedin"];
  }

  if (MAIN_AND_PARTNER_PAGES.has(pageView) || isSpeakerView(pageView)) {
    return ["a4", "instagram"];
  }

  return ["a4", "instagram", "linkedin"];
};

export const getCaptureFrame = ({
  pageView,
  format,
  profileBannerVariant,
}: {
  pageView: PageView;
  format: Format;
  profileBannerVariant: ProfileBannerVariant;
}) => {
  if (pageView === "galactic") {
    return {
      aspectRatio: profileBannerVariant === "linkedin" ? "4 / 1" : "1.91 / 1",
      widthClass:
        profileBannerVariant === "linkedin"
          ? "max-w-4xl mx-auto"
          : "max-w-[1000px] mx-auto",
    };
  }

  if (pageView === "main-meetup") {
    return {
      aspectRatio: "1.91 / 1",
      widthClass: "max-w-[1000px]",
    };
  }

  return {
    aspectRatio: getAspectRatio(format),
    widthClass: format === "linkedin" ? "max-w-[1000px]" : "max-w-[600px]",
  };
};

export const getDownloadNameParts = ({
  pageView,
  format,
  profileBannerVariant,
  activeSpeakerKey,
}: {
  pageView: PageView;
  format: Format;
  profileBannerVariant: ProfileBannerVariant;
  activeSpeakerKey: string;
}) => {
  const pagePart = isSpeakerView(pageView)
    ? `speaker-${activeSpeakerKey}`
    : pageView === "galactic"
      ? `${PAGE_DOWNLOAD_PARTS.galactic}-${profileBannerVariant}`
      : PAGE_DOWNLOAD_PARTS[pageView];

  const formatPart =
    pageView === "galactic"
      ? profileBannerVariant
      : pageView === "main-meetup"
        ? "meetup"
        : format;

  return { pagePart, formatPart };
};
