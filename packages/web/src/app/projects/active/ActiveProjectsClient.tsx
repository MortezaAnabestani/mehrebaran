"use client";

import { IProject } from "common-types";
import { useMemo } from "react";
import Link from "next/link";
import HelpRequestForm from "@/components/shared/HelpRequestForm";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
  const groupedProjects = useMemo(() => {
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
  }, [initialProjects]);

  return (
    <div>
      {/* Header */}
      <header className="relative w-full py-15 bg-gray-50 overflow-hidden">
        <div
          className="absolute left-0 inset-0 bg-no-repeat bg-center pointer-events-none"
          style={{
            backgroundImage: "url('/images/patternMain.webp')",
            backgroundSize: "700px",
            opacity: 0.5,
            backgroundPosition: "left",
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-between w-9/10 md:w-8/10 mx-auto gap-10">
          <div>
            <h1 className="text-lg md:text-2xl font-extrabold mb-5">پروژه‌های فعال</h1>
            <p className="font-bold text-xs md:text-base/loose">
              با کمک شما، می‌توانیم زندگی بهتری برای نیازمندان فراهم کنیم. در این صفحه می‌توانید پروژه‌های
              فعال را مشاهده کرده و با کمک‌های مالی یا داوطلبانه خود، در تحقق آن‌ها مشارکت کنید.
            </p>
          </div>
          <OptimizedImage
            src="/icons/needsNetwork_blue.svg"
            alt="projects icon"
            width={110}
            height={110}
            className="hidden md:block"
          />
        </div>
      </header>

      <div className="w-9/10 md:w-8/10 mx-auto my-10">
        {categories.map((category) => {
          const categoryProjects = groupedProjects[category.id] || [];

          if (categoryProjects.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-3 my-10">
              <div className="w-full flex justify-between items-center">
                <div>
                  <h1 className="flex items-center gap-2 font-extrabold">
                    <span className="w-5 h-5 rounded-sm bg-orange-500 block"></span>
                    {category.name}
                  </h1>
                  <h2>{category.subtitle}</h2>
                </div>
                <OptimizedImage src={category.icon} alt={`icon ${category.name}`} width={50} height={50} />
              </div>

              {categoryProjects.map((project) => {
                const financialProgress =
                  project.targetAmount > 0
                    ? Math.min((project.amountRaised / project.targetAmount) * 100, 100)
                    : 0;

                const volunteerProgress =
                  project.targetVolunteer > 0
                    ? Math.min((project.collectedVolunteer / project.targetVolunteer) * 100, 100)
                    : 0;

                return (
                  <Link key={project._id} href={`/projects/active/${project.slug}`}>
                    <div className="flex items-center justify-between border-b border-blue-500/40 md:border-b-0">
                      <OptimizedImage
                        src={process.env.NEXT_PUBLIC_UPLOADS + project.featuredImage.desktop}
                        alt={`icon ${category.name}`}
                        width={150}
                        height={150}
                        rounded={true}
                      />

                      {/* Project Info */}
                      <div className="mx-4">
                        <h2 className="text-xs md:text-base font-bold">{project.title}</h2>
                        <p className="text-xs/relaxed md:text-base">
                          {project.excerpt || project.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="bg-gray-300 w-8 h-8 md:w-10 md:h-10 rounded-sm flex flex-col items-center justify-center">
                          <OptimizedImage
                            src="/icons/up.svg"
                            alt="likes icon"
                            width={18}
                            height={18}
                            className="mt-1"
                          />
                          <p className="font-bold text-xs md:text-base">{(project as any).likes?.length || 0}</p>
                        </div>
                        <div className="bg-gray-300 w-8 h-8 md:w-10 md:h-10 rounded-sm flex flex-col items-center justify-center">
                          <OptimizedImage
                            src="/icons/comment.svg"
                            alt="comments icon"
                            width={18}
                            height={18}
                            className="mt-1"
                          />
                          <p className="font-bold text-xs md:text-base">{(project as any).comments?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
