import { getProjects } from "@/services/project.service";
import ProjectCard from "@/components/shared/ProjectCard";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پروژه‌ها | کانون مسئولیت اجتماعی مهر باران",
  description: "مشاهده همه پروژه‌های خیریه مهر باران - پروژه‌های در حال اجرا و تکمیل شده",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === "string" ? Number(searchParams.limit) : 12;

  // Get all projects (both active and completed)
  const allProjectsResponse = await getProjects({});
  const totalResults = allProjectsResponse.results;

  const { data: projects, results } = await getProjects({
    page,
    limit,
    sort: "-createdAt",
  });

  const totalPages = Math.ceil(totalResults / limit);

  // Separate projects by status for display
  const activeProjects = projects.filter((p) => p.status === "active");
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="md:w-8/10 w-9/10 mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4 text-center">پروژه‌های خیریه مهر باران</h1>
      <p className="text-center text-gray-600 mb-12">
        مشاهده پروژه‌های در حال اجرا و تکمیل شده کانون مسئولیت اجتماعی مهر باران
      </p>

      {projects.length > 0 ? (
        <>
          {/* Active Projects Section */}
          {activeProjects.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-mblue">پروژه‌های در حال اجرا</h2>
                <a href="/projects/active" className="text-mblue hover:underline text-sm">
                  مشاهده همه →
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-80">
                {activeProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} baseUrl="/projects/active" />
                ))}
              </div>
            </section>
          )}

          {/* Completed Projects Section */}
          {completedProjects.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-600">پروژه‌های تکمیل شده</h2>
                <a href="/projects/completed" className="text-green-600 hover:underline text-sm">
                  مشاهده همه →
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-80">
                {completedProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} baseUrl="/projects/completed" />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600">در حال حاضر هیچ پروژه‌ای برای نمایش وجود ندارد.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
