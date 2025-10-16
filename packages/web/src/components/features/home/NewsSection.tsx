import React from "react";
import HeadTitle from "./HeadTitle";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";
import Card from "@/components/shared/Card";
import { INews } from "common-types";

export default function NewsSection({ newsItems }: { newsItems: INews[] }) {
  if (!newsItems || newsItems.length === 0) {
    return null;
  }
  return (
    <section className="my-4">
      <HeadTitle title="اخبار" subTitle="گزارش آخرین رویدادها و فعالیت‌های کانون" />
      <div className="w-9/10 md:w-11/12 mx-auto">
        <SmartSwiper
          items={newsItems.map((item) => (
            <div key={item._id} className="flex h-100">
              <Card cardItem={item} />
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
}
