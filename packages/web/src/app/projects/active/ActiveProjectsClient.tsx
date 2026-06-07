import { IProject } from "common-types";
import Link from "next/link";
import HelpRequestForm from "@/components/shared/HelpRequestForm";
import OptimizedImage from "@/components/ui/OptimizedImage";
import ProgressBars from "@/components/features/home/runningProjects/ProgressBars";
import SmartSwiper from "@/components/ui/swiper/SmartSwiper";

interface Props {
  initialProjects: IProject[];
  totalPages: number;
  currentPage: number;
  selectedCategory?: string;
}

const categories = [
  {
    id: "health",
    name: "بهداشت و سلامت",
    subtitle: "پروژه‌های مرتبط با سلامت و بهداشت",
    icon: "/icons/health.svg",
    link: "health",
  },
  {
    id: "education",
    name: "آموزش",
    subtitle: "پروژه‌های آموزشی و فرهنگی",
    icon: "/icons/education1.svg",
    link: "education",
  },
  {
    id: "housing",
    name: "مسکن",
    subtitle: "پروژه‌های مسکن و سرپناه",
    icon: "/icons/housing.svg",
    link: "housing",
  },
  {
    id: "food",
    name: "غذا",
    subtitle: "پروژه‌های تأمین غذا و تغذیه",
    icon: "/icons/food.svg",
    link: "food",
  },
  {
    id: "clothing",
    name: "پوشاک",
    subtitle: "پروژه‌های پوشاک و لباس",
    icon: "/icons/clothing.svg",
    link: "clothing",
  },
  {
    id: "other",
    name: "سایر",
    subtitle: "سایر پروژه‌های خیریه",
    icon: "/icons/other.svg",
    link: "other",
  },
];

