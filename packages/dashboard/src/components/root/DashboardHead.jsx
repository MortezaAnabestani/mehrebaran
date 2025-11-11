import React from "react";
import MotionItem from "../motions/MotionItem";

const DashboardHead = () => {
  const sectionNames = [
    "دیگرنگاری",
    "نیست‌نگاری",
    "نورنگاری",
    "راه‌نگاری",
    "روزنگاری",
    "زیست‌نگاری",
    "ادبیات",
    "اداریات",
    "اجتماعیات",
    "فنیات",
    "معقولات و منقولات",
    "طبیعیات",
    "ذهنیات",
    "brandShortTitle",
  ];
  return (
    <div className="hidden lg:block border-b min-h-full border-gray-200 mt-10 mb-8">
      {sectionNames.map((name, i) => (
        <MotionItem key={i} name={name} />
      ))}
    </div>
  );
};

export default DashboardHead;
