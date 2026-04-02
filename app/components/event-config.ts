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
  speakers: {},
  speakerOrder: [],
  talks: [],
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const withFallbacks = (parsed: DeepPartial<EventConfig>): DeepPartial<EventConfig> => {
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
  };
};

const mergeEventConfig = (parsed: DeepPartial<EventConfig>): EventConfig => {
  const normalizedParsed = withFallbacks(parsed);
  const parsedEvent = normalizedParsed.event as Partial<EventConfig["event"]>;
  const parsedBranding = normalizedParsed.branding as Partial<EventConfig["branding"]>;
  const parsedLabels = normalizedParsed.labels as Partial<EventConfig["labels"]>;
  const parsedAssets = normalizedParsed.assets as Partial<EventConfig["assets"]>;
  const parsedSpeakers =
    normalizedParsed.speakers as Record<string, EventConfig["speakers"][string]>;
  const parsedSpeakerOrder = normalizedParsed.speakerOrder as string[] | undefined;
  const parsedTalks = normalizedParsed.talks as EventConfig["talks"] | undefined;

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
    speakers: {
      ...defaultEventConfig.speakers,
      ...(parsedSpeakers ?? {}),
    },
    speakerOrder: parsedSpeakerOrder ?? defaultEventConfig.speakerOrder,
    talks: parsedTalks ?? defaultEventConfig.talks,
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
