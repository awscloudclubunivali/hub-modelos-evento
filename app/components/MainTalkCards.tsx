import { Cloud, Terminal } from "lucide-react";
import AssetImage from "./AssetImage";
import type { Sizes, Speaker, Talk } from "./types";

type MainTalkCardsProps = {
  sizes: Sizes;
  talks: Talk[];
  speakers: Record<string, Speaker>;
};

function TalkCard({
  theme,
  tag,
  title,
  speakerNames,
  images,
  sizes,
}: {
  theme: "cyan" | "purple";
  tag: string;
  title: string;
  speakerNames: string;
  images: string[];
  sizes: Sizes;
}) {
  const isCyan = theme === "cyan";
  return (
    <div
      className={`group relative overflow-hidden bg-[#12032b]/60 border border-purple-400/30 backdrop-blur-md rounded-2xl flex flex-col justify-center shadow-lg w-full ${sizes.cardPad}`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 ${isCyan ? "bg-cyan-400 shadow-[0_0_15px_#22d3ee]" : "bg-purple-400 shadow-[0_0_15px_#c084fc]"} rounded-l-2xl`}
      ></div>
      <div className="flex items-center h-full ml-2 sm:ml-4 gap-4">
        <div className="flex-1 min-w-0">
          <div
            className={`font-orbitron ${isCyan ? "text-cyan-400" : "text-purple-300"} font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5 ${sizes.cardTag}`}
          >
            {isCyan ? <Terminal size={sizes.cardIconSize} /> : <Cloud size={sizes.cardIconSize} />}
            <span
              className="font-orbitron truncate"
              style={{ fontFamily: '"Orbitron", var(--font-sans), sans-serif' }}
            >
              {tag}
            </span>
          </div>
          <h3 className={`font-space font-bold text-white truncate ${sizes.cardTitle}`}>
            {title}
          </h3>
          <p className={`font-space text-purple-200 mt-0.5 ${sizes.cardSpeaker}`}>
            {speakerNames}
          </p>
        </div>

        {images.length > 1 ? (
          <div className="flex shrink-0 -space-x-3 sm:-space-x-4 pr-2 sm:pr-4">
            {images.map((src, idx) => (
              <AssetImage
                key={idx}
                src={src}
                className={`rounded-full border-2 border-purple-500 object-cover ${sizes.featAvatar}`}
                alt={`Speaker ${idx + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="shrink-0 pr-2 sm:pr-4">
            <AssetImage
              src={images[0]}
              className={`rounded-full border-2 border-purple-500 object-cover ${sizes.featAvatar}`}
              alt="Speaker"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function MainTalkCards({ sizes, talks, speakers }: MainTalkCardsProps) {
  return (
    <>
      {talks.map((talk) => {
        const talkSpeakers = talk.speakerIds
          .map((speakerId) => speakers[speakerId])
          .filter(Boolean);
        const speakerNames = talkSpeakers.map((speaker) => speaker.name).join(" & ");
        const images = talkSpeakers.map((speaker) => speaker.img);

        if (!images.length) {
          return null;
        }

        return (
          <TalkCard
            key={talk.id}
            theme={talk.theme}
            tag={talk.tag}
            title={talk.title}
            speakerNames={speakerNames}
            images={images}
            sizes={sizes}
          />
        );
      })}
    </>
  );
}
