import { WhatWeDidType } from "@/types/types";
import React from "react";
import HeadTitle from "./HeadTitle";

const Items: WhatWeDidType[] = [
  {
    title: "تعداد پروژه‌ها",
    href: "/",
    numOfProject: 100,
    color: "mblue",
    icon: "/icons/chart.svg",
    textColor: "white",
  },
  {
    title: "مناطق و مدارس تحت پوشش طرح‌ها",
    href: "/",
    numOfProject: 100,
    color: "mgray",
    icon: "/icons/bookHome.svg",
    textColor: "black",
  },
  {
    title: "میزان بودجه جذب‌شده",
    href: "/",
    numOfProject: 100,
    color: "mblue",
    icon: "/icons/assets.svg",
    textColor: "white",
  },
  {
    title: "مجموعه‌های همکار",
    href: "/",
    numOfProject: 100,
    color: "mgray",
    icon: "/icons/puzzle.svg",
    textColor: "black",
  },
  {
    title: "مجموع ساعات داوطلبی",
    href: "/",
    numOfProject: 100,
    color: "mblue",
    icon: "/icons/support.svg",
    textColor: "white",
  },
  {
    title: "تعداد داوطلبان فعال",
    href: "/",
    numOfProject: 100,
    color: "mgray",
    icon: "/icons/time.svg",
    textColor: "black",
  },
];

const WhatWeDidSection: React.FC = ({}) => {
  return (
    <section className="mb-10">
      <HeadTitle title="در کنار هم چه کردیم؟" />
      <div className="w-9/10 md:w-7/10 mx-auto flex justify-between items-center flex-wrap gap-4">
        {Items.map((item, index) => (
          <div
            key={index}
            className={`w-40 h-40 md:w-60 md:h-60 rounded-lg bg-${item.color} text-${item.textColor} relative p-4 md:p-8 hover:scale-95 duration-200`}
          >
            <div
              className="min-h-full mx-auto bg-contain bg-center bg-no-repeat flex flex-col justify-center items-center"
              style={{ backgroundImage: `url('${item.icon}')` }}
            >
              <h2 className="text-2xl md:text-5xl font-extrabold">{item.numOfProject}</h2>
              <h2 className={`text-base md:text-lg text-center font-bold`}>{item.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeDidSection;
