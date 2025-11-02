import { getGalleries } from "@/services/gallery.service";
import Card from "@/components/shared/Card";
import Pagination from "@/components/ui/Pagination";

type GalleriesPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function GalleriesPage({ searchParams }: GalleriesPageProps) {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === "string" ? Number(searchParams.limit) : 12;

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
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">مقالات مجله مهرباران</h1>
      <p className="mb-12 text-lg text-gray-600">
        جدیدترین تحلیل‌ها، داستان‌ها و گزارش‌های ما را در اینجا بخوانید.
      </p>

      {galleries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {galleries.map((gallery) => (
            <Card key={gallery._id} page="galleries" />
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
