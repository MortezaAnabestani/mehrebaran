import AreasOfActivitySection from "@/components/features/home/areasOfActivity/AreasOfActivitySection";
import BlogSection from "@/components/features/home/BlogSection";
import BackGroundImg from "@/components/features/home/heroSection/BackGroundImg";
import HeroSection from "@/components/features/home/heroSection/HeroSection";
import NewsSection from "@/components/features/home/NewsSection";
import RunningProjectsSection from "@/components/features/home/runningProjects/RunningProjectSection";
import WhatWeDidSection from "@/components/features/home/WhatWeDidSection";
import React from "react";

interface Props {
  // define your props here
}

const Home: React.FC<Props> = ({}) => {
  return (
    <section className="relative">
      <HeroSection />
      <main className="md:w-8/10 container mx-auto flex-grow">
        <WhatWeDidSection />
        <RunningProjectsSection />
        <NewsSection />
        <BlogSection />
        <AreasOfActivitySection />
      </main>
    </section>
  );
};

export default Home;
