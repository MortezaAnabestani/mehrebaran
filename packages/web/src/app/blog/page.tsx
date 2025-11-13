import HeadTitle from "@/components/features/home/HeadTitle";
import HeroShared_views from "@/components/views/shared/HeroShared_views";
import { cardItems } from "@/fakeData/fakeData";
import { CardType } from "@/types/types";
import { getSetting } from "@/services/setting.service";
import { getVideos } from "@/services/video.service";
import { IBlogBackgroundSetting } from "common-types";
import React from "react";

export default async function Blog() {
  const [blogBgSettings, videosResponse] = await Promise.all([
    getSetting("blogBackground") as Promise<IBlogBackgroundSetting | null>,
    getVideos({ status: "published", limit: 6, sort: "-createdAt" }),
  ]);

  const backgroundImage = blogBgSettings?.image || "/images/blog_img.jpg";

  // تبدیل داده‌های ویدئو به فرمت CardType
  const videoCards: CardType[] = videosResponse.data.map((video) => ({
    img: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${video.coverImage?.desktop}` || "/images/default.jpg",
    title: video.title,
    description: video.description?.substring(0, 150) + "..." || "",
    href: `/blog/videos/${video.slug}`,
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
      <div className="w-9/10 md:w-8/10 mx-auto">
        <HeroShared_views cardItems={cardItems} />
        <HeadTitle title="ویدئوها" />
        <HeroShared_views cardItems={videoCards.length > 0 ? videoCards : cardItems} horizontal={true} page="blog/videos" />
        <HeadTitle title="مجموعه عکس" />
        <HeroShared_views cardItems={cardItems} horizontal={true} page="blog/gallery" />
        <HeadTitle title="مقالات" />
        <HeroShared_views cardItems={cardItems} horizontal={true} page="blog/articles" />
      </div>
    </div>
  );
}
