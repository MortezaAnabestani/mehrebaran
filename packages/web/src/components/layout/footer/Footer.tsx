"use client";

import React, { useState } from "react";
import SocialMedia from "./SocialMedia";
import Menu from "./Menu";
import Codabiat from "./Codabiat";
import License from "./License";
import Wave from "./Wave";

interface Props {
  // define your props here
}

const Footer: React.FC<Props> = ({}) => {
  const [wave, setWave] = useState<Boolean>(false);
  console.log(wave);
  return (
    <footer className={`bg-mblue w-full h-fit ${wave ? "pt-18" : "pt-7"} relative duration-700`}>
      {wave && <Wave />}
      <div className="md:w-8/10 container mx-auto flex flex-col gap-6 justify-between items-center text-white">
        <SocialMedia setWave={setWave} />
        <Menu />
        <License />
      </div>
      <Codabiat />
    </footer>
  );
};

export default Footer;
