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

// 1. Performance: فعال‌سازی ISR برای بازسازی صفحه هر یک ساعت
export const revalidate = 3600;

// 2. Logical Separation: جداسازی منطق دریافت داده برای تمیزی و تست‌پذیری
async function fetchHomePageData() {
  try {
    // استفاده از Promise.all برای موازی‌سازی درخواست‌ها
    const [heroSettings, blogBgSettings, whatWeDidStats, projectsResponse, newsResponse] = await Promise.all([
      // Defensive Programming: مدیریت خطا در سطح هر درخواست برای جلوگیری از کرش کل صفحه
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
      // استفاده از Fallback Values (آرایه خالی) برای جلوگیری از خطای دسترسی به property در null
      projects: projectsResponse?.data ?? [],
      news: newsResponse?.data ?? [],
    };
  } catch (error) {
    console.error("Home page data fetch error:", error);
    // بازگشت آبجکت امن در صورت خطای کلی
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

  return (
    <section>
      {/* Safe Navigation: ارسال داده‌های ایمن‌سازی شده به کامپوننت‌ها */}
      <HeroSection settings={heroSettings} />

      {/* Standardized CSS: استفاده از کلاس‌های استاندارد کانتینر بجای مقادیر دستی */}
      <main className="md:w-8/10 mx-auto grow px-4 xl:px-0">
        <WhatWeDidSection statistics={whatWeDidStats} />

        <RunningProjectsSection projects={projects} />
        <NewsSection newsItems={news} />

        <BlogSection settings={blogBgSettings} />
        <AreasOfActivitySection />
      </main>
    </section>
  );
}
