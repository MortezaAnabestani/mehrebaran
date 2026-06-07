import React, { Suspense } from "react";
import { Metadata } from "next";

export const revalidate = 600;

import HeadTitle from "@/components/features/home/HeadTitle";
import HeroShared_views from "@/components/views/shared/HeroShared_views";
import { getNews } from "@/services/news.service";
import { mapNewsResponseToCards } from "@/utils/mappers/newsMapper";
import NewsEmptyState from "@/components/features/news/NewsEmptyState";
import MagazineCta from "@/components/features/news/MagazineCta";

const siteUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
const url = `${siteUrl}/news`;

export const metadata: Metadata = {
  title: "اخبار و رویدادها | مهر باران",
  description: "گزارش آخرین رویدادها، فعالیت‌های خیرخواهانه و اخبار کانون مسئولیت اجتماعی مهر باران.",
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "اخبار و رویدادها | کانون مهر باران",
    description: "تازه‌ترین اخبار و گزارش‌های تصویری کانون را دنبال کنید.",
    url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "اخبار و رویدادها | کانون مهر باران",
    description: "تازه‌ترین اخبار و گزارش‌های تصویری کانون را دنبال کنید.",
  },
};

const jsonLdCollectionPage = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "اخبار و رویدادها",
  description: "گزارش آخرین رویدادها، فعالیت‌های خیرخواهانه و اخبار کانون مسئولیت اجتماعی مهر باران.",
  url,
  inLanguage: "fa-IR",
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "خانه",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "اخبار",
      item: url,
    },
  ],
};

async function NewsListSection() {
  let newsCards: ReturnType<typeof mapNewsResponseToCards> = [];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollectionPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent -z-10" aria-hidden="true" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" aria-hidden="true" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl -z-10" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header Section */}
        <header className="mb-12 text-center lg:text-right">
          <HeadTitle
            title="اخبار و اطلاعیه‌ها"
            subTitle="گزارش آخرین رویدادها و فعالیت‌های کانون مسئولیت اجتماعی مهر باران"
          />
        </header>

        {/* Content Section with Suspense Fallback (optional improvement) */}
        <section>
          <Suspense fallback={<div className="text-center py-20" aria-live="polite" aria-busy="true">در حال بارگذاری اخبار...</div>}>
            <NewsListSection />
          </Suspense>
        </section>

        {/* Enhanced CTA Section */}
        <section>
          <MagazineCta />
        </section>
      </div>
    </main>
  );
};

export default NewsPage;
