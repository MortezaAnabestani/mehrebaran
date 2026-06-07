import { getGalleries } from "@/services/gallery.service";
import Card from "@/components/shared/Card";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const revalidate = 3600;

type GalleriesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: GalleriesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const pageParam = page > 1 ? `?page=${page}` : "";

  return {
    title: "گالری تصاویر مجله مهرباران | کانون مهرباران",
    description: "مشاهده جدیدترین مجموعه تصاویر و گالری‌های کانون مهرباران",
    alternates: {
      canonical: `https://mehrbaran.com/blog/gallery${pageParam}`,
    },
    openGraph: {
      title: "گالری تصاویر مجله مهرباران | کانون مهرباران",
      description: "مشاهده جدیدترین مجموعه تصاویر و گالری‌های کانون مهرباران",
      url: `https://mehrbaran.com/blog/gallery${pageParam}`,
      type: "website",
      images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "گالری تصاویر مجله مهرباران | کانون مهرباران",
      description: "مشاهده جدیدترین مجموعه تصاویر و گالری‌های کانون مهرباران",
      images: ["https://mehrbaran.com/images/default-og.jpg"],
    },
  };
}

export default async function GalleriesPage({ searchParams }: GalleriesPageProps) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const limitParam = typeof params.limit === "string" ? Number(params.limit) : 12;
  const MAX_LIMIT = 50;
  const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, MAX_LIMIT) : 12;

  const { galleries, pagination } = await getGalleries({
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
            "name": "گالری تصاویر مجله مهرباران",
            "description": "مشاهده جدیدترین مجموعه تصاویر و گزارش‌های تصویری کانون مهرباران",
            "inLanguage": "fa-IR",
            "url": `https://mehrbaran.com/blog/gallery${page > 1 ? `?page=${page}` : ""}`,
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
    </main>
  );
}
