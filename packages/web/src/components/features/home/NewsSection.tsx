import React from "react";
import HeadTitle from "./HeadTitle";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";

const cardItems = [
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
              <div className="bg-white rounded-xl shadow-md border border-mgray/65 overflow-hidden flex flex-col h-full w-full">
                <div className="w-full relative h-40">
                  <OptimizedImage
                    src={item.img}
                    alt={item.title}
                    fill={true}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <div className="text-left">
                    <SmartButton
                      href={item.href}
                      variant="mblue"
                      asLink={true}
                      fullWidth={true}
                      className="h-8 max-w-30 text-xs p-2 rounded-xs text-center mt-3 my-6 md:my-0"
                    >
                      اطلاعات بیش‌تر
                    </SmartButton>
                  </div>
                </div>
              </div>
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
