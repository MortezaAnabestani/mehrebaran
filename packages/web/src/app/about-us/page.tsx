"use client";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
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
