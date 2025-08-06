import Link from "next/link";
import React from "react";

interface Props {
  // define your props here
}

const HeroSection: React.FC<Props> = ({}) => {
  return (
    <section
      style={{ backgroundImage: "url('/images/hero_img.jpg')" }}
      className=" w-full min-h-screen bg-cover bg-top bg-no-repeat"
    >
      <div className="absolute w-[500px] h-[540px] left-[35vh] top-[20vh] bg-neutral-600/70 text-white text-justify p-4 rounded-md">
        <h1 className="text-center text-[25px] font-extrabold pb-3 border-b-2 border-white">
          کانون مسئولیت اجتماعی مهر باران
        </h1>
        <p className="text-[16.5px]/loose font-bold my-4">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است،
          چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
          نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته
          حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان
          رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید
          داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل
          حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار
          گیرد.
        </p>
        <Link
          href={"/about-us"}
          className="px-3 py-2 bg-mblue rounded-xs text-sm hover:bg-mblue/80 duration-150 transition-all"
        >
          اطلاعات بیش‌تر...
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
