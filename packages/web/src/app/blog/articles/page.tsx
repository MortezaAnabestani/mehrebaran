// --- FILE: page.tsx ---
import { getArticles } from "@/services/article.service";
import Card from "@/components/shared/Card";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const revalidate = 3600;

type ArticlesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: ArticlesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const pageParam = page > 1 ? `?page=${page}` : "";

  return {
    title: "مقالات مجله مهرباران | کانون مهرباران",
    description: "جدیدترین تحلیل‌ها، داستان‌ها و گزارش‌های کانون مهرباران",
    alternates: {
      canonical: `https://mehrbaran.com/blog/articles${pageParam}`,
    },
    openGraph: {
      title: "مقالات مجله مهرباران | کانون مهرباران",
      description: "جدیدترین تحلیل‌ها، داستان‌ها و گزارش‌های کانون مهرباران",
      url: `https://mehrbaran.com/blog/articles${pageParam}`,
      type: "website",
      images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "مقالات مجله مهرباران | کانون مهرباران",
      description: "جدیدترین تحلیل‌ها، داستان‌ها و گزارش‌های کانون مهرباران",
      images: ["https://mehrbaran.com/images/default-og.jpg"],
    },
  };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;

  const pageParam = Number(params.page);
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const limitParam = Number(params.limit);
  const MAX_LIMIT = 50;
  const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, MAX_LIMIT) : 12;
  
  const { articles, pagination } = await getArticles({
    status: "published",
    page,
    limit,
    sort: "-createdAt",
  });

  return (
    <main className="w-9/10 md:w-8/10 mx-auto py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "مقالات مجله مهرباران",
            "description": "جدیدترین تحلیل‌ها، داستان‌ها و گزارش‌های کانون مهرباران",
            "inLanguage": "fa-IR",
            "url": `https://mehrbaran.com/blog/articles${page > 1 ? `?page=${page}` : ""}`,
            "publisher": {
              "@type": "Organization",
              "name": "کانون مهرباران",
              "logo": {
                "@type": "ImageObject",
                "url": "https://mehrbaran.com/icons/logo.svg"
              }
            }
          })
        }}
      />
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-8">مقالات مجله مهرباران</h1>
        <p className="text-lg text-gray-600">
          جدیدترین تحلیل‌ها، داستان‌ها و گزارش‌های کانون مهرباران را در اینجا بخوانید.
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {articles.map((article) => (
            <Card key={article._id} cardItem={article} page="blog/articles" />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-16" role="status">
          در حال حاضر مقاله‌ای برای نمایش وجود ندارد.
        </p>
      )}

      <div className="mt-16 flex justify-center">
        <Pagination currentPage={page} totalPages={pagination.totalPages} />
      </div>
    </main>
  );
}
