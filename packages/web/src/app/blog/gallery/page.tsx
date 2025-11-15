import { getGalleries } from "@/services/gallery.service";
import Card from "@/components/shared/Card";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "گالری تصاویر مجله مهرباران",
  description: "مشاهده جدیدترین مجموعه تصاویر و گالری‌های کانون مهرباران",
};

type GalleriesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GalleriesPage({ searchParams }: GalleriesPageProps) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const limit = typeof params.limit === "string" ? Number(params.limit) : 12;

  const allGalleriesResponse = await getGalleries({ status: "published" });
  const totalResults = allGalleriesResponse.results;

  const { data: galleries } = await getGalleries({
    status: "published",
    page,
    limit,
    sort: "-createdAt",
  });

  const totalPages = Math.ceil(totalResults / limit);

  return (
    <div className="w-9/10 md:w-8/10 mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">گالری تصاویر مجله مهرباران</h1>
      <p className="mb-12 text-lg text-gray-600">
        مشاهده جدیدترین مجموعه تصاویر و گزارش‌های تصویری کانون مهرباران
      </p>

      {galleries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {galleries.map((gallery) => (
            <Card key={gallery._id} cardItem={gallery} page="blog/gallery" />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-16">در حال حاضر گالری تصویری برای نمایش وجود ندارد.</p>
      )}

      <div className="mt-16 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
