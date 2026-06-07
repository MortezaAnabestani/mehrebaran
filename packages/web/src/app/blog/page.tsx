import Link from "next/link";
import { getSetting } from "@/services/setting.service";
import { getVideos } from "@/services/video.service";
import { getArticles } from "@/services/article.service";
import { getGalleries } from "@/services/gallery.service";
import { IBlogBackgroundSetting, IArticle, IVideo, IGallery } from "common-types";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { ArrowLeft, Play, Images, FileText, Calendar, LucideIcon } from "lucide-react";
import { Metadata } from "next";
import { ParallaxHero, FadeInUp } from "./BlogComponentsClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "مجله مهر باران | کانون مهرباران",
  description: "آخرین اخبار، گزارش‌ها و مقالات کانون مهر باران",
  alternates: {
    canonical: "https://mehrbaran.com/blog",
  },
  openGraph: {
    title: "مجله مهر باران | کانون مهرباران",
    description: "آخرین اخبار، گزارش‌ها و مقالات کانون مهر باران",
    url: "https://mehrbaran.com/blog",
    siteName: "کانون مهرباران",
    locale: "fa_IR",
    type: "website",
    images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "مجله مهر باران | کانون مهرباران",
    description: "آخرین اخبار، گزارش‌ها و مقالات کانون مهر باران",
    images: ["https://mehrbaran.com/images/default-og.jpg"],
  },
};

const SectionHeader = ({
  title,
  subtitle,
  link,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  link: string;
  icon?: LucideIcon;
}) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
    <div className="space-y-3">
      <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
        {Icon && <Icon className="w-8 h-8 text-[#007acc]" />}
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>

    <Link
      href={link}
      className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-100/80 text-[#007acc] hover:bg-[#007acc] hover:text-white transition-all duration-300 ease-out font-bold text-sm shadow-sm hover:shadow-md"
    >
      <span>مشاهده همه</span>
      <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
    </Link>
  </div>
);

