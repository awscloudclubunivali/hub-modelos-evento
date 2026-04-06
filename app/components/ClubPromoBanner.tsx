import { memo } from "react";
import { Lightbulb, QrCode, Users, Wrench } from "lucide-react";
import AssetImage from "./AssetImage";
import ClubSocialFooter from "./ClubSocialFooter";
import TemplateBackdrop from "./TemplateBackdrop";
import type { EventConfig, Format, Sizes } from "./types";

type ClubPromoBannerProps = {
  eventConfig: EventConfig;
  sizes: Sizes;
  format: Format;
  exportDebugMode: boolean;
};

function ClubPromoBanner({
  eventConfig,
  sizes,
  format,
  exportDebugMode,
}: ClubPromoBannerProps) {
  const promo = eventConfig.clubPromo;
  const isInstagram = format === "instagram";
  const qrSrc =
    promo.qrCodeImage ||
    `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(
      promo.siteUrl,
    )}`;
  const highlightIcons = [Lightbulb, Users, Wrench];

  return (
    <>
      <TemplateBackdrop exportDebugMode={exportDebugMode} />

      <div className={`relative z-10 flex flex-col w-full h-full ${sizes.containerPad}`}>
        <div
          className={`flex-1 min-h-0 ${
            isInstagram
              ? "grid grid-cols-12 gap-3 items-start"
              : "flex flex-col gap-5"
          }`}
        >
          <div className={`${isInstagram ? "col-span-7" : "w-full"} flex flex-col`}>
            <div className="flex items-center gap-3 sm:gap-5 mb-2 z-20">
              <AssetImage
                src={eventConfig.assets.mascot}
                alt="Mascote"
                className={`${sizes.mascot} object-cover rounded-full shadow-2xl shrink-0 border border-purple-500/30`}
              />
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-[2px] w-4 sm:w-6 bg-cyan-400"></div>
                  <span className="font-orbitron text-cyan-400 tracking-[0.1em] text-[8px] sm:text-[10px] font-semibold uppercase">
                    {eventConfig.branding.communityLabel}
                  </span>
                </div>
                <h1
                  className={`font-space font-bold text-white leading-[1.05] tracking-tight whitespace-nowrap ${sizes.title}`}
                >
                  {eventConfig.branding.organizationName}
                </h1>
                <h2
                  className={`font-space font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 whitespace-nowrap ${sizes.subtitle}`}
                >
                  {eventConfig.branding.organizationUnit}
                </h2>
              </div>
            </div>

            <h3
              className={`font-space font-bold text-cyan-200 leading-tight mt-2 ${
                isInstagram ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
              }`}
            >
              {promo.headline}
            </h3>
            <p
              className={`font-space text-cyan-100/85 leading-relaxed mt-2 ${
                isInstagram ? "text-sm sm:text-base" : "text-base sm:text-lg"
              }`}
            >
              {promo.subheadline}
            </p>

            <div className="flex items-center justify-start flex-row flex-wrap w-full mt-3 gap-2.5">
              {promo.highlights.map((item, index) => {
                const Icon = highlightIcons[index % highlightIcons.length];
                return (
                <span
                  key={item}
                  className="text-[11px] sm:text-xs font-medium text-white whitespace-nowrap flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 shadow-lg"
                >
                  <Icon size={12} className="text-cyan-300" />
                  {item}
                </span>
                );
              })}
            </div>
          </div>

          <div
            className={`${
              isInstagram
                ? "col-span-5 h-full flex items-start justify-end pt-10 sm:pt-30"
                : "w-full max-w-[320px] self-center mb-2"
            }`}
          >
            <div
              className={`rounded-3xl border border-white/10 bg-black/30 backdrop-blur-sm flex flex-col items-center w-full ${
                isInstagram ? "p-3 sm:p-4" : "p-4 sm:p-5"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-cyan-200">
                <QrCode size={18} />
                <span className="font-orbitron text-[10px] tracking-[0.16em] uppercase">
                  Escaneie e acesse
                </span>
              </div>

              <div className={`rounded-xl bg-white shadow-2xl ${isInstagram ? "p-3" : "p-3.5"}`}>
                <AssetImage
                  src={qrSrc}
                  alt="QR Code do site do AWS Cloud Club"
                  className={isInstagram ? "w-36 h-36 object-contain" : "w-44 h-44 object-contain"}
                />
              </div>

              <p className="mt-3 text-center font-space text-[10px] sm:text-xs text-cyan-100 break-all max-w-[280px] leading-snug">
                {promo.siteUrl}
              </p>
            </div>
          </div>
        </div>

        <ClubSocialFooter
          sizes={sizes}
          format={format}
          socials={eventConfig.event.socials}
        />
      </div>
    </>
  );
}

export default memo(ClubPromoBanner);
