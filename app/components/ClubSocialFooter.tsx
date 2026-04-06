import { Mail } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { SiMeetup } from "react-icons/si";
import type { Format, Sizes } from "./types";

type ClubSocialFooterProps = {
  sizes: Sizes;
  format: Format;
  socials: {
    instagram: string;
    linkedin: string;
    email: string;
    meetup: string;
    youtube: string;
  };
};

const getDisplayValue = (id: string, value: string): string => {
  if (!value) return "";

  if (id === "email") {
    return value.replace(/^mailto:/i, "");
  }

  if (value.startsWith("/")) {
    return value;
  }

  const normalized = value.replace(/^https?:\/\//i, "");
  const firstSlash = normalized.indexOf("/");
  return firstSlash >= 0 ? `/${normalized.slice(firstSlash + 1)}` : `/${normalized}`;
};

export default function ClubSocialFooter({
  sizes,
  format,
  socials,
}: ClubSocialFooterProps) {
  const isInstagram = format === "instagram";
  const sharedChannelValue =
    getDisplayValue("instagram", socials.instagram) ||
    getDisplayValue("linkedin", socials.linkedin) ||
    getDisplayValue("youtube", socials.youtube);
  const meetupValue = getDisplayValue("meetup", socials.meetup);
  const emailValue = getDisplayValue("email", socials.email);

  return (
    <div
      className={`shrink-0 w-full mt-auto border-t border-purple-500/30 ${
        isInstagram ? "pt-2" : "pt-3 sm:pt-4"
      }`}
    >
      <div className="w-full grid grid-cols-[auto,1fr] auto-rows-auto items-start gap-x-2 sm:gap-x-3 gap-y-1.5 sm:gap-y-2">
        <div className="col-start-1 row-start-1 h-8 sm:h-9 flex items-center pr-2">
          <span className="font-orbitron text-cyan-400/80 text-[8px] sm:text-[10px] uppercase tracking-[0.18em] leading-tight">
            Conecte-se com o Club
          </span>
        </div>
        {sharedChannelValue ? (
          <div className="col-start-2 justify-self-end inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 bg-white/5 border border-white/10 max-w-full min-w-0">
            <FaInstagram size={sizes.iconSize} className="text-cyan-300" />
            <FaLinkedinIn size={sizes.iconSize} className="text-cyan-300" />
            <FaYoutube size={sizes.iconSize} className="text-cyan-300" />
            <span className="font-space text-[10px] sm:text-xs text-cyan-100/90 break-all leading-snug">
              {sharedChannelValue}
            </span>
          </div>
        ) : null}

        {meetupValue ? (
          <div className="col-start-2 justify-self-end inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 bg-white/5 border border-white/10 max-w-full min-w-0">
            <SiMeetup size={sizes.iconSize} className="text-cyan-300" />
            <span className="font-space text-[10px] sm:text-xs text-cyan-100/90 break-all leading-snug">
              {meetupValue}
            </span>
          </div>
        ) : null}

        {emailValue ? (
          <div className="col-start-2 justify-self-end inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 bg-white/5 border border-white/10 max-w-full min-w-0">
            <Mail size={sizes.iconSize} className="text-cyan-300" />
            <span className="font-space text-[10px] sm:text-xs text-cyan-100/90 break-all leading-snug">
              {emailValue}
            </span>
          </div>
        ) : null}

        {!sharedChannelValue && !meetupValue && !emailValue ? (
          <span className="col-start-2 justify-self-end font-space text-[10px] sm:text-xs text-cyan-100/60">
            Configure as redes no event.json
          </span>
        ) : null}
      </div>
    </div>
  );
}
