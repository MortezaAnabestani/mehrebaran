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

// --- کامپوننت‌های کمکی (M3 Styled) ---

// هدر بخش با استایل Material Design 3
// دکمه‌ها به صورت Pill (rounded-full) و با افکت State Layer طراحی شده‌اند
const SectionHeader = ({ title, subtitle, link }: { title: string; subtitle?: string; link: string }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
    <div className="space-y-3">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1a1c1e] tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-[#444746] text-base font-medium max-w-lg leading-relaxed">{subtitle}</p>
      )}
    </div>

    <Link
      href={link}
      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#007acc]/10 text-[#007acc] hover:bg-[#007acc] hover:text-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden font-bold text-sm tracking-wide"
    >
      <span className="relative z-10">مشاهده همه</span>
      <svg
        className="w-5 h-5 relative z-10 transform group-hover:translate-x-[-4px] transition-transform duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </Link>
  </div>
);

export default async function Blog() {
  // دریافت داده‌ها
  const [blogBgSettings, videosResponse, articlesResponse, galleriesResponse] = await Promise.all([
    getSetting("blogBackground") as Promise<IBlogBackgroundSetting | null>,
    getVideos({ status: "published", limit: 6, sort: "-createdAt" }),
    getArticles({ status: "published", limit: 6, sort: "-createdAt" }),
    getGalleries({ status: "published", limit: 6, sort: "-createdAt" }),
  ]);

  const backgroundImage = blogBgSettings?.image || "/images/blog_img.jpg";

  // Data Mappers
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

  return (
    <main className="bg-[#fdfcff] min-h-screen">
      {/* --- Hero Section (M3 Large Container) --- */}
      {/* استفاده از گوشه‌های گرد بزرگ در پایین (rounded-b-[3rem]) برای ایجاد حس کانتینر فیزیکی */}
      <section className="relative w-full h-[65vh] min-h-[550px] rounded-b-[3rem] overflow-hidden shadow-lg z-10 bg-[#1a1c1e]">
        {/* Background Image with Parallax feel */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-ken-burns opacity-90"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />

        {/* Gradient Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001e3c]/90 via-[#001e3c]/40 to-transparent" />

        {/* Brand Overlay Tint */}
        <div className="absolute inset-0 bg-[#007acc]/20 mix-blend-overlay" />

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c2e7ff]/20 backdrop-blur-md border border-[#c2e7ff]/30 text-[#d3e3fd] text-sm font-bold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#007acc] animate-pulse" />
            پایگاه اطلاع‌رسانی
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-md leading-tight">
            مجلۀ <span className="text-[#7fcfff]">مهر باران</span>
          </h1>

          <p className="text-lg md:text-xl text-[#e1e2e6] font-normal max-w-2xl mx-auto leading-relaxed">
            انعکاس فعالیت‌های داوطلبانه و رویدادهای فرهنگی سازمان دانشجویان جهاد دانشگاهی
          </p>
        </div>
      </section>

      {/* --- Section 1: Articles (Surface) --- */}
      <section className="py-24 bg-[#fdfcff]">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <SectionHeader
            title="آخرین مقالات"
            subtitle="جدیدترین نوشته‌ها و تحلیل‌های دانشجویی"
            link="/blog/articles"
          />
          <div className="animate-fade-in-up">
            <HeroShared_views
              cardItems={articleCards.length > 0 ? articleCards : cardItems}
              horizontal={true}
              page="blog/articles"
            />
          </div>
        </div>
      </section>

      {/* --- Section 2: Videos (Surface Variant) --- */}
      {/* استفاده از رنگ Surface Variant (#eff4f9) برای ایجاد تمایز بخش‌ها بدون خطوط تیز */}
      <section className="py-24 bg-[#eff4f9] rounded-[3rem] mx-2 md:mx-6">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <SectionHeader
            title="ویدئوهای منتخب"
            subtitle="گزارش‌های ویدئویی و مستندات تصویری"
            link="/blog/videos"
          />
          <div className="animate-fade-in-up delay-100">
            <HeroShared_views
              cardItems={videoCards.length > 0 ? videoCards : cardItems}
              horizontal={true}
              page="blog/videos"
            />
          </div>
        </div>
      </section>

      {/* --- Section 3: Galleries (Surface) --- */}
      <section className="py-24 bg-[#fdfcff] pb-32">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <SectionHeader
            title="گزارش‌های تصویری"
            subtitle="روایت رویدادها از دریچه دوربین"
            link="/blog/gallery"
          />
          <div className="animate-fade-in-up delay-200">
            <HeroShared_views
              cardItems={galleryCards.length > 0 ? galleryCards : cardItems}
              horizontal={true}
              page="blog/gallery"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
