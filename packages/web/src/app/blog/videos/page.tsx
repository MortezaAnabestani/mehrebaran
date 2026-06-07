import { getVideos } from "@/services/video.service";
import Card from "@/components/shared/Card";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ searchParams }: VideosPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const pageParam = page > 1 ? `?page=${page}` : "";

  return {
    title: "ویدیوهای مجله مهرباران | کانون مهرباران",
    description: "تماشای جدیدترین ویدیوهای کانون مهرباران",
    alternates: {
      canonical: `https://mehrbaran.com/blog/videos${pageParam}`,
    },
    openGraph: {
      title: "ویدیوهای مجله مهرباران | کانون مهرباران",
      description: "تماشای جدیدترین ویدیوهای کانون مهرباران",
      url: `https://mehrbaran.com/blog/videos${pageParam}`,
      type: "website",
      images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ویدیوهای مجله مهرباران | کانون مهرباران",
      description: "تماشای جدیدترین ویدیوهای کانون مهرباران",
      images: ["https://mehrbaran.com/images/default-og.jpg"],
    },
  };
}

type VideosPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const limit = typeof params.limit === "string" ? Number(params.limit) : 12;

  const { videos, pagination } = await getVideos({
    status: "published",
    page,
    limit,
    sort: "-createdAt",
  });

  const totalPages = pagination.totalPages;

  return (
    <main className="w-9/10 md:w-8/10 mx-auto py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "ویدیوهای مجله مهرباران",
            "description": "تماشای جدیدترین ویدیوها، گزارش‌ها و فعالیت‌های کانون مهرباران",
            "inLanguage": "fa-IR",
            "url": `https://mehrbaran.com/blog/videos${page > 1 ? `?page=${page}` : ""}`,
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
      <h1 className="text-4xl font-bold mb-8">ویدیوهای مجله مهرباران</h1>
      <p className="mb-12 text-lg text-gray-600">
        تماشای جدیدترین ویدیوها، گزارش‌ها و فعالیت‌های کانون مهرباران
      </p>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map((video) => (
            <Card key={video._id} cardItem={video} page="blog/videos" />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-16">در حال حاضر ویدیویی برای نمایش وجود ندارد.</p>
      )}

      <div className="mt-16 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </main>
  );
}
