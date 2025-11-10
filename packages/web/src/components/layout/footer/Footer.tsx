"use client";

import React, { useState } from "react";
import SocialMedia from "./SocialMedia";
import Menu from "./Menu";
import Codabiat from "./Codabiat";
import License from "./License";
import Wave from "./Wave";
import { usePathname } from "next/navigation";

interface Props {
  // define your props here
}

const Footer: React.FC<Props> = ({}) => {
  const pathname = usePathname();
  const isNetworkPage = pathname?.startsWith("/network");
  const [wave, setWave] = useState<Boolean>(false);

  const footerBg = isNetworkPage ? "bg-morange" : "bg-mblue";

  // Minimal footer for network pages - compact version with all components
  if (isNetworkPage) {
    return (
      <footer className="bg-white border-t border-gray-200 py-3">
        <div className="max-w-[1440px] mx-auto px-4">
          {/* Compact layout - all in one row on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            {/* Social Media - Compact */}
            <div className="scale-75 md:scale-90">
              <SocialMedia setWave={setWave} />
            </div>

            {/* Menu - Compact */}
            <div className="scale-75 md:scale-90">
              <Menu />
            </div>

            {/* License + Codabiat - Combined */}
            <div className="flex flex-col items-center gap-1 scale-75 md:scale-90">
              <License />
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
