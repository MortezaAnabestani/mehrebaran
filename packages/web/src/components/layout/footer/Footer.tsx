"use client";

import React, { useState } from "react";
import SocialMedia from "./SocialMedia";
import Menu from "./Menu";
import Codabiat from "./Codabiat";
import License from "./License";
import Wave from "./Wave";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { usePathname } from "next/navigation";

interface Props {
  // define your props here
}

const Footer: React.FC<Props> = ({}) => {
  const pathname = usePathname();
  const isNetworkPage = pathname?.startsWith("/network");
  const [wave, setWave] = useState<Boolean>(false);

  const footerBg = isNetworkPage ? "bg-morange" : "bg-mblue";

  // Minimal footer for network pages - Logo, License, and Codabiat only
  if (isNetworkPage) {
    return (
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Logo + License */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <OptimizedImage
                  src="/icons/logo.svg"
                  alt="مهر باران"
                  width={80}
                  height={32}
                />
              </div>
              {/* License */}
              <div className="text-center md:text-right">
                <License />
              </div>
            </div>

            {/* Right: Codabiat */}
            <div className="flex-shrink-0">
              <Codabiat />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`${footerBg} w-full h-fit ${wave ? "pt-18" : isNetworkPage ? "pt-3" : "pt-7"} relative duration-700`}>
      {wave && <Wave />}
      <div className={`md:w-8/10 container mx-auto flex flex-col ${isNetworkPage ? "gap-2" : "gap-6"} justify-between items-center text-white ${isNetworkPage ? "py-2" : ""}`}>
        <SocialMedia setWave={setWave} />
        {!isNetworkPage && <Menu />}
        <License />
      </div>
      {!isNetworkPage && <Codabiat />}
    </footer>
  );
};

export default Footer;
