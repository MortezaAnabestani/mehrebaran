import HeadTitle from "@/components/features/home/HeadTitle";
import SmartButton from "@/components/ui/SmartButton";
import BlogSections_views from "@/components/views/blog_co/BlogSections_views";
import { CardType } from "@/types/types";
import React from "react";

const cardItems: CardType[] = [
  {
    img: "/images/1.png",
    title: "پاکسازی طبیعت",
    description:
      "بعضی نیازهای روزمره برنامه نویسی در همه زبان ها همیشه مورد نیاز هستند. مهم ترین اینها توابع و کتابخانه های کار با اعداد و زبان و تبدیل های مختلف اونهاست.",
    href: "/",
  },
  {
    img: "/images/2.png",
    title: "دست در دست",
    description:
      "بعضی نیازهای روزمره برنامه نویسی در همه زبان ها همیشه مورد نیاز هستند. مهم ترین اینها توابع و کتابخانه های کار با اعداد و زبان و تبدیل های مختلف اونهاست.",
    href: "/",
  },
  {
    img: "/images/hero_img.jpg",
    title: "راستۀ خیریه",
    description:
      "بعضی نیازهای روزمره برنامه نویسی در همه زبان ها همیشه مورد نیاز هستند. مهم ترین اینها توابع و کتابخانه های کار با اعداد و زبان و تبدیل های مختلف اونهاست.",
    href: "/",
  },
  {
    img: "/images/1.png",
    title: "راستا",
    description:
      "بعضی نیازهای روزمره برنامه نویسی در همه زبان ها همیشه مورد نیاز هستند. مهم ترین اینها توابع و کتابخانه های کار با اعداد و زبان و تبدیل های مختلف اونهاست.",
    href: "/",
  },
  {
    img: "/images/hero_img.jpg",
    title: "راستۀ خیریه",
    description:
      "بعضی نیازهای روزمره برنامه نویسی در همه زبان ها همیشه مورد نیاز هستند. مهم ترین اینها توابع و کتابخانه های کار با اعداد و زبان و تبدیل های مختلف اونهاست.",
    href: "/",
  },
];

const Blog: React.FC = ({}) => {
  return (
    <div>
      <div
        className="md:w-full relative h-[60vh] bg-mblue/70 bg-no-repeat bg-cover object-cover"
        style={{
          backgroundImage: "url('/images/blog_img.jpg')",
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
        <BlogSections_views cardItems={cardItems} />
        <HeadTitle title="ویدئوها" />
        <BlogSections_views cardItems={cardItems} horizontal={true} />
        <HeadTitle title="مجموعه عکس" />
        <BlogSections_views cardItems={cardItems} horizontal={true} />
        <HeadTitle title="مقالات" />
        <BlogSections_views cardItems={cardItems} horizontal={true} />
      </div>
    </div>
  );
};

export default Blog;
