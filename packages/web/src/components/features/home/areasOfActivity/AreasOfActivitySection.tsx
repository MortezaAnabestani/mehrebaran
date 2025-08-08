import React from "react";
import AreaItem from "./AreaItem";
import HeadTitle from "../HeadTitle";
import { AreasOfActivity } from "@/types/types";
import Line from "./Line";

const activities: AreasOfActivity[] = [
  {
    title: "شبکه نیازسنجی",
    icon: "/icons/needsNetwork.svg",
    description: "نان و پنیر و همدلی گرما ببافیم بازارچه خیریه",
    color: "mgray",
    position: "top",
  },
  {
    title: "محیط زیست",
    icon: "/icons/earthGlobe.svg",
    description: "پاکسازی طبیعت درخت‌کاری",
    color: "mblue",
    position: "bottom",
  },
  {
    title: "خیر مؤثر",
    icon: "/icons/welfare.svg",
    description: "نان و پنیر و همدلی گرما ببافیم بازارچه خیریه",
    color: "mgray",
    position: "top",
  },
  {
    title: "اردوهای جهادی",
    icon: "/icons/helping_hand.svg",
    description: "دست در دست به رنگ شادی باران تویی",
    color: "mblue",
    position: "bottom",
  },
  {
    title: "مسئولیت اجتماعی",
    icon: "/icons/helping.svg",
    description: "راستا آموزش کمپین سلامت اجتماعی",
    color: "mgray",
    position: "top",
  },
];
const AreasOfActivitySection: React.FC = ({}) => {
  return (
    <section>
      <HeadTitle
        title="حوزه‌های فعالیت"
        subTitle="فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی جهت فرهنگ‌سازی جامعه"
      />
      <div className="relative mb-10 flex flex-row-reverse items-center justify-between flex-wrap w-9/10 mx-auto md:w-full">
        {activities.map((activity, index) => {
          const next = activities[index + 1];
          const isCurrentTop = activity.position === "top";
          const isNextBottom = next?.position === "bottom";
          return (
            <div key={index} className="relative">
              <AreaItem
                title={activity.title}
                icon={activity.icon}
                description={activity.description}
                color={activity.color}
                position={activity.position}
              />
              <div className="hidden md:block">
                {next && <Line isCurrentTop={isCurrentTop} isNextBottom={isNextBottom} />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AreasOfActivitySection;
