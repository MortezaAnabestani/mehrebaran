import HeadTitle from "@/components/features/home/HeadTitle";
import Comment from "@/components/shared/Comment";
import GallerySwiper from "@/components/ui/swiper/GallerySwiper";
import React from "react";

interface Props {
  // define your props here
}

const GalleryItem: React.FC<Props> = ({}) => {
  return (
    <div className="w-9/10 md:w-8/10 mx-auto my-10">
      <HeadTitle title="مجموعه عکس‌ها" />
      <h1 className="font-bold text-2xl my-5">تیتر</h1>
      <p className="text-base/loose text-justify">
        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها
        و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
        ودستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
      </p>
      <div className="relative bg-gray-100 my-10">
        <GallerySwiper
          images={[
            "/images/hero_img.jpg",
            "/images/1.png",
            "/images/2.png",
            "/images/blog_img.jpg",
            "/images/hero_img.jpg",
            "/images/1.png",
            "/images/2.png",
            "/images/blog_img.jpg",
          ]}
        />
      </div>
      <Comment />
    </div>
  );
};

export default GalleryItem;
