import Comment from "@/components/shared/Comment";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";
import React from "react";

interface Props {
  // define your props here
}

const page: React.FC<Props> = ({}) => {
  return (
    <div className="w-9/10 md:w-8/10 mx-auto my-10">
      <div className="w-full flex justify-between items-start gap-4 mb-8">
        <span className="md:w-30 md:h-30 bg-mgray rounded-md block"></span>
        <div className="w-full flex flex-col justify-end items-start">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold">
            <span className="w-5 h-5 rounded-sm bg-morange block"></span>
            مسئولیت اجتماعی
          </h1>
          <h2 className="text-xl mb-3">با هم برای جامعه</h2>
          <p className="text-justify text-sm">
            فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های
            داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اس فعالیت‌های داوطلبانه
            و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های فعالیت‌های داوطلبانه
            و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های
          </p>
        </div>
        <OptimizedImage src={"/icons/helping_blue.svg"} alt={`helping icon`} width={50} height={50} />
      </div>

      <div>
        <p className="text-justify text-base/relaxed">
          فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های
          داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اس فعالیت‌های داوطلبانه و
          عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های فعالیت‌های داوطلبانه و
          عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های فعالیت‌های داوطلبانه و
          عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های فعالیت‌های داوطلبانه و
          عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های فعالیت‌های داوطلبانه و
          عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های فعالیت‌های داوطلبانه و
          عام‌المنفعه سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اسفعالیت‌های داوطلبانه و عام‌المنفعه
          سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اس فعالیت‌های داوطلبانه و داوطلبانه و عام‌المنفعه
          سازمان دانشجویان جهاد بخشی از فرهنگ‌سازی جامعه هدف اس فعالیت‌های داوطلبانه و
        </p>
        <div className="my-10 w-9/10 mx-auto">
          <SmartSwiper
            items={["/images/1.png", "/images/2.png", "/images/hero_img.jpg", "/images/blog_img.jpg"].map(
              (item, index) => (
                <div key={index} className="h-70 shadow-xs shadow-mgray rounded-md">
                  <OptimizedImage src={item} alt="carousel pic" fill rounded />
                </div>
              )
            )}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 8 },
              640: { slidesPerView: 2, spaceBetween: 12 },
              1024: { slidesPerView: 2, spaceBetween: 12 },
            }}
            showNavigation
            showPagination
            outsideBtn
          />
        </div>
        <Comment />
      </div>
    </div>
  );
};

export default page;
