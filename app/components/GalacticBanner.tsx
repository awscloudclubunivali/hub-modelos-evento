"use client";

import { useEffect, useRef } from "react";
import AssetImage from "./AssetImage";
import type { EventConfig, ProfileBannerVariant } from "./types";

type GalacticBannerProps = {
  eventConfig: EventConfig;
  variant: ProfileBannerVariant;
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

export default function GalacticBanner({
  eventConfig,
  variant,
  eventHeadline,
}: GalacticBannerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isLinkedin = variant === "linkedin";

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
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
      initStars();
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
      drawStars();
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
      className="relative w-full h-full rounded-none overflow-hidden shadow-[0_30px_80px_-15px_rgba(76,29,149,0.5)] bg-gradient-to-b from-[#0a0216] via-[#1a0833] to-[#2a0845]"
    >

      <div className="absolute inset-0 bg-grid-pattern z-0"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-cyan-600/20 blur-[120px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
      <div className="absolute -bottom-[10%] -left-[20%] w-[70%] h-[70%] bg-purple-600/30 blur-[130px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
      <div
        className={`absolute inset-0 stars-organic pointer-events-none mix-blend-screen z-0 ${isLinkedin ? "opacity-50" : "opacity-75"}`}
      ></div>

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full z-0 mix-blend-screen ${isLinkedin ? "opacity-0" : "opacity-20"}`}
      ></canvas>

      <div className={`${isLinkedin ? "absolute top-1/2 -translate-y-1/2 left-[18%] md:left-[22%] z-20 group" : "absolute top-8 left-10 sm:top-10 sm:left-12 md:top-12 md:left-16 z-20 group"}`}>
        <AssetImage
          src={eventConfig.assets.mascot}
          alt="Mascote Capivara AWS"
          className={`${isLinkedin ? "relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-105 object-cover" : "relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-105 object-cover"}`}
        />
      </div>

      <div className={`${isLinkedin ? "absolute top-4 right-6 md:right-8 z-30 transition-opacity duration-300 opacity-90 hover:opacity-100" : "absolute top-8 right-10 sm:top-10 sm:right-12 md:top-12 md:right-16 z-30 transition-opacity duration-300 opacity-90 hover:opacity-100"}`}>
        <AssetImage
          src={eventConfig.assets.realizationLogo}
          alt="Logo AWS Cloud Clubs"
          className={`${isLinkedin ? "h-10 md:h-14 object-contain filter brightness-0 invert drop-shadow-md" : "h-20 sm:h-24 md:h-32 lg:h-40 object-contain filter brightness-0 invert drop-shadow-md"}`}
        />
      </div>

      <div className={`${isLinkedin ? "absolute inset-y-0 left-[31%] md:left-[39%] z-20 flex flex-col justify-center items-start max-w-[40%]" : "absolute bottom-6 left-10 sm:bottom-8 sm:left-12 md:bottom-10 md:left-16 z-20 flex flex-col items-start"}`}>
        <div className={`${isLinkedin ? "flex items-center gap-3 mb-4" : "flex items-center gap-3 mb-4 mt-2 sm:mt-3"}`}>
          <div className="h-[2px] w-8 bg-cyan-400"></div>
          <span className={`${isLinkedin ? "font-orbitron text-cyan-400 tracking-[0.2em] text-[9px] md:text-[10px] font-semibold uppercase" : "font-orbitron text-cyan-400 tracking-[0.2em] text-xs sm:text-sm font-semibold uppercase"}`}>
            {eventConfig.branding.communityLabel}
          </span>
        </div>

        <h1 className={`${isLinkedin ? "font-space text-xl md:text-3xl font-bold text-white leading-[1.05] tracking-tight whitespace-nowrap" : "font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight whitespace-nowrap"}`}>
          {eventConfig.branding.organizationName}
        </h1>
        <h2 className={`${isLinkedin ? "inline-block font-space text-xl md:text-3xl font-bold mt-1 uppercase tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 whitespace-nowrap pr-[0.2em]" : "inline-block font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-1 uppercase tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 whitespace-nowrap pr-[0.2em]"}`}>
          {`${eventConfig.branding.organizationUnit}\u00A0`}
        </h2>
        {!isLinkedin && eventHeadline ? (
          <p className="mt-3 max-w-[520px] md:max-w-[560px] font-space text-sm sm:text-base md:text-lg text-cyan-100/90 leading-snug">
            {eventHeadline}
          </p>
        ) : null}
      </div>

      <div className={`${isLinkedin ? "absolute bottom-4 right-6 md:right-8 z-30" : "absolute bottom-8 right-10 sm:bottom-10 sm:right-12 md:bottom-12 md:right-16 z-30"}`}>
        <AssetImage
          src={eventConfig.assets.primarySupportLogo}
          alt="Logo Univali"
          className={`${isLinkedin ? "h-8 md:h-10 object-contain filter brightness-0 invert drop-shadow-md" : "h-10 sm:h-14 md:h-16 lg:h-20 object-contain filter brightness-0 invert drop-shadow-md"}`}
        />
      </div>

      <div className={`${isLinkedin ? "absolute inset-y-0 right-[3%] md:right-[10%] w-[26%] md:w-[24%] flex items-center justify-center z-10 pointer-events-none" : "absolute inset-y-0 right-[6%] md:right-[12%] w-[72%] sm:w-[56%] md:w-[48%] flex items-center justify-center z-10 pointer-events-none"}`}>
        <AssetImage
          src={eventConfig.assets.balloon}
          alt="Balao Cloud Club"
          className={`${isLinkedin ? "w-full max-w-[220px] md:max-w-[280px] object-contain drop-shadow-2xl" : "w-full max-w-[300px] md:max-w-[550px] object-contain drop-shadow-2xl"}`}
        />
      </div>
    </div>
  );
}
