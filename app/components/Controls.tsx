import {
  Badge,
  Camera,
  Download,
  FileText,
  Layers,
  LayoutDashboard,
  Link,
  Loader2,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  EventBannerVariant,
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
  eventBannerVariant: EventBannerVariant;
  onChangeEventBannerVariant: (variant: EventBannerVariant) => void;
  profileBannerVariant: ProfileBannerVariant;
  onChangeProfileBannerVariant: (variant: ProfileBannerVariant) => void;
  onChangeFormat: (format: Format) => void;
  onChangePage: (view: PageView) => void;
  onDownload: () => void;
};

const formatButtons: Array<{ value: Format; label: string; icon: ReactNode }> = [
  { value: "a4", label: "A4", icon: <FileText size={16} /> },
  { value: "instagram", label: "Feed", icon: <Camera size={16} /> },
  { value: "linkedin", label: "LinkedIn", icon: <Link size={16} /> },
];

export default function Controls({
  format,
  pageView,
  isDownloading,
  pageButtons,
  availableFormats,
  eventBannerVariant,
  onChangeEventBannerVariant,
  profileBannerVariant,
  onChangeProfileBannerVariant,
  onChangeFormat,
  onChangePage,
  onDownload,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-3 mb-6 items-center w-full max-w-2xl">
      <div className="flex gap-2 bg-[#12032b] p-2 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(76,29,149,0.3)] w-full justify-center overflow-x-auto no-scrollbar">
        {pageButtons.map((button, idx) => {
          const active = pageView === button.value;
          const activeClass =
            button.color === "cyan"
              ? "bg-cyan-400 text-[#12032b] font-bold"
              : "bg-purple-500 text-white font-bold";
          const idleClass =
            button.color === "cyan"
              ? "hover:bg-white/10 text-cyan-100"
              : "hover:bg-white/10 text-purple-200";

          return (
            <div key={button.value} className="flex items-center gap-2">
              {idx === 1 ? (
                <div className="h-7 w-px bg-purple-400/40 mx-1 shrink-0"></div>
              ) : null}
              <button
                onClick={() => onChangePage(button.value)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-space whitespace-nowrap text-sm ${active ? activeClass : idleClass}`}
              >
                {button.value === "main" || button.value === "galactic" ? (
                  <LayoutDashboard size={16} />
                ) : (
                  <User size={16} />
                )}
                {button.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
        {pageView === "main" ? (
          <div className="flex flex-col gap-2 bg-[#12032b] p-2 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(76,29,149,0.3)]">
            <div className="flex gap-2">
              <button
                onClick={() => onChangeEventBannerVariant("default")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-space text-sm ${eventBannerVariant === "default" ? "bg-cyan-400 text-[#12032b] font-bold" : "hover:bg-white/10 text-cyan-100"}`}
              >
                <LayoutDashboard size={16} /> Padrão
              </button>
              <button
                onClick={() => onChangeEventBannerVariant("meetup")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-space text-sm ${eventBannerVariant === "meetup" ? "bg-cyan-400 text-[#12032b] font-bold" : "hover:bg-white/10 text-cyan-100"}`}
              >
                <Layers size={16} /> Meetup
              </button>
            </div>
          </div>
        ) : null}

        {pageView === "galactic" ? (
          <div className="flex flex-col gap-2 bg-[#12032b] p-2 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(76,29,149,0.3)]">
            <div className="flex gap-2">
              <button
                onClick={() => onChangeProfileBannerVariant("meetup")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-space text-sm ${profileBannerVariant === "meetup" ? "bg-cyan-400 text-[#12032b] font-bold" : "hover:bg-white/10 text-cyan-100"}`}
              >
                <Badge size={16} /> Meetup
              </button>
              <button
                onClick={() => onChangeProfileBannerVariant("linkedin")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-space text-sm ${profileBannerVariant === "linkedin" ? "bg-cyan-400 text-[#12032b] font-bold" : "hover:bg-white/10 text-cyan-100"}`}
              >
                <Link size={16} /> Linkedin
              </button>
            </div>
          </div>
        ) : pageView !== "main" || eventBannerVariant === "default" ? (
          <div className="flex gap-2 bg-[#12032b] p-2 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(76,29,149,0.3)]">
            {formatButtons
              .filter((button) => availableFormats.includes(button.value))
              .map((button) => {
                const active = format === button.value;
                return (
                  <button
                    key={button.value}
                    onClick={() => onChangeFormat(button.value)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-space text-sm ${active ? "bg-cyan-400 text-[#12032b] font-bold" : "hover:bg-white/10 text-cyan-100"}`}
                  >
                    {button.icon}
                    {button.label}
                  </button>
                );
              })}
          </div>
        ) : null}

        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="px-6 py-2.5 rounded-xl flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          {isDownloading ? "Gerando..." : "Baixar"}
        </button>
      </div>
    </div>
  );
}
