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
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const limit = typeof params.limit === "string" ? Number(params.limit) : 12;

  const { articles, pagination } = await getArticles({
    status: "published",
    page,
    limit,
    sort: "-createdAt",
  });

  const totalPages = pagination.totalPages;

  return (
    <div className="w-9/10 md:w-8/10 mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">مقالات مجله مهرباران</h1>
      <p className="mb-12 text-lg text-gray-600">
        جدیدترین تحلیل‌ها، داستان‌ها و گزارش‌های کانون مهرباران را در اینجا بخوانید.
      </p>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {articles.map((article) => (
            <Card key={article._id} cardItem={article} page="articles" />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-16">در حال حاضر مقاله‌ای برای نمایش وجود ندارد.</p>
      )}

      <div className="mt-16 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
