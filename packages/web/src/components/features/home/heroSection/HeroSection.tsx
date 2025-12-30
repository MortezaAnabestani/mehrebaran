import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";
import { IHomePageHeroSetting } from "common-types";

export default function HeroSection({ settings }: { settings: IHomePageHeroSetting | null }) {
  const title = settings?.title || "کانون مسئولیت اجتماعی مهر باران";
  const description = settings?.description || "متن پیش‌فرض توضیحات...";
  const image = settings?.image.desktop || "/images/hero_img.jpg";

  return (
    <section className="relative w-full h-[600px] md:h-screen md:min-h-[600px] overflow-hidden bg-neutral-900">
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
        className="relative z-10 md:w-7/10 mx-auto h-full flex flex-col justify-center px-6 md:px-12"
        dir="ltr"
      >
        {/* Glassmorphism Panel Container */}
        <div
          className="absolute bottom-4 mx-5 left-0 right-0
      md:static
          md:w-6/10 h-fit 
      text-center md:text-left 
      space-y-6 p-8 md:p-10 
      rounded-3xl 
      bg-white/10 
      backdrop-filter backdrop-blur-xl 
      border border-white/20 
      shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
      hover:bg-white/15 hover:shadow-[0_8px_32px_0_rgba(0,122,204,0.25)]
      transition-all duration-500 ease-in-out
    "
        >
          {/* Header with strong drop shadow for legibility */}
          <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-md tracking-wide">
            {title}
          </h1>

          {/* Subtitle with high contrast opacity */}
          <p className="text-base md:text-lg text-white/90 font-medium leading-relaxed text-justify drop-shadow-sm">
            {description}
          </p>

          {/* Action Button Area */}
          <div className="pt-4">
            <SmartButton
              variant="mblue" // Matches Brand #007acc
              className="
          px-8 py-3.5 
          text-sm md:text-base font-bold 
          rounded-2xl
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
    </section>
  );
}
