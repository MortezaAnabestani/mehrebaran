import React from "react";
import HeadTitle from "./HeadTitle";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";
import Card from "@/components/shared/Card";
import { cardItems } from "@/fakeData/fakeData";

const NewsSection: React.FC = ({}) => {
  return (
    <section className="my-4">
      <HeadTitle title="اخبار" subTitle="گزارش آخرین رویدادها و فعالیت‌های کانون مسئولیت اجتماعی مهر باران" />
      <div className="w-9/10 md:w-11/12 mx-auto">
        <SmartSwiper
          items={cardItems.map((item, index) => (
            <div key={index} className="flex h-100">
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
