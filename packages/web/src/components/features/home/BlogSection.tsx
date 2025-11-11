import React from "react";
import HeadTitle from "./HeadTitle";
import SmartButton from "@/components/ui/SmartButton";
import { IBlogBackgroundSetting } from "common-types";

const BlogSection: React.FC<{ settings: IBlogBackgroundSetting | null }> = ({ settings }) => {
  const backgroundImage = settings?.image || "/images/blog_img.jpg";

  return (
    <section
      className="w-full relative h-[80vh] mt-10 mb-6 bg-mblue md:p-[100px]"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundPosition: "center",
        backgroundBlendMode: "soft-light",
      }}
    >
      <div className="md:hidden -translate-y-4">
        <HeadTitle
          title="مجلۀ مهر باران"
          subTitle="فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف است"
        />
        <div className="text-left text-xs w-9/10 mx-auto">
          <SmartButton href="/" variant="morange" asLink={true}>
            اطلاعات بیش‌تر
          </SmartButton>
        </div>
      </div>

      <div className="hidden md:block border border-white h-full relative p-7">
        <h1 className="text-2xl font-bold text-white absolute -top-4.5 right-10 bg-mblue py-0.5 px-2">
          مجلۀ مهر باران
        </h1>
        <h2 className="text-white text-justify">
          فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های
          داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اس
        </h2>
        <div className="text-left text-xs">
          <SmartButton href="/" variant="morange" asLink={true}>
            اطلاعات بیش‌تر
          </SmartButton>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
