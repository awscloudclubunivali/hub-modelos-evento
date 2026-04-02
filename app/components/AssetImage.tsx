/* eslint-disable @next/next/no-img-element */
import type { ImgHTMLAttributes } from "react";

type AssetImageProps = ImgHTMLAttributes<HTMLImageElement>;

export default function AssetImage({ alt, src, ...props }: AssetImageProps) {
  if (typeof src !== "string" || src.trim().length === 0) {
    return null;
  }

  return <img crossOrigin="anonymous" alt={alt ?? ""} src={src} {...props} />;
}
