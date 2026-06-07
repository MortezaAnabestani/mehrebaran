import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import { IHomePageHeroSetting } from "common-types";
import RainGlass from "./RainGlass";

export default function HeroSection({ settings }: { settings: IHomePageHeroSetting | null }) {
  const title = settings?.title || "کانون مسئولیت اجتماعی مهر باران";
  const description = settings?.description || "متن پیش‌فرض توضیحات...";
  const image = settings?.image.desktop || "/images/hero_img.jpg";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full h-[600px] md:h-screen md:min-h-[600px] overflow-hidden bg-neutral-900"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedImage
          src={image}
          alt={title}
          fill={true}
          className="object-cover object-center"
          priority="up"
        />
        <div className="absolute inset-0 bg-black/40 sm:bg-transparent sm:bg-linear-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent" />
      </div>

      {/* Content Container */}
      <div
        className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 sm:px-6 lg:px-12"
        dir="rtl"
      >
        {/* Wrapper بیرونی - موقعیت‌دهی سمت چپ */}
        <div className="w-full mt-10 md:mt-0 sm:w-11/12 md:w-8/12 lg:w-[55%] xl:w-[45%] mr-auto">
          {/* این div قطرات و باکس رو روی هم نگه میداره */}
          <div className="relative">
            {/* canvas پشت باکس شیشه‌ای */}
            <RainGlass className="rounded-2xl sm:rounded-3xl xl:rounded-[2rem]" />

            {/* باکس شیشه‌ای روی canvas */}
            <div
              className="relative z-10
                h-fit rounded-2xl sm:rounded-3xl xl:rounded-[2rem]
                text-right space-y-3 sm:space-y-5 md:space-y-6 
                p-5 sm:p-8 lg:p-12
                bg-black/15
                backdrop-filter backdrop-blur-md
                border border-white/20
                shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
                hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(0,122,204,0.25)]
                transition-all duration-500 ease-in-out
              "
            >
              <h1
                id="hero-title"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight drop-shadow-lg tracking-normal"
              >
                {title}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-white/90 font-medium leading-relaxed sm:leading-loose drop-shadow-md">
                {description}
              </p>

              <div className="pt-2 sm:pt-4">
                <SmartButton
                  variant="mblue"
                  className="
                    w-full sm:w-auto
                    justify-center
                    px-6 py-3 sm:px-8 sm:py-3.5
                    text-sm md:text-base font-bold
                    shadow-lg hover:shadow-[#007acc]/50
                    border border-white/10
                    backdrop-blur-md
                    transition-all duration-300 transform hover:-translate-y-1
                  "
                  size="lg"
                  asLink={true}
                  href={"/about-us"}
                >
                  اطلاعات بیش‌تر
                </SmartButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
