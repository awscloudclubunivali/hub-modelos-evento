export type Format = "a4" | "instagram" | "linkedin";
export type ProfileBannerVariant = "meetup" | "linkedin";

export type PageView =
  | "main"
  | "club"
  | "main-meetup"
  | "galactic"
  | "supporters"
  | "sponsors"
  | `speaker:${string}`;

export type SpeakerKey = string;

export type CarouselNavigation = {
  title: string;
  index: number;
  total: number;
  canNavigate: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export type IconType = "terminal" | "cloud";

export interface Speaker {
  id: string;
  shortName: string;
  name: string;
  title: string;
  tag: string;
  iconType: IconType;
  img: string;
  bio: string;
}

export interface Talk {
  id: string;
  theme: "cyan" | "purple";
  tag: string;
  title: string;
  speakerIds: string[];
}

export interface Partner {
  id: string;
  shortName: string;
  name: string;
  logo: string;
  description: string;
}

export interface EventConfig {
  event: {
    badge: string;
    title: string;
    subtitle: string;
    bannerEventTitle: string;
    description: string;
    dateTime: string;
    location: string;
    socialHandle: string;
    socials: {
      instagram: string;
      linkedin: string;
      email: string;
      meetup: string;
      youtube: string;
    };
    downloadPrefix: string;
  };
  branding: {
    communityLabel: string;
    organizationName: string;
    organizationUnit: string;
  };
  labels: {
    realization: string;
    support: string;
  };
  assets: {
    mascot: string;
    balloon: string;
    realizationLogo: string;
    primarySupportLogo: string;
    supportLogos: string[];
  };
  clubPromo: {
    headline: string;
    subheadline: string;
    highlights: string[];
    siteUrl: string;
    callToAction: string;
    qrCodeImage: string;
  };
  partners: {
    supporters: Partner[];
    sponsors: Partner[];
  };
  speakers: Record<string, Speaker>;
  speakerOrder: string[];
  talks: Talk[];
}

export interface Sizes {
  containerPad: string;
  mascot: string;
  title: string;
  subtitle: string;
  desc: string;
  pillGroup: string;
  iconSize: number;
  socialText: string;
  pillText: string;
  cardContainer: string;
  footerCC: string;
  footerAp: string;
  cardPad: string;
  avatar: string;
  cardTag: string;
  cardTitle: string;
  cardSpeaker: string;
  cardIconSize: number;
  featCardPad: string;
  featCardTitle: string;
  featCardTag: string;
  featIconSize: number;
  featAvatar: string;
  featContentMt: string;
  featBoxPad: string;
  featBoxTitle: string;
  featBoxText: string;
}
