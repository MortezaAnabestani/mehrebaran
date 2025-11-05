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
}) => {
  // Comprehensive validation to prevent empty string errors
  // Check for undefined, null, empty string, and whitespace-only strings
  const isValidSrc = src && typeof src === 'string' && src.trim().length > 0;

  // Debug log for troubleshooting
  if (!isValidSrc) {
    console.warn('OptimizedImage received invalid src:', { src, type: typeof src });
  }

  // Always ensure we have a valid src - use fallback if needed
  const validSrc = isValidSrc ? src : "/images/default-avatar.png";

  const imageClass = `${className} ${rounded ? "rounded-xl" : ""}`;
  return fill ? (
    <div className="relative w-full h-full">
      <Image
        src={validSrc}
        alt={alt}
        fill
        className={`${imageClass} object-top-center object-cover`}
        priority={priority === "up" ? true : false}
        placeholder={placeholder}
        blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
        sizes={sizes}
      />
    </div>
  ) : (
    <Image
      src={validSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${imageClass} object-cover`}
      priority={priority === "up"}
      placeholder={placeholder}
      blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
      sizes={sizes}
    />
  );
};

export default OptimizedImage;
