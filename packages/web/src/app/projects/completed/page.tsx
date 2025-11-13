import React from "react";
import { getSetting } from "@/services/setting.service";
import { getProjects } from "@/services/project.service";
import { ICompletedProjectsPageSetting, IProject } from "common-types";
import Link from "next/link";

const CompletedProjects = async () => {
  // دریافت تنظیمات صفحه و پروژه‌های برجسته
  const [pageSettings, projectsResponse] = await Promise.all([
    getSetting("completedProjectsPage") as Promise<ICompletedProjectsPageSetting | null>,
    getProjects({ status: "completed", limit: 100 }),
  ]);

  // فیلتر کردن پروژه‌هایی که isFeaturedInCompleted است
  const featuredProjects = projectsResponse.data.filter((p: IProject) => p.isFeaturedInCompleted);

  // استفاده از تنظیمات یا مقادیر پیش‌فرض
  const backgroundImage = pageSettings?.backgroundImage || "/images/blog_img.jpg";
  const title = pageSettings?.title || "باران تویی...";
  const description =
    pageSettings?.description ||
    `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.`;

  return (
    <div>
      <div
        className="w-full min-h-[80vh]"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="w-9/10 md:w-8/10 mx-auto py-10">
          <div className="py-5 px-10 rounded-3xl bg-black max-w-[600px]">
            <h1 className="py-2 px-3 bg-morange w-fit font-bold rounded-xs mb-3">{title}</h1>
            <p className="text-white text-base/loose">{description}</p>
          </div>
        </div>
      </div>

      {/* نمایش پروژه‌های برجسته تکمیل شده */}
      {featuredProjects.length > 0 && (
        <section className="w-9/10 md:w-8/10 mx-auto py-16">
          <h2 className="text-3xl font-bold text-center mb-10">پروژه‌های تکمیل شده</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project: IProject) => (
              <Link
                key={project._id}
                href={`/projects/${project.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={project.featuredImage?.desktop}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    تکمیل شده
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{project.title}</h3>
                  {project.subtitle && <p className="text-sm text-gray-600 mb-3 line-clamp-1">{project.subtitle}</p>}
                  {project.excerpt && <p className="text-sm text-gray-700 mb-4 line-clamp-3">{project.excerpt}</p>}

                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>بودجه جمع‌آوری شده:</span>
                      <span className="font-semibold text-green-600">
                        {project.amountRaised?.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>هدف بودجه:</span>
                      <span className="font-semibold">{project.targetAmount?.toLocaleString("fa-IR")} تومان</span>
                    </div>
                    {project.targetVolunteer > 0 && (
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>داوطلبان:</span>
                        <span className="font-semibold">
                          {project.collectedVolunteer} از {project.targetVolunteer}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (project.amountRaised / project.targetAmount) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-600">
                      {Math.round((project.amountRaised / project.targetAmount) * 100)}% تکمیل شده
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* پیام زمانی که هیچ پروژه برجسته‌ای وجود ندارد */}
      {featuredProjects.length === 0 && (
        <section className="w-9/10 md:w-8/10 mx-auto py-16 text-center">
          <p className="text-gray-600 mb-4">در حال حاضر پروژه تکمیل شده‌ای برای نمایش وجود ندارد.</p>
          <Link href="/projects" className="text-blue-600 hover:underline">
            مشاهده پروژه‌های فعال
          </Link>
        </section>
      )}
    </div>
  );
};

export default CompletedProjects;
