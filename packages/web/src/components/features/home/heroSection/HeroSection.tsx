import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import { IHomePageHeroSetting } from "common-types";

export default function HeroSection({ settings }: { settings: IHomePageHeroSetting | null }) {
  const title = settings?.title || "کانون مسئولیت اجتماعی مهر باران";
  const subtitle = settings?.subtitle || "متن پیش‌فرض توضیحات...";
  const image = settings?.image.desktop || "/images/hero_img.jpg";

  return (
    <section className=" w-full min-h-screen">
      <div className="w-full relative h-[100vh]">
        <OptimizedImage src={image} alt={title} fill={true} className=" -translate-y-27" priority="up" />
        <div className="absolute w-8/10 md:w-4/10 top-35 right-1/10 md:right-5/10 bg-neutral-600/70 text-white text-justify p-4 rounded-2xl">
          <h1 className="text-center text-sm md:text-[25px] font-extrabold pb-3 border-b-2 border-white">
            {title}
          </h1>
          <p className=" text-[10px]/loose md:text-[16.5px]/loose font-bold my-4">{subtitle}</p>
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
}
