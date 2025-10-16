import AreasOfActivitySection from "@/components/features/home/areasOfActivity/AreasOfActivitySection";
import BlogSection from "@/components/features/home/BlogSection";
import HeroSection from "@/components/features/home/heroSection/HeroSection";
import NewsSection from "@/components/features/home/NewsSection";
import RunningProjectsSection from "@/components/features/home/runningProjects/RunningProjectSection";
import WhatWeDidSection from "@/components/features/home/WhatWeDidSection";

import { getSetting } from "@/services/setting.service";
import { getProjects } from "@/services/project.service";
import { getNews } from "@/services/news.service";
import { IHomePageHeroSetting } from "common-types";

export default async function Home() {
  const [heroSettings, projectsResponse, newsResponse] = await Promise.all([
    getSetting("homePageHero") as Promise<IHomePageHeroSetting | null>,
    getProjects({ status: "active", limit: 3, sort: "-createdAt" }),
    getNews({ limit: 8, sort: "-createdAt" }),
  ]);

  return (
    <section>
      <HeroSection settings={heroSettings} />
      <main className="md:w-8/10 container mx-auto flex-grow">
        <WhatWeDidSection />

        <RunningProjectsSection projects={projectsResponse.data} />
        <NewsSection newsItems={newsResponse.data} />

        <BlogSection />
        <AreasOfActivitySection />
      </main>
    </section>
  );
}
