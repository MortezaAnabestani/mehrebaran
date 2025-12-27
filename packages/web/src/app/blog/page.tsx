import Link from "next/link";
import HeadTitle from "@/components/features/home/HeadTitle";
import HeroShared_views from "@/components/views/shared/HeroShared_views";
import { cardItems } from "@/fakeData/fakeData";
import { CardType } from "@/types/types";
import { getSetting } from "@/services/setting.service";
import { getVideos } from "@/services/video.service";
import { getArticles } from "@/services/article.service";
import { getGalleries } from "@/services/gallery.service";
import { IBlogBackgroundSetting } from "common-types";

export default async function Blog() {
  // دریافت داده‌ها به صورت موازی برای پرفورمنس بهتر
  const [blogBgSettings, videosResponse, articlesResponse, galleriesResponse] = await Promise.all([
    getSetting("blogBackground") as Promise<IBlogBackgroundSetting | null>,
    getVideos({ status: "published", limit: 6, sort: "-createdAt" }),
    getArticles({ status: "published", limit: 6, sort: "-createdAt" }),
    getGalleries({ status: "published", limit: 6, sort: "-createdAt" }),
  ]);

  const backgroundImage = blogBgSettings?.image || "/images/blog_img.jpg";

  // توابع تبدیل داده (Data Mappers)
  const mapToCard = (item: any, type: "video" | "article" | "gallery"): CardType => {
    let img = "/images/default.jpg";
    let href = "";

    if (type === "video") {
      img = item.coverImage?.desktop || img;
      href = `/blog/videos/${item.slug}`;
    } else if (type === "article") {
      img = item.featuredImage?.desktop || img;
      href = `/blog/articles/${item.slug}`;
    } else if (type === "gallery") {
      img = item.images?.[0]?.desktop || img;
      href = `/blog/gallery/${item.slug}`;
    }

    return {
      img,
      title: item.title,
      description: (item.description || item.content)?.substring(0, 120) + "..." || "",
      href,
    };
  };

  const videoCards: CardType[] = videosResponse.videos.map((v) => mapToCard(v, "video"));
  const articleCards: CardType[] = articlesResponse.articles.map((a) => mapToCard(a, "article"));
  const galleryCards: CardType[] = galleriesResponse.galleries.map((g) => mapToCard(g, "gallery"));

  // کامپوننت داخلی برای هدر هر بخش جهت جلوگیری از تکرار کد
  const SectionHeader = ({ title, link }: { title: string; link: string }) => (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 border-b border-gray-100 pb-4">
      <HeadTitle title={title} />
      <Link
        href={link}
        className="group flex items-center gap-2 text-sm font-medium text-[#007acc] hover:bg-[#007acc]/5 px-4 py-2 rounded-full transition-all duration-300 mt-4 md:mt-0"
      >
        <span>مشاهده همه</span>
        {/* آیکون فلش برای حس تعاملی بهتر */}
        <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* --- Hero Section --- */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        {/* Background Image with Parallax feel */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        {/* Professional Gradient Overlay (Brand Color Integration) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#007acc]/40 to-[#007acc]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" /> {/* لایه تاریک اضافی برای خوانایی متن */}
        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight">
              مجلۀ مهر باران
            </h1>
            <p className="text-lg md:text-xl text-gray-100 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی
            </p>
          </div>
        </div>
      </div>

      {/* --- Main Content (Material Sheet Layout) --- */}
      <div className="relative z-5 w-11/12 max-w-7xl mx-auto -mt-20 bg-white rounded-t-3xl shadow-2xl px-6 py-12 md:px-12 md:py-16 space-y-20">
        {/* Articles Section */}
        <section>
          <SectionHeader title="آخرین مقالات" link="/blog/articles" />
          <div className="animate-fade-in">
            <HeroShared_views
              cardItems={articleCards.length > 0 ? articleCards : cardItems}
              horizontal={true}
              page="blog/articles"
            />
          </div>
        </section>

        {/* Gallery Section */}
        <section>
          <SectionHeader title="گزارش‌های تصویری" link="/blog/gallery" />
          <div className="animate-fade-in delay-100">
            <HeroShared_views
              cardItems={galleryCards.length > 0 ? galleryCards : cardItems}
              horizontal={true}
              page="blog/gallery"
            />
          </div>
        </section>

        {/* Videos Section */}
        <section>
          <SectionHeader title="ویدئوهای منتخب" link="/blog/videos" />
          <div className="animate-fade-in delay-200">
            <HeroShared_views
              cardItems={videoCards.length > 0 ? videoCards : cardItems}
              horizontal={true}
              page="blog/videos"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
