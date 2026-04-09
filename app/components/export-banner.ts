import { toBlob as htmlToImageToBlob } from "html-to-image";
import { getDownloadNameParts } from "./page-view-config";
import type { Format, PageView, ProfileBannerVariant } from "./types";

const EXPORT_TIMEOUT_MS = 20000;
const MAX_EXPORT_DIMENSION = 2400;
const DEFAULT_EXPORT_ERROR_MESSAGE =
  "Falha ao gerar imagem. Verifique imagens externas (CORS) e tente novamente.";

export type BannerExportErrorCode =
  | "capture-node-not-found"
  | "timeout"
  | "canvas-render"
  | "blob-generation"
  | "security"
  | "unknown";

export class BannerExportError extends Error {
  code: BannerExportErrorCode;
  userMessage: string;

  constructor(code: BannerExportErrorCode, userMessage: string, options?: ErrorOptions) {
    super(userMessage, options);
    this.name = "BannerExportError";
    this.code = code;
    this.userMessage = userMessage;
  }
}

type ExportBannerAsPngOptions = {
  pageView: PageView;
  profileBannerVariant: ProfileBannerVariant;
  format: Format;
  activeSpeakerKey: string;
  downloadPrefix: string;
  isProfileBannerView: boolean;
  isMeetupEventView: boolean;
};

type CaptureDimensions = {
  width: number;
  height: number;
};

type CaptureEngineOptions = {
  node: HTMLElement;
  dimensions: CaptureDimensions;
};

const MAIN_FONT_FAMILY_FALLBACK = "'Space Grotesk'";
const ACCENT_FONT_FAMILY = "Orbitron";

const resolveMainFontFamily = (): string => MAIN_FONT_FAMILY_FALLBACK;

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return new Promise<T>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new BannerExportError(
          "timeout",
          "A exportacao demorou demais. Verifique conexao/imagens externas e tente novamente.",
        ),
      );
    }, timeoutMs);

    promise
      .then((value) => resolve(value))
      .catch((error) => reject(error))
      .finally(() => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      });
  });
};

const normalizeExportError = (error: unknown): BannerExportError => {
  if (error instanceof BannerExportError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "SecurityError") {
    return new BannerExportError(
      "security",
      "Bloqueio de seguranca ao capturar a imagem. Revise recursos externos e CORS.",
      { cause: error },
    );
  }

  return new BannerExportError("unknown", DEFAULT_EXPORT_ERROR_MESSAGE, {
    cause: error instanceof Error ? error : undefined,
  });
};

export const sanitizeFilePart = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const applyInlineComputedFontFallback = (rootNode: HTMLElement): (() => void) => {
  const allNodes = [rootNode, ...Array.from(rootNode.querySelectorAll<HTMLElement>("*"))];

  const typographicProperties = [
    "font-family",
    "font-weight",
    "font-style",
    "font-stretch",
    "font-variant",
    "letter-spacing",
    "text-transform",
  ] as const;

  const previousInlineValues = new Map<
    HTMLElement,
    Record<(typeof typographicProperties)[number], { value: string; priority: string }>
  >();

  for (const element of allNodes) {
    const previousValues = typographicProperties.reduce(
      (acc, property) => {
        acc[property] = {
          value: element.style.getPropertyValue(property),
          priority: element.style.getPropertyPriority(property),
        };
        return acc;
      },
      {} as Record<(typeof typographicProperties)[number], { value: string; priority: string }>,
    );

    previousInlineValues.set(element, previousValues);

    const computedStyles = window.getComputedStyle(element);
    const forcedFontFamily = element.classList.contains("font-orbitron")
      ? `${ACCENT_FONT_FAMILY}, sans-serif`
      : `${resolveMainFontFamily()}, sans-serif`;

    element.style.setProperty("font-family", forcedFontFamily, "important");
    element.style.setProperty("font-weight", computedStyles.fontWeight, "important");
    element.style.setProperty("font-style", computedStyles.fontStyle, "important");
    element.style.setProperty("font-stretch", computedStyles.fontStretch, "important");
    element.style.setProperty("font-variant", computedStyles.fontVariant, "important");
    element.style.setProperty("letter-spacing", computedStyles.letterSpacing, "important");
    element.style.setProperty("text-transform", computedStyles.textTransform, "important");
  }

  return () => {
    for (const [element, previousValues] of previousInlineValues) {
      for (const property of typographicProperties) {
        const previous = previousValues[property];
        if (previous.value) {
          element.style.setProperty(property, previous.value, previous.priority);
        } else {
          element.style.removeProperty(property);
        }
      }
    }
  };
};

const applyMotionFreezeToTree = (rootNode: HTMLElement): (() => void) => {
  const nodes = [rootNode, ...Array.from(rootNode.querySelectorAll<HTMLElement>("*"))];
  const previousValues = new Map<HTMLElement, { transition: string; animation: string }>();

  for (const element of nodes) {
    previousValues.set(element, {
      transition: element.style.getPropertyValue("transition"),
      animation: element.style.getPropertyValue("animation"),
    });

    element.style.setProperty("transition", "none", "important");
    element.style.setProperty("animation", "none", "important");
  }

  return () => {
    for (const [element, previous] of previousValues) {
      if (previous.transition) {
        element.style.setProperty("transition", previous.transition);
      } else {
        element.style.removeProperty("transition");
      }

      if (previous.animation) {
        element.style.setProperty("animation", previous.animation);
      } else {
        element.style.removeProperty("animation");
      }
    }
  };
};

