import HeadTitle from "@/components/features/home/HeadTitle";
import HeroShared_views from "@/components/views/shared/HeroShared_views";
import { cardItems } from "@/fakeData/fakeData";
import React from "react";

const News: React.FC = ({}) => {
  return (
    <div className="w-8/10 mx-auto my-10">
      <HeadTitle title="اخبار" subTitle="گزارش آخرین رویدادها و فعالیت‌های کانون مسئولیت اجتماعی مهر باران" />
      <HeroShared_views cardItems={cardItems} page="news" />
      <HeadTitle title="اخبار بیش‌تر" />
      <HeroShared_views cardItems={cardItems} horizontal={true} page="news" />
    </div>
  );
};

export default News;
