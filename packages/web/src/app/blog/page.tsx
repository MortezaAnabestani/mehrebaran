import HeadTitle from "@/components/features/home/HeadTitle";
import HeroShared_views from "@/components/views/shared/HeroShared_views";
import { cardItems } from "@/fakeData/fakeData";
import { CardType } from "@/types/types";
import { getSetting } from "@/services/setting.service";
import { IBlogBackgroundSetting } from "common-types";
import React from "react";

export default async function Blog() {
  const blogBgSettings = await getSetting("blogBackground") as IBlogBackgroundSetting | null;
  const backgroundImage = blogBgSettings?.image || "/images/blog_img.jpg";

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
        <HeroShared_views cardItems={cardItems} horizontal={true} page="blog/videos" />
        <HeadTitle title="مجموعه عکس" />
        <HeroShared_views cardItems={cardItems} horizontal={true} page="blog/gallery" />
        <HeadTitle title="مقالات" />
        <HeroShared_views cardItems={cardItems} horizontal={true} page="blog/articles" />
      </div>
    </div>
  );
}
