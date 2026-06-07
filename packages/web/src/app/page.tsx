import { Metadata } from "next";
import AreasOfActivitySection from "@/components/features/home/areasOfActivity/AreasOfActivitySection";
import BlogSection from "@/components/features/home/BlogSection";
import HeroSection from "@/components/features/home/heroSection/HeroSection";
import NewsSection from "@/components/features/home/NewsSection";
import RunningProjectsSection from "@/components/features/home/runningProjects/RunningProjectSection";
import WhatWeDidSection from "@/components/features/home/WhatWeDidSection";

import { getSetting } from "@/services/setting.service";
import { getProjects } from "@/services/project.service";
import { getNews } from "@/services/news.service";
import { IHomePageHeroSetting, IBlogBackgroundSetting, IWhatWeDidStatistics } from "common-types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "صفحه اصلی | سامانه یکپارچه فعالیت‌های داوطلبانه مهرباران",
  description: "به کانون مهرباران بپیوندید. ما با توسعه شبکه‌سازی، فعالیت‌های داوطلبانه و نیکوکاری، هدفی جز تاثیر مثبت اجتماعی در جامعه نداریم.",
  alternates: {
    canonical: "https://mehrbaran.com",
  },
  openGraph: {
    title: "سامانه یکپارچه فعالیت‌های داوطلبانه | کانون مهرباران",
    description: "به کانون مهرباران بپیوندید. ما با توسعه شبکه‌سازی، فعالیت‌های داوطلبانه و نیکوکاری، هدفی جز تاثیر مثبت اجتماعی در جامعه نداریم.",
    url: "https://mehrbaran.com",
    siteName: "کانون مهرباران",
    type: "website",
    images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سامانه یکپارچه فعالیت‌های داوطلبانه | کانون مهرباران",
    description: "به کانون مهرباران بپیوندید. ما با توسعه شبکه‌سازی، فعالیت‌های داوطلبانه و نیکوکاری، هدفی جز تاثیر مثبت اجتماعی در جامعه نداریم.",
    images: ["https://mehrbaran.com/images/default-og.jpg"],
  },
};

async function fetchHomePageData() {
  try {
    const [heroSettings, blogBgSettings, whatWeDidStats, projectsResponse, newsResponse] = await Promise.all([
      getSetting("homePageHero").catch(() => null) as Promise<IHomePageHeroSetting | null>,
      getSetting("blogBackground").catch(() => null) as Promise<IBlogBackgroundSetting | null>,
      getSetting("whatWeDidStatistics").catch(() => null) as Promise<IWhatWeDidStatistics | null>,
      getProjects({ status: "active", limit: 3, sort: "-createdAt" }).catch(() => null),
      getNews({ limit: 8, sort: "-createdAt" }).catch(() => null),
    ]);

    return {
      heroSettings,
      blogBgSettings,
      whatWeDidStats,
      projects: projectsResponse?.data ?? [],
      news: newsResponse?.data ?? [],
    };
  } catch (error) {
    console.error("Home page data fetch error:", error);
    return {
      heroSettings: null,
      blogBgSettings: null,
      whatWeDidStats: null,
      projects: [],
      news: [],
    };
  }
}

export default async function Home() {
  const { heroSettings, blogBgSettings, whatWeDidStats, projects, news } = await fetchHomePageData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "NGO"],
    "inLanguage": "fa-IR",
    "name": "کانون مهرباران",
    "url": "https://mehrbaran.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mehrbaran.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    "publisher": {
      "@type": "Organization",
      "name": "کانون مهرباران",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mehrbaran.com/icons/logo.svg"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">کانون مسئولیت اجتماعی مهرباران - فعالیت‌های داوطلبانه</h1>
      
      <HeroSection settings={heroSettings} />

      <main className="md:w-8/10 mx-auto flex w-full flex-col gap-y-16 px-4 pb-12 xl:px-0">
        <WhatWeDidSection statistics={whatWeDidStats} />
        <RunningProjectsSection projects={projects} />
        <NewsSection newsItems={news} />
        <BlogSection settings={blogBgSettings} />
        <AreasOfActivitySection />
      </main>
    </>
  );
}