const applyRootDimensionLock = (node: HTMLElement, dimensions: CaptureDimensions): (() => void) => {
  const trackedProperties = ["width", "height", "min-width", "min-height", "max-width", "overflow"] as const;
  const previousValues = trackedProperties.reduce(
    (acc, property) => {
      acc[property] = {
        value: node.style.getPropertyValue(property),
        priority: node.style.getPropertyPriority(property),
      };
      return acc;
    },
    {} as Record<(typeof trackedProperties)[number], { value: string; priority: string }>,
  );

  node.style.setProperty("width", `${dimensions.width}px`, "important");
  node.style.setProperty("height", `${dimensions.height}px`, "important");
  node.style.setProperty("min-width", `${dimensions.width}px`, "important");
  node.style.setProperty("min-height", `${dimensions.height}px`, "important");
  node.style.setProperty("max-width", "none", "important");
  node.style.setProperty("overflow", "hidden", "important");

  return () => {
    for (const property of trackedProperties) {
      const previous = previousValues[property];
      if (previous.value) {
        node.style.setProperty(property, previous.value, previous.priority);
      } else {
        node.style.removeProperty(property);
      }
    }
  };
};

const waitForFonts = async () => {
  if (!document.fonts?.ready) {
    return;
  }

  await withTimeout(document.fonts.ready, EXPORT_TIMEOUT_MS);
  await withTimeout(
    Promise.all([
      document.fonts.load("400 16px 'Space Grotesk'"),
      document.fonts.load("500 16px 'Space Grotesk'"),
      document.fonts.load("700 16px 'Space Grotesk'"),
      document.fonts.load("400 16px Orbitron"),
      document.fonts.load("600 16px Orbitron"),
      document.fonts.load("800 16px Orbitron"),
    ]),
    EXPORT_TIMEOUT_MS,
  );
};

const waitForImages = async (node: HTMLElement) => {
  const images = Array.from(node.querySelectorAll("img"));

  await withTimeout(
    Promise.all(
      images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }),
    ),
    EXPORT_TIMEOUT_MS,
  );
};

const stabilizeLayout = async () => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
};

const createBlobWithHtmlToImage = async ({
  node,
  dimensions,
}: CaptureEngineOptions): Promise<Blob> => {
  const rect = node.getBoundingClientRect();
  const maxEdge = Math.max(rect.width, rect.height);
  const dynamicScale = Math.min(window.devicePixelRatio * 2, MAX_EXPORT_DIMENSION / maxEdge);

  const blob = await withTimeout(
    htmlToImageToBlob(node, {
      cacheBust: true,
      pixelRatio: dynamicScale,
      backgroundColor: "#0a0216",
      width: dimensions.width,
      height: dimensions.height,
      canvasWidth: dimensions.width * dynamicScale,
      canvasHeight: dimensions.height * dynamicScale,
      skipFonts: false,
      style: {
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        minWidth: `${dimensions.width}px`,
        minHeight: `${dimensions.height}px`,
        maxWidth: "none",
        overflow: "hidden",
        transition: "none",
        animation: "none",
      },
    }),
    EXPORT_TIMEOUT_MS,
  );

  if (!blob) {
    throw new BannerExportError(
      "blob-generation",
      "Nao foi possivel gerar o blob da imagem para download.",
    );
  }

  return blob;
};

const downloadBlob = ({
  blob,
  pageView,
  format,
  profileBannerVariant,
  activeSpeakerKey,
  downloadPrefix,
}: {
  blob: Blob;
  pageView: PageView;
  format: Format;
  profileBannerVariant: ProfileBannerVariant;
  activeSpeakerKey: string;
  downloadPrefix: string;
}) => {
  const href = URL.createObjectURL(blob);
  const { pagePart, formatPart } = getDownloadNameParts({
    pageView,
    format,
    profileBannerVariant,
    activeSpeakerKey,
  });

  const fileName = `${sanitizeFilePart(downloadPrefix)}_${sanitizeFilePart(pagePart)}_${sanitizeFilePart(formatPart)}.png`;
  const link = document.createElement("a");
  link.download = fileName;
  link.href = href;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(href);
};

export const exportBannerAsPng = async ({
  pageView,
  profileBannerVariant,
  format,
  activeSpeakerKey,
  downloadPrefix,
}: ExportBannerAsPngOptions): Promise<void> => {
  const node = document.getElementById("banner-capture");

  if (!node) {
    throw new BannerExportError(
      "capture-node-not-found",
      "Nao foi possivel encontrar o banner para exportacao.",
    );
  }

  await withTimeout(new Promise((resolve) => setTimeout(resolve, 100)), EXPORT_TIMEOUT_MS);
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  await waitForFonts();
  await waitForImages(node);

  const restoreInlineFonts = applyInlineComputedFontFallback(node);

  try {
    const stableRect = node.getBoundingClientRect();
    const dimensions: CaptureDimensions = {
      width: Math.max(1, Math.round(stableRect.width)),
      height: Math.max(1, Math.round(stableRect.height)),
    };

    const restoreDimensionLock = applyRootDimensionLock(node, dimensions);
    const restoreMotionFreeze = applyMotionFreezeToTree(node);

    try {
      await stabilizeLayout();

      const blob = await createBlobWithHtmlToImage({
        node,
        dimensions,
      });

      downloadBlob({
        blob,
        pageView,
        format,
        profileBannerVariant,
        activeSpeakerKey,
        downloadPrefix,
      });
    } finally {
      restoreMotionFreeze();
      restoreDimensionLock();
    }
  } catch (error) {
    throw normalizeExportError(error);
  } finally {
    restoreInlineFonts();
  }
};
