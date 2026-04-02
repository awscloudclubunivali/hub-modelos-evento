import { Cloud, Terminal } from "lucide-react";
import AssetImage from "./AssetImage";
import type { Format, Sizes, Speaker } from "./types";

type FeaturedSpeakerCardProps = {
  speaker: Speaker;
  isTalk2: boolean;
  isHorizontal: boolean;
  format: Format;
  sizes: Sizes;
};

export default function FeaturedSpeakerCard({
  speaker,
  isTalk2,
  isHorizontal,
  format,
  sizes,
}: FeaturedSpeakerCardProps) {
  const isFeedMode = format === "instagram";
  const icon =
    speaker.iconType === "cloud" ? (
      <Cloud size={sizes.featIconSize} />
    ) : (
      <Terminal size={sizes.featIconSize} />
    );

  return (
    <div
      className={`group relative overflow-hidden bg-[#12032b]/60 border border-purple-400/30 backdrop-blur-md rounded-3xl flex flex-col shadow-lg w-full transition-all duration-300 min-h-0 ${isHorizontal ? "" : "flex-1"} ${sizes.featCardPad}`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-2 sm:w-3 ${isTalk2 ? "bg-purple-400 shadow-[0_0_15px_#c084fc]" : "bg-cyan-400 shadow-[0_0_15px_#22d3ee]"} rounded-l-3xl z-20`}
      ></div>

      <div className="relative z-10 w-full flex flex-col h-full min-h-0">
        <div className="relative flex justify-between items-center gap-3 shrink-0">
          <div
            className={`flex-1 min-w-0 ${format === "a4" ? "pr-4 sm:pr-6 max-w-[72%]" : ""} ${isFeedMode ? "pr-20 sm:pr-24" : ""}`}
          >
            <div
              className={`font-orbitron ${isTalk2 ? "text-purple-300" : "text-cyan-400"} font-bold uppercase tracking-widest flex items-center gap-1.5 ${sizes.featCardTag}`}
            >
              {icon}
              <span className="truncate">{speaker.tag}</span>
            </div>
            <h3 className={`font-space font-bold text-white ${sizes.featCardTitle}`}>
              {speaker.title}
            </h3>
          </div>

          <div className={`${isFeedMode ? "absolute top-0 right-0" : "shrink-0"}`}>
            <AssetImage
              src={speaker.img}
              alt={speaker.name}
              className={`rounded-full border-[3px] border-purple-500 bg-[#3d1366] object-cover shadow-2xl ${sizes.featAvatar}`}
            />
          </div>
        </div>

        <div
          className={`min-h-0 overflow-y-auto pr-1 custom-scrollbar flex flex-col ${isFeedMode ? "mt-1 sm:mt-2" : sizes.featContentMt}`}
        >
          <div
            className={`bg-black/20 rounded-2xl border border-white/5 w-full ${sizes.featBoxPad} shadow-inner`}
          >
            <h4 className={`font-space ${sizes.featBoxTitle}`}>{speaker.name}</h4>
            <p className={`font-space ${sizes.featBoxText}`}>{speaker.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
