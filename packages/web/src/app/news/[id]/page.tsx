import { getNewsByIdOrSlug } from "@/services/news.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import HeadTitle from "@/components/features/home/HeadTitle";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  console.log("🔍 [Metadata] Raw id:", id);
  const decodedId = decodeURIComponent(id);
  console.log("🔍 [Metadata] Decoded id:", decodedId);
  const news = await getNewsByIdOrSlug(decodedId);

  if (!news) {
    return {
      title: "خبر یافت نشد",
    };
  }

  return {
    title: news.seo.metaTitle || news.title,
    description: news.seo.metaDescription || news.excerpt,
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const news = await getNewsByIdOrSlug(decodedId);

  if (!news) {
    notFound();
  }

  // Combine featured image with gallery for swiper
  const allImages = [news.featuredImage, ...(news.gallery || [])];

  // Format date
  const publishDate = new Date(news.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Image Gallery */}
      {allImages.length > 0 && (
        <div className="w-full">
          <SmartSwiper
            items={allImages.map((image, index) => (
              <div key={index} className="h-100 w-full">
                <OptimizedImage
                  src={image.desktop}
                  alt={news.title}
                  fill={true}
                  priority={index === 0 ? "up" : "down"}
                />
              </div>
            ))}
            showPagination={allImages.length > 1}
            showNavigation={allImages.length > 1}
            outsideBtn={false}
          />
        </div>
      )}

      {/* Content */}
      <div className="w-9/10 md:w-8/10 mx-auto my-10">
        <HeadTitle title={news.title} />

        {/* Subtitle */}
        {news.subtitle && (
          <h2 className="font-bold text-xl text-gray-600 py-3">{news.subtitle}</h2>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-200 pb-4">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
            {publishDate}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            {news.views.toLocaleString("fa-IR")} بازدید
          </span>
        </div>

        {/* Excerpt */}
        {news.excerpt && (
          <div className="bg-gray-50 border-r-4 border-mblue p-4 mb-6 rounded">
            <p className="text-base text-gray-700">{news.excerpt}</p>
          </div>
        )}

        {/* Main Content */}
        <div
          className="text-base/loose text-justify prose max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3">برچسب‌ها:</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-mblue hover:text-white transition-colors cursor-pointer"
                >
                  {typeof tag === "string" ? tag : tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
