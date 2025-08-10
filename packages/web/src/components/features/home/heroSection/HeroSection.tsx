import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import React from "react";

const HeroSection: React.FC = ({}) => {
  return (
    <section className=" w-full min-h-screen">
      <div className="w-full relative h-[100vh]">
        <OptimizedImage
          src="/images/hero_img.jpg"
          alt="عکس پس زمینه مهر باران است"
          fill={true}
          className=" -translate-y-27"
        />
        <div className="absolute w-8/10 md:w-4/10 top-35 right-1/10 md:right-5/10 bg-neutral-600/70 text-white text-justify p-4 rounded-2xl">
          <h1 className="text-center text-sm md:text-[25px] font-extrabold pb-3 border-b-2 border-white">
            کانون مسئولیت اجتماعی مهر باران
          </h1>
          <p className=" text-[10px]/loose md:text-[16.5px]/loose font-bold my-4">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است،
            چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی
            مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد
            گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای{" "}
          </p>
          <SmartButton
            variant="mblue"
            className="text-xs md:text-base"
            size="md"
            asLink={true}
            href={"/about-us"}
          >
            اطلاعات بیش‌تر...
          </SmartButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