export default function ActiveProjectsClient({ initialProjects }: Props) {
  // گروه‌بندی پروژه‌ها بر اساس دسته‌بندی
  const groupedProjects = (() => {
    const grouped: { [key: string]: IProject[] } = {};

    categories.forEach((cat) => {
      grouped[cat.id] = [];
    });

    initialProjects.forEach((project) => {
      const categorySlug =
        typeof project.category === "object" && project.category?.slug ? project.category.slug : "other";

      if (grouped[categorySlug]) {
        grouped[categorySlug].push(project);
      } else {
        grouped["other"].push(project);
      }
    });

    return grouped;
  })();

  return (
    <div>
      {/* Header */}
      <header className="relative w-full py-16 md:py-24 bg-gradient-to-br from-slate-50 to-[#007acc]/5 overflow-hidden border-b border-[#007acc]/10">
        <div
          className="absolute left-0 inset-0 bg-no-repeat opacity-30 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: "url('/images/patternMain.webp')",
            backgroundSize: "800px",
            backgroundPosition: "left center",
          }}
        ></div>
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#007acc]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00aaff]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-11/12 md:w-10/12 xl:w-9/12 mx-auto gap-8 md:gap-16">
          <div className="flex-1 text-center md:text-right">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-full bg-white border border-[#007acc]/20 shadow-sm mb-6 max-w-max mx-auto md:mx-0">
               <span className="w-2.5 h-2.5 rounded-full bg-[#007acc] animate-pulse"></span>
               <span className="text-xs md:text-sm font-bold text-[#007acc]">در حال اجرا</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-6 text-slate-800 leading-tight">
              پروژه‌های <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#007acc] to-[#00aaff]">فعال</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-600 leading-relaxed max-w-2xl text-justify md:text-right font-medium">
              با کمک شما، می‌توانیم زندگی بهتری برای نیازمندان فراهم کنیم. در این صفحه می‌توانید پروژه‌های
              فعال را مشاهده کرده و با کمک‌های مالی یا داوطلبانه خود، در تحقق آن‌ها مشارکت کنید.
            </p>
          </div>
          <div className="hidden md:flex shrink-0 relative items-center justify-center p-8 bg-white rounded-full shadow-[0_20px_50px_-12px_rgba(0,122,204,0.25)] border border-slate-100">
            <div className="absolute inset-0 bg-[#007acc]/5 rounded-full animate-ping [animation-duration:3s]" />
            <OptimizedImage
              src="/icons/needsNetwork_blue.svg"
              alt="projects icon"
              width={140}
              height={140}
              priority="up"
              className="relative z-10 drop-shadow-md"
            />
          </div>
        </div>
      </header>

      <div className="w-11/12 md:w-10/12 xl:w-9/12 mx-auto my-12 md:my-20">
        {categories.map((category) => {
          const categoryProjects = groupedProjects[category.id] || [];

          if (categoryProjects.length === 0) return null;

          return (
            <div key={category.id} className="mb-16 md:mb-24 last:mb-0">
              {/* Category Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-10 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#007acc]/10 flex items-center justify-center p-3 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-[#007acc]/20 to-transparent"></div>
                       <OptimizedImage src={category.icon} alt={category.name} width={40} height={40} className="relative z-10" />
                   </div>
                   <div>
                     <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{category.name}</h2>
                     <p className="text-sm md:text-base text-slate-500 mt-1.5 font-medium">{category.subtitle}</p>
                   </div>
                </div>
                <div className="hidden md:flex items-center text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                  <span className="text-[#007acc] ml-1.5 text-lg">{categoryProjects.length}</span> پروژه فعال
                </div>
              </div>

              {/* Desktop view: Restored and beautifully enhanced original horizontal row style */}
              <div className="hidden md:flex flex-col gap-6">
                {categoryProjects.map((project) => (
                  <div key={project._id} className="group flex flex-row items-center justify-between p-5 rounded-xl bg-white border border-slate-100 hover:border-[#007acc]/20 shadow-sm hover:shadow-md transition-all duration-300 gap-6">
                    {/* Project Image - Standardized Dimensions with Cover fitting */}
                    <Link href={`/projects/active/${project.slug}`} className="relative w-[180px] h-[120px] rounded-xl overflow-hidden shrink-0 shadow-sm bg-slate-50 block">
                      <OptimizedImage
                        src={process.env.NEXT_PUBLIC_UPLOADS + project.featuredImage.desktop}
                        alt={project.title}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, 180px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Project Info Section */}
                    <div className="flex-1 flex flex-col justify-between self-stretch py-1 gap-2">
                      <div>
                        <Link href={`/projects/active/${project.slug}`} className="block">
                          <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-[#007acc] transition-colors mb-2 line-clamp-1 leading-snug">
                            {project.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed text-justify">
                          {project.excerpt || project.description}
                        </p>
                      </div>
                      {/* Progress Bar inside row */}
                      <div className="w-full mt-1">
                        <ProgressBars project={project} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile View: High quality Cards (With single card fallback or Swiper for multiple cards) */}
              <div className="md:hidden">
                {categoryProjects.length === 1 ? (
                  // Single project card
                  <div className="px-1">
                    <article className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative w-full">
                      <div className="w-full h-44 min-h-[176px] relative overflow-hidden bg-slate-50 shrink-0">
                        <Link href={`/projects/active/${categoryProjects[0].slug}`} className="block relative w-full h-full">
                          <OptimizedImage
                            src={process.env.NEXT_PUBLIC_UPLOADS + categoryProjects[0].featuredImage.desktop}
                            alt={categoryProjects[0].title}
                            fill={true}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        </Link>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <Link href={`/projects/active/${categoryProjects[0].slug}`} className="block mb-2">
                          <h3 className="text-base font-bold text-slate-800 line-clamp-1 leading-snug">{categoryProjects[0].title}</h3>
                        </Link>
                        <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-4 text-justify">
                          {categoryProjects[0].excerpt || categoryProjects[0].description}
                        </p>
                        <div className="mt-auto">
                          <ProgressBars project={categoryProjects[0]} />
                        </div>
                      </div>
                    </article>
                  </div>
                ) : (
                  // Multiple projects swiped with SmartSwiper
                  <div className="-mx-4 px-4 pb-4">
                    <SmartSwiper
                      items={categoryProjects.map((project) => (
                        <div className="px-1 pb-10" key={project._id}>
                          <article className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative w-full h-full">
                            <div className="w-full h-44 min-h-[176px] relative overflow-hidden bg-slate-50 shrink-0">
                              <Link href={`/projects/active/${project.slug}`} className="block relative w-full h-full">
                                <OptimizedImage
                                  src={process.env.NEXT_PUBLIC_UPLOADS + project.featuredImage.desktop}
                                  alt={project.title}
                                  fill={true}
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-cover"
                                />
                              </Link>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                              <Link href={`/projects/active/${project.slug}`} className="block mb-2">
                                <h3 className="text-base font-bold text-slate-800 line-clamp-1 leading-snug">{project.title}</h3>
                              </Link>
                              <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-4 text-justify">
                                {project.excerpt || project.description}
                              </p>
                              <div className="mt-auto">
                                <ProgressBars project={project} />
                              </div>
                            </div>
                          </article>
                        </div>
                      ))}
                      slidesPerView={1.15}
                      spaceBetween={12}
                      centeredSlides={true}
                      showPagination={true}
                      grabCursor={true}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Help Request Form */}
        <div className="mt-16">
          <HelpRequestForm />
        </div>
      </div>
    </div>
  );
}
