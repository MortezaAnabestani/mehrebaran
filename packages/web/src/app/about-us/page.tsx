"use client";
import AboutSection from "@/components/features/about-us/AboutSection";
import AboutUs_ActivitiesSection from "@/components/features/about-us/AboutUs_ActivitiesSection";
import AboutUs_ContactSection from "@/components/features/about-us/AboutUs_ContactSection";
import AboutUs_HeroSection from "@/components/features/about-us/AboutUs_HeroSection";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";
import React from "react";

const AboutUs: React.FC = () => {
  const { isPlaying, togglePlay } = useBackgroundAudio("/sounds/rain.mp3");

  return (
    <div className="bg-white">
      <AboutUs_HeroSection isPlaying={isPlaying} onToggleAudio={togglePlay} />
      <AboutSection />
      <AboutUs_ActivitiesSection />
      <AboutUs_ContactSection />
    </div>
  );
};

export default AboutUs;
