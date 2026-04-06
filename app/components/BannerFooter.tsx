import AssetImage from "./AssetImage";
import type { Sizes } from "./types";

type BannerFooterProps = {
  sizes: Sizes;
  labels: {
    realization: string;
    support: string;
  };
  assets: {
    realizationLogo: string;
    primarySupportLogo: string;
    supportLogos: string[];
  };
};

export default function BannerFooter({ sizes, labels, assets }: BannerFooterProps) {
  return (
    <div className="shrink-0 w-full mt-auto pt-2 sm:pt-4 border-t border-purple-500/30 flex justify-between items-stretch gap-2">
      <div className="flex flex-col gap-0.5 sm:gap-1.5">
        <span className="font-orbitron text-cyan-400/70 text-[7px] sm:text-[9px] uppercase tracking-widest">
          {labels.realization}
        </span>
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <AssetImage
            src={assets.realizationLogo}
            alt="AWS Cloud Clubs"
            data-export-force-white="true"
            className={`object-contain filter brightness-0 invert opacity-90 ${sizes.footerCC}`}
          />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 sm:gap-1.5 items-end">
        <span className="font-orbitron text-cyan-400/70 text-[7px] sm:text-[9px] uppercase tracking-widest">
          {labels.support}
        </span>
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <AssetImage
            src={assets.primarySupportLogo}
            alt="Univali"
            data-export-force-white="true"
            className={`object-contain filter brightness-0 invert opacity-90 mr-1 sm:mr-2 ${sizes.footerAp}`}
          />
          {assets.supportLogos.length > 0 ? (
            <>
              <div className="w-px h-6 sm:h-8 lg:h-10 bg-purple-500/30 mx-1 sm:mx-2"></div>
              {assets.supportLogos.map((logoSrc, index) => (
                <AssetImage
                  key={logoSrc}
                  src={logoSrc}
                  alt={`Apoiador ${index + 1}`}
                  className={`object-contain rounded-sm mix-blend-screen ${sizes.footerAp}`}
                />
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
