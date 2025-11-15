import { getVideos } from "@/services/video.service";
import Card from "@/components/shared/Card";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ویدیوهای مجله مهرباران",
  description: "تماشای جدیدترین ویدیوهای کانون مهرباران",
};

type VideosPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const limit = typeof params.limit === "string" ? Number(params.limit) : 12;

  const allVideosResponse = await getVideos({ status: "published" });
  const totalResults = allVideosResponse.results;

  const { data: videos } = await getVideos({
    status: "published",
    page,
    limit,
    sort: "-createdAt",
  });

  const totalPages = Math.ceil(totalResults / limit);

  return (
    <div className="w-9/10 md:w-8/10 mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">ویدیوهای مجله مهرباران</h1>
      <p className="mb-12 text-lg text-gray-600">
        تماشای جدیدترین ویدیوها، گزارش‌ها و فعالیت‌های کانون مهرباران
      </p>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map((video) => (
            <Card key={video._id} cardItem={video} page="videos" />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-16">در حال حاضر ویدیویی برای نمایش وجود ندارد.</p>
      )}

      <div className="mt-16 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
