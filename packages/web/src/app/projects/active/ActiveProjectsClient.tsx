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
    link: "health"
  },
  {
    id: "education",
    name: "آموزش",
    subtitle: "پروژه‌های آموزشی و فرهنگی",
    icon: "/icons/education.svg",
    link: "education"
  },
  {
    id: "housing",
    name: "مسکن",
    subtitle: "پروژه‌های مسکن و سرپناه",
    icon: "/icons/housing.svg",
    link: "housing"
  },
  {
    id: "food",
    name: "غذا",
    subtitle: "پروژه‌های تأمین غذا و تغذیه",
    icon: "/icons/food.svg",
    link: "food"
  },
  {
    id: "clothing",
    name: "پوشاک",
    subtitle: "پروژه‌های پوشاک و لباس",
    icon: "/icons/clothing.svg",
    link: "clothing"
  },
  {
    id: "other",
    name: "سایر",
    subtitle: "سایر پروژه‌های خیریه",
    icon: "/icons/other.svg",
    link: "other"
  },
];

export default function ActiveProjectsClient({
  initialProjects,
}: Props) {
  // گروه‌بندی پروژه‌ها بر اساس دسته‌بندی
  const groupedProjects = useMemo(() => {
    const grouped: { [key: string]: IProject[] } = {};

    categories.forEach((cat) => {
      grouped[cat.id] = [];
    });

    initialProjects.forEach((project) => {
      const categorySlug = typeof project.category === "object" && project.category?.slug
        ? project.category.slug
        : "other";

      if (grouped[categorySlug]) {
        grouped[categorySlug].push(project);
      } else {
        grouped["other"].push(project);
      }
    });

    return grouped;
  }, [initialProjects]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            پروژه‌های فعال
          </h1>
          <p className="text-center text-blue-100 max-w-3xl mx-auto">
            با کمک شما، می‌توانیم زندگی بهتری برای نیازمندان فراهم کنیم. در این صفحه می‌توانید پروژه‌های
            فعال را مشاهده کرده و با کمک‌های مالی یا داوطلبانه خود، در تحقق آن‌ها مشارکت کنید.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Projects by Category */}
        {categories.map((category) => {
          const categoryProjects = groupedProjects[category.id] || [];

          // فقط دسته‌بندی‌هایی که پروژه دارند نمایش داده شوند
          if (categoryProjects.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-3 my-10">
              <div className="w-full flex justify-between items-center">
                <div>
                  <h1 className="flex items-center gap-2 font-extrabold text-xl">
                    <span className="w-5 h-5 rounded-sm bg-orange-500 block"></span>
                    {category.name}
                  </h1>
                  <h2 className="text-gray-600 text-sm mt-1">{category.subtitle}</h2>
                </div>
                <OptimizedImage
                  src={category.icon}
                  alt={`icon ${category.name}`}
                  width={50}
                  height={50}
                />
              </div>

              {categoryProjects.map((project) => {
                const financialProgress = project.targetAmount > 0
                  ? Math.min((project.amountRaised / project.targetAmount) * 100, 100)
                  : 0;

                const volunteerProgress = project.targetVolunteer > 0
                  ? Math.min((project.collectedVolunteer / project.targetVolunteer) * 100, 100)
                  : 0;

                return (
                  <Link
                    key={project._id}
                    href={`/projects/active/${project.slug}`}
                  >
                    <div className="flex items-center justify-between border-b border-blue-500/40 md:border-b-0 py-4 gap-4 hover:bg-gray-100 transition-colors rounded-lg px-2">
                      {/* Project Image */}
                      <div className="hidden md:block w-30 h-30 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={project.featuredImage.desktop}
                          alt={project.title}
                          width={120}
                          height={120}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Project Info */}
                      <div className="flex-1">
                        <h2 className="text-xs md:text-base font-bold mb-1">{project.title}</h2>
                        <p className="text-xs/relaxed md:text-sm text-gray-600 line-clamp-2">
                          {project.excerpt || project.description}
                        </p>

                        {/* Progress Bars */}
                        <div className="mt-2 space-y-2">
                          {/* Financial Progress */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-16">مالی:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${financialProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-gray-700 w-12 text-left">
                              {Math.round(financialProgress)}%
                            </span>
                          </div>

                          {/* Volunteer Progress */}
                          {project.targetVolunteer > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-16">داوطلب:</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${volunteerProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-gray-700 w-12 text-left">
                                {Math.round(volunteerProgress)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="bg-gray-200 w-8 h-8 md:w-10 md:h-10 rounded-sm flex flex-col items-center justify-center">
                          <OptimizedImage
                            src="/icons/up.svg"
                            alt="likes icon"
                            width={20}
                            height={20}
                          />
                          <p className="font-bold text-xs md:text-sm">
                            {project.likes?.length || 0}
                          </p>
                        </div>
                        <div className="bg-gray-200 w-8 h-8 md:w-10 md:h-10 rounded-sm flex flex-col items-center justify-center">
                          <OptimizedImage
                            src="/icons/comment.svg"
                            alt="comments icon"
                            width={20}
                            height={20}
                          />
                          <p className="font-bold text-xs md:text-sm">
                            {project.comments?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })}

        {/* No Projects Message */}
        {initialProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">در حال حاضر پروژه فعالی وجود ندارد.</p>
          </div>
        )}

        {/* Help Request Form */}
        <div className="mt-16">
          <HelpRequestForm />
        </div>
      </div>
    </div>
  );
}
