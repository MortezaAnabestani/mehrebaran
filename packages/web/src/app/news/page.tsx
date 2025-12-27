import React, { Suspense } from "react";
import { Metadata } from "next";
import HeadTitle from "@/components/features/home/HeadTitle";
import HeroShared_views from "@/components/views/shared/HeroShared_views";
import { getNews } from "@/services/news.service";
import { mapNewsResponseToCards } from "@/utils/mappers/newsMapper";
import NewsEmptyState from "@/components/features/news/NewsEmptyState";
import MagazineCta from "@/components/features/news/MagazineCta";

export const metadata: Metadata = {
  title: "اخبار و رویدادها | کانون مسئولیت اجتماعی مهر باران",
  description: "گزارش آخرین رویدادها، فعالیت‌های خیرخواهانه و اخبار کانون مسئولیت اجتماعی مهر باران.",
  openGraph: {
    title: "اخبار و رویدادها | کانون مهر باران",
    description: "تازه‌ترین اخبار و گزارش‌های تصویری کانون را دنبال کنید.",
    type: "website",
  },
};

async function NewsListSection() {
  let newsCards: any[] = [];

  try {
    const newsResponse = await getNews({
      status: "published",
      sort: "-createdAt",
    });
    newsCards = mapNewsResponseToCards(newsResponse?.data);
  } catch (error) {
    console.error("Failed to fetch news:", error);
    // Consider passing error to a monitoring service here
  }

  if (newsCards.length === 0) {
    return <NewsEmptyState />;
  }

  return (
    <div className="animate-fade-in-up">
      <HeroShared_views cardItems={newsCards} page="news" />
    </div>
  );
}

const NewsPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent -z-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header Section */}
        <div className="mb-12 text-center lg:text-right">
          <HeadTitle
            title="اخبار و اطلاعیه‌ها"
            subTitle="گزارش آخرین رویدادها و فعالیت‌های کانون مسئولیت اجتماعی مهر باران"
          />
        </div>

        {/* Content Section with Suspense Fallback (optional improvement) */}
        <Suspense fallback={<div className="text-center py-20">در حال بارگذاری اخبار...</div>}>
          <NewsListSection />
        </Suspense>

        {/* Enhanced CTA Section */}
        <MagazineCta />
      </div>
    </main>
  );
};

export default NewsPage;
