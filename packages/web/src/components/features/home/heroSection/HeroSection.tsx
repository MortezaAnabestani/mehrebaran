import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import { IHomePageHeroSetting } from "common-types";

export default function HeroSection({ settings }: { settings: IHomePageHeroSetting | null }) {
  const title = settings?.title || "کانون مسئولیت اجتماعی مهر باران";
  const subtitle = settings?.description || "متن پیش‌فرض توضیحات...";
  const image = settings?.image.desktop || "/images/hero_img.jpg";

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-neutral-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedImage
          src={image}
          alt={title}
          fill={true}
          className="object-cover object-center"
          priority="up"
        />
        {/* Minimalist Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-linear-to-l from-black/30 via-black/60 to-black/80" />
      </div>

      {/* Content Container */}
      <div
        className="relative z-10 md:w-6/10 mx-auto h-full flex flex-col justify-center px-6 md:px-12 "
        dir="ltr"
      >
        <div className="md:w-7/10 h-fit text-center md:text-left space-y-2 p-4 md:p-6 rounded-xl bg-blue-100/30 bg-clip-padding backdrop-filter backdrop-blur-sm border-4 border-blue-400/20">
          <h1 className="text-2xl font-extrabold text-white leading-tight drop-shadow-sm">{title}</h1>

          <p className="text-sm md:text-lg text-gray-200 font-medium leading-loose opacity-90 text-justify">
            {subtitle}
          </p>

          <div>
            <SmartButton
              variant="mblue" // Assumed to match #007acc based on branding
              className="px-6 py-3 text-xs md:text-sm shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300"
              size="lg"
              asLink={true}
              href={"/about-us"}
            >
              اطلاعات بیش‌تر
            </SmartButton>
          </div>
        </div>
      </div>
    </section>
  );
}