export default async function Blog() {
  const [blogBgSettings, videosResponse, articlesResponse, galleriesResponse] = await Promise.all([
    getSetting("blogBackground") as Promise<IBlogBackgroundSetting | null>,
    getVideos({ status: "published", limit: 6, sort: "-createdAt" }),
    getArticles({ status: "published", limit: 6, sort: "-createdAt" }),
    getGalleries({ status: "published", limit: 6, sort: "-createdAt" }),
  ]);

  const backgroundImage = blogBgSettings?.image || "/images/blog_img.jpg";

  const articles = articlesResponse.articles || [];
  const videos = videosResponse.videos || [];
  const galleries = galleriesResponse.galleries || [];

  return (
    <main className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "مجله مهر باران",
            "description": "آخرین اخبار، گزارش‌ها و مقالات کانون مهر باران",
            "inLanguage": "fa-IR",
            "url": "https://mehrbaran.com/blog",
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
      {/* Sleek Minimal Hero Section with Parallax */}
      <ParallaxHero backgroundImage={backgroundImage} />

      {/* Articles Bento Grid */}
      <section className="py-10 md:py-10">
        <div className="w-11/12 md:w-10/12 xl:w-9/12 mx-auto">
          <FadeInUp>
            <SectionHeader
            title="جدیدترین نوشته‌ها"
            subtitle="آخرین مقالات، یادداشت‌ها و گزارش‌های تحلیلی تیم تحریریه"
            link="/blog/articles"
            icon={FileText}
          />
          </FadeInUp>

          <FadeInUp delay={0.1}>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Featured Main Article */}
              <div className="lg:col-span-6 group relative rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/60 aspect-[4/3] lg:aspect-auto lg:h-[520px]">
                <Link href={`/blog/articles/${articles[0].slug}`} className="absolute inset-0 z-20"></Link>
                <div className="absolute inset-0">
                    <OptimizedImage
                      src={articles[0].featuredImage?.desktop || "/images/default.jpg"}
                      alt={articles[0].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 w-full p-6 md:p-10 z-10 flex flex-col justify-end">
                  <div className="bg-[#007acc] text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full w-max mb-4">
                    ویژه
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 leading-snug line-clamp-3">
                    {articles[0].title}
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-6 max-w-xl leading-relaxed">
                    {articles[0].excerpt || articles[0].content?.substring(0, 150) + "..."}
                  </p>
                  <div className="flex items-center gap-3 text-slate-400 text-xs md:text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(articles[0].createdAt || Date.now()).toLocaleDateString("fa-IR")}</span>
                  </div>
                </div>
              </div>

              {/* Side Stack Articles */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {articles.slice(1, 4).map((article: IArticle) => (
                  <Link
                    key={article._id}
                    href={`/blog/articles/${article.slug}`}
                    className="group flex flex-row items-center gap-4 p-4 lg:p-0 lg:bg-transparent bg-white rounded-2xl lg:rounded-none border border-slate-200/60 lg:border-none shadow-sm lg:shadow-none flex-1"
                  >
                    <div className="relative w-28 h-28 lg:w-36 lg:h-36 shrink-0 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                        <OptimizedImage
                          src={article.featuredImage?.desktop || "/images/default.jpg"}
                          alt={article.title}
                          fill
                          sizes="(max-width: 1024px) 112px, 144px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                    </div>
                    <div className="flex flex-col justify-center flex-1 py-1">
                      <div className="text-[#007acc] text-[10px] font-bold mb-2">مقاله</div>
                      <h3 className="text-sm md:text-base font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#007acc] transition-colors mb-3">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mt-auto">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(article.createdAt || Date.now()).toLocaleDateString("fa-IR")}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-200 text-slate-500 font-medium">
              در حال حاضر مقاله‌ای منتشر نشده است.
            </div>
          )}
          </FadeInUp>
        </div>
      </section>

      {/* Videos Section (Dark Theme) */}
      <section className="py-20 md:py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
        {/* Glow effect for dark section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-[#007acc]/10 rounded-[100%] blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-11/12 md:w-10/12 xl:w-9/12 mx-auto">
          <FadeInUp>
          {/* Overriding SectionHeader colors explicitly for dark bg */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <Play className="w-8 h-8 text-[#007acc]" />
                گزارش‌های ویدیویی
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                مستندات تصویری و گزارش‌های اختصاصی از پروژه‌ها و رویدادهای کانون مهر باران
              </p>
            </div>
            <Link
              href="/blog/videos"
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-[#007acc] text-white transition-all duration-300 font-bold text-sm"
            >
              <span>آرشیو ویدیوها</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.slice(0, 3).map((video: IVideo) => (
                <Link key={video._id} href={`/blog/videos/${video.slug}`} className="group block">
                  <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-800 border border-slate-700/50 shadow-lg">
                      <OptimizedImage
                        src={video.coverImage?.desktop || "/images/default.jpg"}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                      />
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors duration-500" />

                    {/* Centered Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#007acc] transition-all duration-300 border border-white/30">
                        <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold font-mono">
                      مشاهده
                    </div>
                  </div>
                  <h3 className="text-white font-extrabold text-lg md:text-xl mt-6 mb-3 line-clamp-2 group-hover:text-[#007acc] transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(video.createdAt || Date.now()).toLocaleDateString("fa-IR")}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-800/50 rounded-3xl border border-slate-700 text-slate-400 font-medium">
              در حال حاضر ویدیویی منتشر نشده است.
            </div>
          )}
          </FadeInUp>
        </div>
      </section>

      {/* Image Galleries Masonry Grid */}
      <section className="py-20 md:py-24 mb-10">
        <div className="w-11/12 md:w-10/12 xl:w-9/12 mx-auto">
          <FadeInUp>
          <SectionHeader
            title="آلبوم تصاویر"
            subtitle="روایت رویدادها، مراسم‌ها و کارگاه‌ها از دریچه دوربین"
            link="/blog/gallery"
            icon={Images}
          />
          </FadeInUp>

          <FadeInUp delay={0.1}>
          {galleries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]">
              {galleries.slice(0, 4).map((gallery: IGallery, i: number) => {
                // Determine span sizes for masonry look
                const isLarge = i === 0 || i === 3;
                return (
                  <Link
                    href={`/blog/gallery/${gallery.slug}`}
                    key={gallery._id}
                    className={`group relative rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm block ${
                      isLarge ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
                    }`}
                  >
                    <div className="absolute inset-0">
                        <OptimizedImage
                          src={gallery.images?.[0]?.desktop || "/images/default.jpg"}
                          alt={gallery.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Glow Edge Effect */}
                    <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-[#007acc] rounded-3xl transition-colors duration-300 pointer-events-none" />

                    <div className="absolute bottom-0 w-full p-6 lg:p-8 flex flex-col justify-end z-10">
                      <h3
                        className={`font-black text-white mb-3 leading-snug line-clamp-2 ${
                          isLarge ? "text-2xl md:text-3xl" : "text-xl"
                        }`}
                      >
                        {gallery.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-200 text-xs font-bold px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full w-max">
                        <Images className="w-3.5 h-3.5" />
                        <span>{gallery.images?.length || 0} تصویر</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-200 text-slate-500 font-medium">
              در حال حاضر گالری تصویری منتشر نشده است.
            </div>
          )}
          </FadeInUp>
        </div>
      </section>
    </main>
  );
}

