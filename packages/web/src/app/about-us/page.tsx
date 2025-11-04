"use client";
import React from "react";
import ThreeD from "./ThreeD";

interface Props {
  // define your props here
}

const AboutUs: React.FC<Props> = ({}) => {
  return (
    <div className="h-[90vh] w-full bg-mblue">
      <ThreeD />
    </div>
  );
};

export default AboutUs;
