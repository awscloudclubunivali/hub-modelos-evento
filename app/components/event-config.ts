import type { EventConfig } from "./types";

export const defaultEventConfig: EventConfig = {
  event: {
    badge: "Evento",
    title: "MEETUP",
    subtitle: "AWS CLOUD CLUB",
    bannerEventTitle: "Meetup - Em breve",
    description: "Atualize o arquivo /public/event.json para configurar o evento.",
    dateTime: "A definir",
    location: "A definir",
    socialHandle: "/aws-cloud-club",
    socials: {
      instagram: "https://www.instagram.com/awscloudclubunivali",
      linkedin: "",
      email: "",
      meetup: "",
      youtube: "",
    },
    downloadPrefix: "AWS_Cloud_Club",
  },
  branding: {
    communityLabel: "Comunidade Oficial",
    organizationName: "AWS Cloud Clubs",
    organizationUnit: "UNIDADE",
  },
  labels: {
    realization: "Realizacao",
    support: "Apoio",
  },
  assets: {
    mascot: "",
    balloon: "",
    realizationLogo: "",
    primarySupportLogo: "",
    supportLogos: [],
  },
  clubPromo: {
    headline: "Participe do AWS Cloud Club UNIVALI",
    subheadline:
      "Comunidade para aprender cloud, construir projetos e evoluir com networking real.",
    highlights: ["Conteudo pratico", "Networking", "Projetos reais"],
    siteUrl: "https://www.instagram.com/awscloudclubunivali",
    callToAction: "Quero participar",
    qrCodeImage: "",
  },
  partners: {
    supporters: [],
    sponsors: [],
  },
  speakers: {},
  speakerOrder: [],
  talks: [],
  weeklyPost: {
    title: "",
    hookSentence: "",
    image: ""
  },
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const withFallbacks = (parsed: DeepPartial<EventConfig>): DeepPartial<EventConfig> => {
  const parsedEvent = parsed.event ?? {};
  const fallbackAssets = (parsed.assets ?? {}) as DeepPartial<EventConfig["assets"]> & {
    supportLogoMain?: string;
    supportLogoSecondary?: string;
    supportLogoTertiary?: string;
  };
  const legacySupportLogos = [
    fallbackAssets.supportLogoSecondary,
    fallbackAssets.supportLogoTertiary,
  ].filter((logo): logo is string => Boolean(logo));

  return {
    ...parsed,
    event: {
      ...parsedEvent,
      socials: {
        instagram:
          parsedEvent.socials?.instagram ??
          (parsedEvent.socialHandle
            ? `https://www.instagram.com/${parsedEvent.socialHandle.replace(/^\/+/, "")}`
            : "https://www.instagram.com/awscloudclubunivali"),
        linkedin: parsedEvent.socials?.linkedin ?? "",
        email: parsedEvent.socials?.email ?? "",
        meetup: parsedEvent.socials?.meetup ?? "",
        youtube: parsedEvent.socials?.youtube ?? "",
      },
    },
    assets: {
      ...parsed.assets,
      balloon: fallbackAssets.balloon,
      primarySupportLogo:
        fallbackAssets.primarySupportLogo ?? fallbackAssets.supportLogoMain,
      supportLogos:
        fallbackAssets.supportLogos && fallbackAssets.supportLogos.length > 0
          ? fallbackAssets.supportLogos
          : legacySupportLogos,
    },
    branding: {
      communityLabel: parsed.branding?.communityLabel ?? "Comunidade Oficial",
      organizationName: parsed.branding?.organizationName ?? "AWS Cloud Clubs",
      organizationUnit: parsed.branding?.organizationUnit ?? "UNIVALI",
    },
    partners: {
      supporters:
        parsed.partners?.supporters && parsed.partners.supporters.length > 0
          ? parsed.partners.supporters
          : (fallbackAssets.supportLogos ?? []).map((logo, idx) => ({
              id: `apoiador-${idx + 1}`,
              shortName: `Apoiador ${idx + 1}`,
              name: `Apoiador ${idx + 1}`,
              logo,
              description: "Apoiador do meetup AWS Cloud Club.",
            })),
      sponsors:
        parsed.partners?.sponsors && parsed.partners.sponsors.length > 0
          ? parsed.partners.sponsors
          : [fallbackAssets.primarySupportLogo]
              .filter((logo): logo is string => Boolean(logo))
              .map((logo, idx) => ({
                id: `patrocinador-${idx + 1}`,
                shortName: `Patrocinador ${idx + 1}`,
                name: `Patrocinador ${idx + 1}`,
                logo,
                description: "Patrocinador do meetup AWS Cloud Club.",
              })),
    },
    clubPromo: {
      headline:
        parsed.clubPromo?.headline ?? "Participe do AWS Cloud Club UNIVALI",
      subheadline:
        parsed.clubPromo?.subheadline ??
        "Comunidade para aprender cloud, construir projetos e evoluir com networking real.",
      highlights:
        parsed.clubPromo?.highlights && parsed.clubPromo.highlights.length > 0
          ? parsed.clubPromo.highlights
          : ["Conteudo pratico", "Networking", "Projetos reais"],
      siteUrl:
        parsed.clubPromo?.siteUrl ?? "https://www.instagram.com/awscloudclubunivali",
      callToAction: parsed.clubPromo?.callToAction ?? "Quero participar",
      qrCodeImage: parsed.clubPromo?.qrCodeImage ?? "",
    },
  };
};

const mergeEventConfig = (parsed: DeepPartial<EventConfig>): EventConfig => {
  const normalizedParsed = withFallbacks(parsed);
  const parsedEvent = normalizedParsed.event as Partial<EventConfig["event"]>;
  const parsedBranding = normalizedParsed.branding as Partial<EventConfig["branding"]>;
  const parsedLabels = normalizedParsed.labels as Partial<EventConfig["labels"]>;
  const parsedAssets = normalizedParsed.assets as Partial<EventConfig["assets"]>;
  const parsedClubPromo = normalizedParsed.clubPromo as Partial<EventConfig["clubPromo"]>;
  const parsedPartners = normalizedParsed.partners as Partial<EventConfig["partners"]>;
  const parsedSpeakers =
    normalizedParsed.speakers as Record<string, EventConfig["speakers"][string]>;
  const parsedSpeakerOrder = normalizedParsed.speakerOrder as string[] | undefined;
  const parsedTalks = normalizedParsed.talks as EventConfig["talks"] | undefined;
  const parsedWeeklyPost = normalizedParsed.weeklyPost as Partial<EventConfig["weeklyPost"]> | undefined;

  return {
    ...defaultEventConfig,
    ...normalizedParsed,
    event: { ...defaultEventConfig.event, ...(parsedEvent ?? {}) },
    branding: {
      ...defaultEventConfig.branding,
      ...(parsedBranding ?? {}),
    },
    labels: { ...defaultEventConfig.labels, ...(parsedLabels ?? {}) },
    assets: { ...defaultEventConfig.assets, ...(parsedAssets ?? {}) },
    clubPromo: { ...defaultEventConfig.clubPromo, ...(parsedClubPromo ?? {}) },
    partners: { ...defaultEventConfig.partners, ...(parsedPartners ?? {}) },
    speakers: {
      ...defaultEventConfig.speakers,
      ...(parsedSpeakers ?? {}),
    },
    speakerOrder: parsedSpeakerOrder ?? defaultEventConfig.speakerOrder,
    talks: parsedTalks ?? defaultEventConfig.talks,
    weeklyPost: { ...defaultEventConfig.weeklyPost, ...(parsedWeeklyPost ?? {}) },
  };
};

export const EVENT_CONFIG_URL =
  process.env.NEXT_PUBLIC_EVENT_CONFIG_URL ?? "/event.json";

export const loadEventConfig = async (): Promise<EventConfig> => {
  try {
    const response = await fetch(EVENT_CONFIG_URL, { cache: "no-store" });
    if (!response.ok) {
      console.warn(
        `Nao foi possivel carregar ${EVENT_CONFIG_URL}. Usando config padrao.`,
      );
      return defaultEventConfig;
    }

    const parsed = (await response.json()) as DeepPartial<EventConfig>;
    return mergeEventConfig(parsed);
  } catch (error) {
    console.warn("Falha ao carregar event.json. Usando config padrao.", error);
    return defaultEventConfig;
  }
};
