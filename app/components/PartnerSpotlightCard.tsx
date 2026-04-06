import { Building2 } from "lucide-react";
import AssetImage from "./AssetImage";
import type { Format, Partner, Sizes } from "./types";

type PartnerSpotlightCardProps = {
  partner: Partner;
  categoryLabel: string;
  format: Format;
  sizes: Sizes;
};

export default function PartnerSpotlightCard({
  partner,
  categoryLabel,
  format,
  sizes,
}: PartnerSpotlightCardProps) {
  const isFeedMode = format === "instagram";

  return (
    <div
      className={`group relative overflow-hidden bg-[#12032b]/60 border border-purple-400/30 backdrop-blur-md rounded-3xl flex flex-col shadow-lg w-full transition-all duration-300 min-h-0 ${sizes.featCardPad}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-2 sm:w-3 bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded-l-3xl z-20"></div>

      <div className="relative z-10 w-full flex flex-col h-full min-h-0">
        <div className="relative flex justify-between items-center gap-3 shrink-0">
          <div
            className={`flex-1 min-w-0 ${format === "a4" ? "pr-4 sm:pr-6 max-w-[72%]" : ""} ${isFeedMode ? "pr-20 sm:pr-24" : ""}`}
          >
            <div
              className={`font-orbitron text-cyan-300 font-bold uppercase tracking-widest flex items-center gap-1.5 ${sizes.featCardTag}`}
            >
              <Building2 size={sizes.featIconSize} />
              <span className="truncate">{categoryLabel}</span>
            </div>
            <h3 className={`font-space font-bold text-white ${sizes.featCardTitle}`}>
              {partner.name}
            </h3>
          </div>

          <div className={`${isFeedMode ? "absolute top-0 right-0" : "shrink-0"}`}>
            <AssetImage
              src={partner.logo}
              alt={partner.name}
              className={`rounded-2xl border-[3px] border-purple-500 bg-[#3d1366] object-contain shadow-2xl -mt-2 ${sizes.featAvatar}`}
            />
          </div>
        </div>

        <div
          className={`min-h-0 overflow-y-auto pr-1 custom-scrollbar flex flex-col ${isFeedMode ? "mt-1 sm:mt-2" : sizes.featContentMt}`}
        >
          <div
            className={`bg-black/20 rounded-2xl border border-white/5 w-full ${sizes.featBoxPad} shadow-inner`}
          >
            <p className={`font-space ${sizes.featBoxText}`}>{partner.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
