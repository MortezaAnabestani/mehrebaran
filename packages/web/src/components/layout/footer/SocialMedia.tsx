import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";
import React from "react";
import Sdjdm from "./Sdjdm";

interface Props {
  setWave: (wave: boolean) => void;
  sdjdm: boolean;
}

interface SocialMedia {
  src: string;
  alt: string;
  href: string;
}

const socialMediaItems: SocialMedia[] = [
  { src: "/icons/website.svg", alt: "وبسایت سازمان دانشجویان جهاد دانشگاهی", href: "/" },
  { src: "/icons/linkedin.svg", alt: "لوگو لینکدین مهر باران", href: "/" },
  { src: "/icons/telegram.svg", alt: "لوگو تلگرام مهر باران", href: "/" },
  { src: "/icons/email.svg", alt: "لوگو ایمیل مهر باران", href: "/" },
];

const SocialMedia: React.FC<Props> = ({ setWave, sdjdm = true }) => {
  return (
    <div className="flex flex-col gap-2">
      {sdjdm && <Sdjdm setWave={setWave} />}
      <div className="flex items-center justify-between mx-2">
        {socialMediaItems.map((item: SocialMedia) => (
          <Link href={item.href} key={item.src}>
            <OptimizedImage
              src={item.src}
              alt={item.alt}
              width={40}
              height={40}
              placeholder="blur"
              blurDataURL="/icons/blur-logo.svg"
              priority="down"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
