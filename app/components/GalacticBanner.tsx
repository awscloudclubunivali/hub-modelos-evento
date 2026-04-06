"use client";

import { memo, useEffect, useRef, useState } from "react";
import AssetImage from "./AssetImage";
import TemplateBackdrop from "./TemplateBackdrop";
import type { EventConfig, ProfileBannerVariant } from "./types";

type GalacticBannerProps = {
  eventConfig: EventConfig;
  variant: ProfileBannerVariant;
  exportDebugMode: boolean;
  eventHeadline?: string;
};

type Star = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  alphaChange: number;
};

function GalacticBanner({
  eventConfig,
  variant,
  exportDebugMode,
  eventHeadline,
}: GalacticBannerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const exportBackgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [exportBackgroundDataUrl, setExportBackgroundDataUrl] = useState<string | null>(null);
  const isLinkedin = variant === "linkedin";

  useEffect(() => {
    const canvas = canvasRef.current;
    const exportCanvas = exportBackgroundCanvasRef.current;
    const container = containerRef.current;

    if (!canvas || !exportCanvas || !container) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const exportCtx = exportCanvas.getContext("2d");
    if (!ctx || !exportCtx) {
      return;
    }

    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((width * height) / 4000);
      for (let i = 0; i < numStars; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.3,
          vx: Math.random() * 0.1 - 0.05,
          vy: Math.random() * 0.1 - 0.05,
          alpha: Math.random() * 0.8 + 0.2,
          alphaChange: Math.random() * 0.01 - 0.005,
        });
      }
    };

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      exportCanvas.width = width;
      exportCanvas.height = height;
      initStars();
      drawExportBackground();
      drawStars();
      setExportBackgroundDataUrl(exportCanvas.toDataURL("image/png"));
    };

    const seededRandom = (seed: number): number => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const drawExportBackground = () => {
      exportCtx.clearRect(0, 0, width, height);

      const baseGradient = exportCtx.createLinearGradient(0, 0, 0, height);
      baseGradient.addColorStop(0, "#090118");
      baseGradient.addColorStop(0.52, "#180730");
      baseGradient.addColorStop(1, "#2a0845");
      exportCtx.fillStyle = baseGradient;
      exportCtx.fillRect(0, 0, width, height);

      const cyanNebula = exportCtx.createRadialGradient(
        width * 0.84,
        height * 0.12,
        0,
        width * 0.84,
        height * 0.12,
        Math.max(width, height) * 0.62,
      );
      cyanNebula.addColorStop(0, "rgba(34, 211, 238, 0.28)");
      cyanNebula.addColorStop(1, "rgba(34, 211, 238, 0)");
      exportCtx.fillStyle = cyanNebula;
      exportCtx.fillRect(0, 0, width, height);

      const purpleNebula = exportCtx.createRadialGradient(
        width * 0.16,
        height * 0.9,
        0,
        width * 0.16,
        height * 0.9,
        Math.max(width, height) * 0.74,
      );
      purpleNebula.addColorStop(0, "rgba(168, 85, 247, 0.34)");
      purpleNebula.addColorStop(1, "rgba(168, 85, 247, 0)");
      exportCtx.fillStyle = purpleNebula;
      exportCtx.fillRect(0, 0, width, height);

      const starCount = Math.floor((width * height) / 5500);
      for (let i = 0; i < starCount; i += 1) {
        const x = seededRandom(i * 11.31) * width;
        const y = seededRandom(i * 7.17 + 2.3) * height;
        const radius = 0.35 + seededRandom(i * 19.87 + 3.1) * 1.35;
        const alpha = 0.35 + seededRandom(i * 13.07 + 5.2) * 0.65;
        exportCtx.beginPath();
        exportCtx.arc(x, y, radius, 0, Math.PI * 2);
        exportCtx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        exportCtx.fill();
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
      });
    };

    const timeout = setTimeout(() => {
      resize();
    }, 100);

    window.addEventListener("resize", resize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-galactic-banner-root="true"
      className="relative w-full h-full rounded-none overflow-hidden shadow-[0_30px_80px_-15px_rgba(76,29,149,0.5)]"
    >
      {exportBackgroundDataUrl ? (
        <AssetImage
          src={exportBackgroundDataUrl}
          alt=""
          data-galactic-export-image="true"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      ) : null}

      <TemplateBackdrop
        exportDebugMode={exportDebugMode}
        gridOpacityClass="opacity-100"
        starsOpacityClass={isLinkedin ? "opacity-50" : "opacity-75"}
      />

      <canvas
        ref={exportBackgroundCanvasRef}
        data-galactic-export-bg="true"
        className="absolute inset-0 w-full h-full z-0 opacity-0 pointer-events-none"
      ></canvas>

      <canvas
        ref={canvasRef}
        data-galactic-stars-canvas="true"
        style={exportDebugMode ? { opacity: 0, mixBlendMode: "normal", filter: "none" } : undefined}
        className={`absolute inset-0 w-full h-full z-0 mix-blend-screen ${isLinkedin ? "opacity-0" : "opacity-20"}`}
      ></canvas>

      <div className={`${isLinkedin ? "absolute top-1/2 -translate-y-1/2 left-[18%] z-20 group" : "absolute top-8 left-10 sm:top-10 sm:left-12 md:top-12 md:left-16 z-20 group"}`}>
        <AssetImage
          src={eventConfig.assets.mascot}
          alt="Mascote Capivara AWS"
          className={`${isLinkedin ? "relative w-20 h-20 rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-105 object-cover" : "relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-105 object-cover"}`}
        />
      </div>

      <div className={`${isLinkedin ? "absolute top-4 right-6 z-30 transition-opacity duration-300 opacity-90 hover:opacity-100" : "absolute top-8 right-10 sm:top-10 sm:right-12 md:top-12 md:right-16 z-30 transition-opacity duration-300 opacity-90 hover:opacity-100"}`}>
        <AssetImage
          src={eventConfig.assets.realizationLogo}
          alt="Logo AWS Cloud Clubs"
          data-export-force-white="true"
          className={`${isLinkedin ? "h-10 object-contain filter brightness-0 invert drop-shadow-md" : "h-20 sm:h-24 md:h-32 lg:h-40 object-contain filter brightness-0 invert drop-shadow-md"}`}
        />
      </div>

      <div className={`${isLinkedin ? "absolute inset-y-0 left-[31%] z-20 flex flex-col justify-center items-start max-w-[40%]" : "absolute bottom-6 left-10 sm:bottom-8 sm:left-12 md:bottom-10 md:left-16 z-20 flex flex-col items-start"}`}>
        <div className={`${isLinkedin ? "flex items-center gap-3 mb-4" : "flex items-center gap-3 mb-4 mt-2 sm:mt-3"}`}>
          <div className="h-[2px] w-8 bg-cyan-400"></div>
          <span className={`${isLinkedin ? "font-orbitron text-cyan-400 tracking-[0.2em] text-[9px] font-semibold uppercase" : "font-orbitron text-cyan-400 tracking-[0.2em] text-xs sm:text-sm font-semibold uppercase"}`}>
            {eventConfig.branding.communityLabel}
          </span>
        </div>

        <h1 className={`${isLinkedin ? "font-space text-xl font-bold text-white leading-[1.05] tracking-tight whitespace-nowrap" : "font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight whitespace-nowrap"}`}>
          {eventConfig.branding.organizationName}
        </h1>
        <h2 className={`${isLinkedin ? "inline-block font-space text-xl font-bold mt-1 uppercase tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 whitespace-nowrap pr-[0.2em]" : "inline-block font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-1 uppercase tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 whitespace-nowrap pr-[0.2em]"}`}>
          {`${eventConfig.branding.organizationUnit}\u00A0`}
        </h2>
        {!isLinkedin && eventHeadline ? (
          <p className="mt-3 max-w-[520px] md:max-w-[560px] font-space text-sm sm:text-base md:text-lg text-cyan-100/90 leading-snug">
            {eventHeadline}
          </p>
        ) : null}
      </div>

      <div className={`${isLinkedin ? "absolute bottom-4 right-6 z-30" : "absolute bottom-8 right-10 sm:bottom-10 sm:right-12 md:bottom-12 md:right-16 z-30"}`}>
        <AssetImage
          src={eventConfig.assets.primarySupportLogo}
          alt="Logo Univali"
          data-export-force-white="true"
          className={`${isLinkedin ? "h-8 object-contain filter brightness-0 invert drop-shadow-md" : "h-10 sm:h-14 md:h-16 lg:h-20 object-contain filter brightness-0 invert drop-shadow-md"}`}
        />
      </div>

      <div className={`${isLinkedin ? "absolute inset-y-0 right-[3%] w-[26%] flex items-center justify-center z-10 pointer-events-none" : "absolute inset-y-0 right-[6%] md:right-[12%] w-[72%] sm:w-[56%] md:w-[48%] flex items-center justify-center z-10 pointer-events-none"}`}>
        <AssetImage
          src={eventConfig.assets.balloon}
          alt="Balao Cloud Club"
          className={`${isLinkedin ? "w-full max-w-[220px] object-contain drop-shadow-2xl" : "w-full max-w-[300px] md:max-w-[550px] object-contain drop-shadow-2xl"}`}
        />
      </div>
    </div>
  );
}

export default memo(GalacticBanner);
