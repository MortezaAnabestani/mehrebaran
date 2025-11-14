import HeadTitle from "@/components/features/home/HeadTitle";
import HeroShared_views from "@/components/views/shared/HeroShared_views";
import { getNews } from "@/services/news.service";
import { CardType } from "@/types/types";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "اخبار | کانون مسئولیت اجتماعی مهر باران",
  description: "گزارش آخرین رویدادها و فعالیت‌های کانون مسئولیت اجتماعی مهر باران",
};

const News: React.FC = async () => {
  // Fetch all news (without status filter to see all available news)
  const allNewsResponse = await getNews({
    sort: "-createdAt",
  });

  console.log("📰 Total news in DB (all statuses):", allNewsResponse.results);
  console.log("📰 All news:", allNewsResponse.data.map(n => `${n.title} (${n.status})`));

  // Fetch published news only
  const newsResponse = await getNews({
    status: "published",
    sort: "-createdAt",
  });

  console.log("📰 Published news count:", newsResponse.results);
  console.log("📰 Published news:", newsResponse.data.map(n => n.title));

  // Convert INews to CardType format
  const newsCards: CardType[] = newsResponse.data.map((news) => ({
    img: news.featuredImage.desktop,
    title: news.title,
    description: news.excerpt,
    href: `/news/${news.slug}`,
  }));

  return (
    <div className="w-8/10 mx-auto my-10">
      <HeadTitle
        title="اخبار"
        subTitle="گزارش آخرین رویدادها و فعالیت‌های کانون مسئولیت اجتماعی مهر باران"
      />
      <HeroShared_views cardItems={newsCards} page="news" />

      {/* Blog/Magazine Promotion Section */}
      <div className="mt-16 mb-10">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-10 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">مجله مهرباران</h2>
          <p className="text-lg mb-6 opacity-90">
            مقالات، گزارش تصویری و ویدیوهای الهام‌بخش از فعالیت‌های خیریه
          </p>
          <a
            href="/blog"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            مشاهده مجله
          </a>
        </div>
      </div>
    </div>
  );
};

export default News;
