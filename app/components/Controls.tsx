import { memo } from "react";
import {
  Bug,
  Badge,
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  LayoutDashboard,
  Link,
  Loader2,
  User,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import CarouselNavigationBar from "./CarouselNavigationBar";
import { getPageCategory } from "./page-view-config";
import ControlSurface from "./ui/ControlSurface";
import IconActionButton from "./ui/IconActionButton";
import SegmentedControl from "./ui/SegmentedControl";
import PrimaryActionButton from "./ui/PrimaryActionButton";
import type { ReactNode } from "react";
import type {
  CarouselNavigation,
  Format,
  PageView,
  ProfileBannerVariant,
} from "./types";

type ControlsProps = {
  format: Format;
  pageView: PageView;
  isDownloading: boolean;
  pageButtons: Array<{ value: PageView; label: string; color: "cyan" | "purple" }>;
  availableFormats: Format[];
  carouselNavigation?: CarouselNavigation | null;
  profileBannerVariant: ProfileBannerVariant;
  exportDebugMode: boolean;
  onChangeProfileBannerVariant: (variant: ProfileBannerVariant) => void;
  onToggleExportDebugMode: () => void;
  onChangeFormat: (format: Format) => void;
  onChangePage: (view: PageView) => void;
  onDownload: () => void;
};

const formatButtons: Array<{ value: Format; label: string; icon: ReactNode }> = [
  { value: "a4", label: "Geral", icon: <FileText size={16} /> },
  { value: "instagram", label: "Instagram", icon: <FaInstagram size={16} /> },
  { value: "linkedin", label: "LinkedIn", icon: <Link size={16} /> },
];

const pageCategoryIcons = {
  content: <LayoutDashboard size={16} />,
  partner: <Building2 size={16} />,
  speaker: <User size={16} />,
} as const;

const profileVariantOptions: Array<{
  value: ProfileBannerVariant;
  label: string;
  icon: ReactNode;
}> = [
  { value: "meetup", label: "Meetup", icon: <Badge size={16} /> },
  { value: "linkedin", label: "Linkedin", icon: <Link size={16} /> },
];

function Controls({
  format,
  pageView,
  isDownloading,
  pageButtons,
  availableFormats,
  carouselNavigation,
  profileBannerVariant,
  exportDebugMode,
  onChangeProfileBannerVariant,
  onToggleExportDebugMode,
  onChangeFormat,
  onChangePage,
  onDownload,
}: ControlsProps) {
  const currentPageButtonIndex = Math.max(
    pageButtons.findIndex((button) =>
      button.value.startsWith("speaker:")
        ? pageView.startsWith("speaker:")
        : pageView === button.value,
    ),
    0,
  );
  const currentPageButton = pageButtons[currentPageButtonIndex];

  const handlePreviousPage = () => {
    if (!pageButtons.length) return;
    const previousIndex =
      (currentPageButtonIndex - 1 + pageButtons.length) % pageButtons.length;
    onChangePage(pageButtons[previousIndex].value);
  };

  const handleNextPage = () => {
    if (!pageButtons.length) return;
    const nextIndex = (currentPageButtonIndex + 1) % pageButtons.length;
    onChangePage(pageButtons[nextIndex].value);
  };

  const showVariantSelector = pageView === "galactic";
  const showFormatSelector = !showVariantSelector && pageView !== "main-meetup";
  const showExportDebugToggle = false;
  const pageCategory = currentPageButton
    ? getPageCategory(currentPageButton.value)
    : "content";

  return (
    <div className="flex flex-col gap-3 mb-6 items-center w-full max-w-6xl">
      <ControlSurface className="flex items-center gap-2 p-2 sm:px-3 w-full max-w-3xl">
        <IconActionButton
          onClick={handlePreviousPage}
          className="text-cyan-100 hover:bg-white/10 transition-colors"
          label="Banner anterior"
          icon={<ChevronLeft size={18} />}
          compact
        />

        <button
          type="button"
          onClick={() => onChangePage(currentPageButton.value)}
          aria-pressed="true"
          aria-label={`Pagina atual: ${currentPageButton.label}`}
          className={`flex-1 min-w-0 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-space whitespace-nowrap text-sm ${
            currentPageButton.color === "cyan"
              ? "bg-cyan-400 text-[#12032b] font-bold"
              : "bg-purple-500 text-white font-bold"
          }`}
        >
          {pageCategoryIcons[pageCategory]}
          <span className="truncate">{currentPageButton.label}</span>
        </button>

        <IconActionButton
          onClick={handleNextPage}
          className="text-cyan-100 hover:bg-white/10 transition-colors"
          label="Próximo banner"
          icon={<ChevronRight size={18} />}
          compact
        />
      </ControlSurface>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
        {showVariantSelector ? (
          <ControlSurface className="p-2">
            <SegmentedControl
              options={profileVariantOptions}
              value={profileBannerVariant}
              ariaLabel="Selecionar variante do banner de perfil"
              onChange={onChangeProfileBannerVariant}
            />
          </ControlSurface>
        ) : null}

        {showFormatSelector ? (
          <ControlSurface className="p-2">
            <SegmentedControl
              options={formatButtons.filter((button) =>
                availableFormats.includes(button.value),
              )}
              value={format}
              ariaLabel="Selecionar formato de exportacao"
              onChange={onChangeFormat}
            />
          </ControlSurface>
        ) : null}

        {carouselNavigation ? (
          <CarouselNavigationBar {...carouselNavigation} compact />
        ) : null}

        {showExportDebugToggle ? (
          <ControlSurface className="px-2 py-2">
            <button
              type="button"
              role="switch"
              aria-checked={exportDebugMode}
              aria-label="Alternar modo debug de exportacao"
              onClick={onToggleExportDebugMode}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all font-space text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12032b] ${
                exportDebugMode
                  ? "bg-amber-300 text-[#12032b] font-bold"
                  : "text-amber-100 hover:bg-white/10"
              }`}
            >
              <Bug size={15} />
              {exportDebugMode ? "Debug Export: ON" : "Debug Export: OFF"}
            </button>
          </ControlSurface>
        ) : null}

        <PrimaryActionButton
          onClick={onDownload}
          loading={isDownloading}
          label="Baixar"
          loadingLabel="Gerando..."
          aria-label="Baixar modelo em PNG"
          icon={<Download size={18} />}
          loadingIcon={<Loader2 size={18} className="animate-spin" />}
        />
      </div>
    </div>
  );
}

export default memo(Controls);
