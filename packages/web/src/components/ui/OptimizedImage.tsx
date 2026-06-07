import Image from "next/image";
import type { FC, SyntheticEvent } from "react";

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
  onLoad?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
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
  onLoad,
}) => {
  // CRITICAL: Prevent empty string from reaching Next.js Image
  // Check for undefined, null, empty string, and whitespace-only strings
  const isValidSrc = src && typeof src === "string" && src.trim().length > 0;

  // If src is completely invalid, return a placeholder instead of trying to render Image
  if (!isValidSrc) {
    console.warn("OptimizedImage: Invalid src provided, rendering placeholder", {
      src,
      type: typeof src,
      alt,
    });

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

  // Ensure domain is prefixed if path starts with /uploads
  let safeSrc = src.trim() || "/images/default-avatar.png";
  if (safeSrc.startsWith("/uploads/")) {
    const uploadDomain = process.env.NEXT_PUBLIC_UPLOADS || "http://localhost:5001";
    safeSrc = `${uploadDomain}${safeSrc}`;
  }

  // Bypass ngrok browser warning by routing through our proxy
  if (safeSrc.includes("ngrok") || safeSrc.includes("ngrok-free")) {
    safeSrc = `/api/proxy-image?url=${encodeURIComponent(safeSrc)}`;
  }

  // Auto-detect if image needs to be unoptimized (SVG files, local icons or proxy routes)
  const shouldUnoptimize = unoptimized || safeSrc.endsWith(".svg") || safeSrc.startsWith("/icons/") || safeSrc.startsWith("/api/proxy-image");

  const imageClass = `${className} ${rounded ? "rounded-xl" : ""}`;
  return fill ? (
    <div className={`relative w-full h-full overflow-hidden ${imageClass}`}>
      <Image
        src={safeSrc}
        alt={alt}
        fill
        className="object-cover"
        priority={priority === "up" ? true : false}
        placeholder={placeholder}
        blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
        sizes={sizes}
        unoptimized={shouldUnoptimize}
        referrerPolicy="no-referrer"
        onLoad={onLoad}
      />
    </div>
  ) : (
    <Image
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      className={imageClass}
      priority={priority === "up"}
      placeholder={placeholder}
      blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
      sizes={sizes}
      unoptimized={shouldUnoptimize}
      referrerPolicy="no-referrer"
      onLoad={onLoad}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
};

export default OptimizedImage;
