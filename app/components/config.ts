import type { Format, Sizes } from "./types";

export const getAspectRatio = (format: Format) => {
  if (format === "instagram") return "1 / 1";
  if (format === "linkedin") return "1.91 / 1";
  return "1 / 1.414";
};

export const getSizes = (format: Format): Sizes => {
  if (format === "a4") {
    return {
      containerPad: "py-6 px-4 sm:py-8 sm:px-6",
      mascot: "w-20 h-20 sm:w-28 sm:h-28",
      title: "text-4xl sm:text-5xl",
      subtitle: "text-lg sm:text-xl",
      desc: "text-sm sm:text-base mb-3 sm:mb-4",
      pillGroup: "flex-row flex-wrap w-full mt-3 gap-2",
      iconSize: 16,
      socialText: "text-[11px] sm:text-xs",
      pillText: "text-[11px] sm:text-xs",
      cardContainer: "mt-6 gap-6 mb-6",
      footerCC: "h-12 sm:h-14",
      footerAp: "h-8 sm:h-10",
      cardPad: "px-5 py-6 sm:px-6 sm:py-8",
      avatar: "w-16 h-16 sm:w-20 sm:h-20",
      cardTag: "text-[9px] sm:text-[11px]",
      cardTitle: "text-base sm:text-xl",
      cardSpeaker: "text-xs sm:text-sm",
      cardIconSize: 14,
      featCardPad: "px-6 py-5 sm:px-8 sm:py-6",
      featCardTitle: "text-xl sm:text-2xl font-bold leading-tight",
      featCardTag: "text-xs sm:text-sm mb-1",
      featIconSize: 20,
      featAvatar: "w-24 h-24 sm:w-28 sm:h-28",
      featContentMt: "mt-3 sm:mt-4",
      featBoxPad: "px-5 py-4 sm:px-7 sm:py-5",
      featBoxTitle: "text-lg sm:text-xl font-bold mb-1 text-cyan-300",
      featBoxText:
        "text-sm sm:text-base lg:text-lg leading-relaxed text-purple-100/90",
    };
  }

  if (format === "instagram") {
    return {
      containerPad: "p-4 sm:p-5",
      mascot: "w-12 h-12 sm:w-25 sm:h-25",
      title: "text-4xl sm:text-5xl",
      subtitle: "text-lg sm:text-xl",
      desc: "text-sm sm:text-base",
      pillGroup: "flex-row flex-wrap w-full mt-1.5 sm:mt-2 gap-1.5",
      iconSize: 16,
      socialText: "text-[11px] sm:text-xs",
      pillText: "text-[11px] sm:text-xs",
      cardContainer: "mt-1 sm:mt-2 gap-3 mb-4 sm:mb-6",
      footerCC: "h-12 sm:h-14",
      footerAp: "h-8 sm:h-10",
      cardPad: "px-4 py-3 sm:px-5 sm:py-4",
      avatar: "w-12 h-12 sm:w-14 sm:h-14",
      cardTag: "text-[9px] sm:text-[11px]",
      cardTitle: "text-base sm:text-xl",
      cardSpeaker: "text-xs sm:text-sm",
      cardIconSize: 14,
      featCardPad: "px-6 py-3 sm:px-8 sm:py-3",
      featCardTitle: "text-base sm:text-xl font-bold leading-tight",
      featCardTag: "text-[9px] sm:text-[11px] mb-1",
      featIconSize: 20,
      featAvatar: "w-16 h-16 sm:w-20 sm:h-20",
      featContentMt: "mt-2 sm:mt-3",
      featBoxPad: "px-2 py-2 sm:px-3 sm:py-3",
      featBoxTitle: "text-lg sm:text-xl font-bold mb-1 text-cyan-300",
      featBoxText:
        "text-sm sm:text-base lg:text-base leading-relaxed text-purple-100/90",
    };
  }

  return {
    containerPad: "p-4 sm:p-5 lg:p-6",
    mascot: "w-12 sm:w-14 lg:w-16",
    title: "text-xl sm:text-3xl lg:text-4xl",
    subtitle: "text-base sm:text-lg lg:text-xl",
    desc: "text-[9px] sm:text-xs lg:text-sm mb-1",
    pillGroup: "flex-row flex-wrap w-full mt-1 gap-1.5",
    iconSize: 12,
    socialText: "text-[8px]",
    pillText: "text-[8px]",
    cardContainer: "gap-1 mb-0",
    footerCC: "h-12 sm:h-14",
    footerAp: "h-8 sm:h-10",
    cardPad: "px-4 py-1.5 lg:px-5 lg:py-2.5",
    avatar: "w-10 h-10 lg:w-12 lg:h-12",
    cardTag: "text-[8px] lg:text-[10px]",
    cardTitle: "text-sm lg:text-base",
    cardSpeaker: "text-[9px] lg:text-[11px]",
    cardIconSize: 12,
    featCardPad: "px-4 py-3 lg:px-6 lg:py-4",
    featCardTitle: "text-base lg:text-lg font-bold leading-tight",
    featCardTag: "text-[9px] lg:text-[10px] mb-0.5",
    featIconSize: 12,
    featAvatar: "w-12 h-12 lg:w-16 lg:h-16",
    featContentMt: "mt-1.5 lg:mt-2",
    featBoxPad: "px-3 py-2 lg:px-4 lg:py-3",
    featBoxTitle: "text-sm lg:text-base font-bold mb-0.5 text-cyan-300",
    featBoxText: "text-[9px] lg:text-[11px] leading-snug text-purple-100/90",
  };
};
