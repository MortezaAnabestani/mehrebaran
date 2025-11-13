import { IWhatWeDidStatistics } from "common-types";
import React from "react";
import HeadTitle from "./HeadTitle";

interface WhatWeDidType {
  title: string;
  href: string;
  numOfProject: number;
  color: string;
  icon: string;
  textColor: string;
}

const WhatWeDidSection: React.FC<{ statistics: IWhatWeDidStatistics | null }> = ({ statistics }) => {
  // استفاده از آمارهای واقعی یا مقادیر پیش‌فرض
  const stats = statistics || {
    totalProjects: 0,
    schoolsCovered: 0,
    budgetRaised: 0,
    partnerOrganizations: 0,
    volunteerHours: 0,
    activeVolunteers: 0,
  };

  const Items: WhatWeDidType[] = [
    {
      title: "تعداد پروژه‌ها",
      href: "/projects",
      numOfProject: stats.totalProjects,
      color: "mblue",
      icon: "/icons/chart.svg",
      textColor: "white",
    },
    {
      title: "مناطق و مدارس تحت پوشش طرح‌ها",
      href: "/projects",
      numOfProject: stats.schoolsCovered,
      color: "mgray",
      icon: "/icons/bookHome.svg",
      textColor: "black",
    },
    {
      title: "میزان بودجه جذب‌شده",
      href: "/projects",
      numOfProject: stats.budgetRaised,
      color: "mblue",
      icon: "/icons/assets.svg",
      textColor: "white",
    },
    {
      title: "مجموعه‌های همکار",
      href: "/projects",
      numOfProject: stats.partnerOrganizations,
      color: "mgray",
      icon: "/icons/puzzle.svg",
      textColor: "black",
    },
    {
      title: "مجموع ساعات داوطلبی",
      href: "/projects",
      numOfProject: stats.volunteerHours,
      color: "mblue",
      icon: "/icons/support.svg",
      textColor: "white",
    },
    {
      title: "تعداد داوطلبان فعال",
      href: "/projects",
      numOfProject: stats.activeVolunteers,
      color: "mgray",
      icon: "/icons/time.svg",
      textColor: "black",
    },
  ];

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
              <h2 className="text-2xl md:text-5xl font-extrabold">
                {item.numOfProject.toLocaleString("fa-IR")}
              </h2>
              <h2 className={`text-base md:text-lg text-center font-bold`}>{item.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeDidSection;
