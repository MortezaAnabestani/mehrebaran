import React from "react";
import HeadTitle from "./HeadTitle";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";
import { CardType } from "@/types/types";
import Card from "@/components/shared/Card";

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

const NewsSection: React.FC = ({}) => {
  return (
    <section className="my-4">
      <HeadTitle title="اخبار" subTitle="گزارش آخرین رویدادها و فعالیت‌های کانون مسئولیت اجتماعی مهر باران" />
      <div className="w-9/10 md:w-11/12 mx-auto">
        <SmartSwiper
          items={cardItems.map((item, index) => (
            <div key={index} className="h-full flex">
              <Card cardItems={item} />
            </div>
          ))}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 8 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          showNavigation
          showPagination
        />
      </div>
    </section>
  );
};

export default NewsSection;
