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
