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
  // Fetch published news from API
  const newsResponse = await getNews({
    status: "published",
    sort: "-createdAt",
    limit: 20
  });

  // Convert INews to CardType format
  const newsCards: CardType[] = newsResponse.data.map((news) => ({
    img: news.featuredImage.desktop,
    title: news.title,
    description: news.excerpt,
    href: `/news/${news.slug}`,
  }));

  // Split into two sections: featured (first 6) and more (remaining)
  const featuredNews = newsCards.slice(0, 6);
  const moreNews = newsCards.slice(6);

  return (
    <div className="w-8/10 mx-auto my-10">
      <HeadTitle
        title="اخبار"
        subTitle="گزارش آخرین رویدادها و فعالیت‌های کانون مسئولیت اجتماعی مهر باران"
      />
      <HeroShared_views cardItems={featuredNews} page="news" />

      {moreNews.length > 0 && (
        <>
          <HeadTitle title="اخبار بیش‌تر" />
          <HeroShared_views cardItems={moreNews} horizontal={true} page="news" />
        </>
      )}
    </div>
  );
};

export default News;
