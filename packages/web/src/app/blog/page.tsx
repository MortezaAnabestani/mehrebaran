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
  const [blogBgSettings, videosResponse, articlesResponse, galleriesResponse] = await Promise.all([
    getSetting("blogBackground") as Promise<IBlogBackgroundSetting | null>,
    getVideos({ status: "published", limit: 6, sort: "-createdAt" }),
    getArticles({ status: "published", limit: 6, sort: "-createdAt" }),
    getGalleries({ status: "published", limit: 6, sort: "-createdAt" }),
  ]);

  const backgroundImage = blogBgSettings?.image || "/images/blog_img.jpg";

  // تبدیل داده‌های ویدئو به فرمت CardType
  const videoCards: CardType[] = videosResponse.videos.map((video) => ({
    img: video.coverImage.desktop || "/images/default.jpg",
    title: video.title,
    description: video.description?.substring(0, 150) + "..." || "",
    href: `/blog/videos/${video.slug}`,
  }));

  // تبدیل داده‌های مقالات به فرمت CardType
  const articleCards: CardType[] = articlesResponse.articles.map((article) => ({
    img: article.featuredImage?.desktop || "/images/default.jpg",
    title: article.title,
    description: article.content?.substring(0, 150) + "..." || "",
    href: `/blog/articles/${article.slug}`,
  }));

  // تبدیل داده‌های گالری به فرمت CardType
  const galleryCards: CardType[] = galleriesResponse.galleries.map((gallery) => ({
    img: gallery.images[0]?.desktop || "/images/default.jpg",
    title: gallery.title,
    description: gallery.description?.substring(0, 150) + "..." || "",
    href: `/blog/gallery/${gallery.slug}`,
  }));

  return (
    <div>
      <div
        className="md:w-full relative h-[60vh] bg-mblue/70 bg-no-repeat bg-cover object-cover"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition: "center",
          backgroundBlendMode: "darken",
        }}
      >
        <div className="w-9/10 md:w-8/10 mx-auto text-white py-20 text-shadow-2xs text-shadow-black">
          <HeadTitle
            title="مجلۀ مهر باران"
            subTitle="فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاه خراسان رضوی بخشی از اقدامات است"
          />
        </div>
      </div>
      <div className="w-9/10 md:w-8/10 mx-auto my-10">
        <HeadTitle title="مقالات" />
        <HeroShared_views
          cardItems={articleCards.length > 0 ? articleCards : cardItems}
          horizontal={true}
          page="blog/articles"
        />
        <HeadTitle title="مجموعه عکس" />
        <HeroShared_views
          cardItems={galleryCards.length > 0 ? galleryCards : cardItems}
          horizontal={true}
          page="blog/gallery"
        />
        <HeadTitle title="ویدئوها" />
        <HeroShared_views
          cardItems={videoCards.length > 0 ? videoCards : cardItems}
          horizontal={true}
          page="blog/videos"
        />
      </div>
    </div>
  );
}
