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
  const imageClass = `${className} ${rounded ? "rounded-xl" : ""}`;

  return fill ? (
    <div className="relative w-full h-full">
      <Image
        src={src}
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
      src={src}
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
