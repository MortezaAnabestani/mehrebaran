import { IResponsiveImage } from "common-types";
import Image from "next/image";
import type { FC } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: "up" | "down";
  rounded?: boolean;
  className?: string;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  unoptimized?: boolean;
};

const OptimizedImage: FC<SmartImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = "up",
  rounded = false,
  className = "",
  sizes = "100vw",
  placeholder = "empty",
  blurDataURL,
  unoptimized = false,
}) => {
  // CRITICAL: Prevent empty string from reaching Next.js Image
  // Check for undefined, null, empty string, and whitespace-only strings
  const isValidSrc = src && typeof src === 'string' && src.trim().length > 0;

  // If src is completely invalid, return a placeholder instead of trying to render Image
  if (!isValidSrc) {
    console.warn('OptimizedImage: Invalid src provided, rendering placeholder', { src, type: typeof src, alt });

    const placeholderClass = `${className} ${rounded ? "rounded-xl" : ""} bg-gray-200 flex items-center justify-center`;

    return fill ? (
      <div className={`relative w-full h-full ${placeholderClass}`}>
        <span className="text-gray-400 text-xs">🖼️</span>
      </div>
    ) : (
      <div className={placeholderClass} style={{ width: width || 100, height: height || 100 }}>
        <span className="text-gray-400 text-xs">🖼️</span>
      </div>
    );
  }

  // Double-check one more time before passing to Image
  const safeSrc = src.trim() || "/images/default-avatar.png";

  // Auto-detect if image needs to be unoptimized (SVG files, local icons)
  const shouldUnoptimize = unoptimized || safeSrc.endsWith('.svg') || safeSrc.startsWith('/icons/');

  const imageClass = `${className} ${rounded ? "rounded-xl" : ""}`;
  return fill ? (
    <div className="relative w-full h-full">
      <Image
        src={safeSrc}
        alt={alt}
        fill
        className={`${imageClass} object-top-center object-cover`}
        priority={priority === "up" ? true : false}
        placeholder={placeholder}
        blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
        sizes={sizes}
        unoptimized={shouldUnoptimize}
      />
    </div>
  ) : (
    <Image
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${imageClass} object-cover`}
      priority={priority === "up"}
      placeholder={placeholder}
      blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
      sizes={sizes}
      unoptimized={shouldUnoptimize}
    />
  );
};

export default OptimizedImage;
