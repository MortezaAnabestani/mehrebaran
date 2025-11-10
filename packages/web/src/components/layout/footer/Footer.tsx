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

  // Minimal footer for network pages
  if (isNetworkPage) {
    return (
      <footer className="bg-white border-t border-gray-200 py-3">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} مهر باران</span>
              <span className="hidden md:inline">•</span>
              <span>همه حقوق محفوظ است</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Developed by</span>
              <a
                href="https://codabiat.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-morange hover:text-orange-600 transition-colors"
              >
                Codabiat
              </a>
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
