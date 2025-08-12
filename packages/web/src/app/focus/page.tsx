import { AppleWatchDock } from "@/components/views/focus_co/AppleWatchDock";
import React from "react";

interface Props {
  // define your props here
}

const page: React.FC<Props> = ({}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start">
      <div className="border-l-4 border-mblue p-0 m-0">
        <AppleWatchDock />
      </div>
      <div className="p-5">
        <h1 className="text-2xl fint-extrabold">حوزه‌های فعالیت</h1>
        <p className="text-justify text-base/relaxed">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است،
          چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
          نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته
          حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان
          رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید
          داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل
          حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار
          گیرد.
        </p>
      </div>
    </div>
  );
};

export default page;
