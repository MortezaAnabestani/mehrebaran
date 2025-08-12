import HeadTitle from "@/components/features/home/HeadTitle";
import Comment from "@/components/shared/Comment";
import OptimizedImage from "@/components/ui/OptimizedImage";
import React from "react";

interface Props {
  // define your props here
}

const Video: React.FC<Props> = ({}) => {
  return (
    <div className="w-9/10 md:w-8/10 mx-auto my-10">
      <HeadTitle title="ویدئوها" />
      <h1 className="font-bold text-2xl my-5">تیتر</h1>
      <div className="relative h-60 md:h-120 border border-mgray shadow-xs shadow-mgray">
        <OptimizedImage src="/images/hero_img.jpg" alt="ax" fill />
        <OptimizedImage
          src="/icons/play.svg"
          alt="play icon"
          width={90}
          height={90}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:opacity-80 duration-200 transition-all"
        />
      </div>
      <h1 className="font-bold text-lg my-5">منبع: منبع</h1>
      <p className="text-base/loose text-justify">
        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها
        و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و
        کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و
        آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه
        ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که
        تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی
        دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.لورم
        ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و
        متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و
        کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و
        آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه
        ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که
        تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی
        دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
      </p>
      <Comment />
    </div>
  );
};

export default Video;
