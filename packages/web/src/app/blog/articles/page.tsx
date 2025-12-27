// --- FILE: page.tsx ---
import { getArticles } from "@/services/article.service";
import Card from "@/components/shared/Card";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مقالات مجله مهرباران",
  description: "جدیدترین تحلیل‌ها، داستان‌ها و گزارش‌های کانون مهرباران",
};

type ArticlesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
