import { getProjects } from "@/services/project.service";
import ProjectCard from "@/components/shared/ProjectCard";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پروژه‌های تکمیل شده | کانون مسئولیت اجتماعی مهر باران",
  description: "مشاهده پروژه‌های خیریه تکمیل شده کانون مهر باران",
};

export default async function CompletedProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === "string" ? Number(searchParams.limit) : 9;

  // Get total count for pagination
  const allProjectsResponse = await getProjects({ status: "completed" });
  const totalResults = allProjectsResponse.results;

  // Get paginated projects
  const { data: projects } = await getProjects({
    status: "completed",
    page,
    limit,
    sort: "-createdAt",
  });

  const totalPages = Math.ceil(totalResults / limit);

  return (
    <div className="md:w-8/10 w-9/10 mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-green-600">پروژه‌های تکمیل شده</h1>
        <p className="text-gray-600">
          مشاهده پروژه‌های خیریه‌ای که با موفقیت به اتمام رسیده‌اند و تاثیرات مثبتی در جامعه گذاشته‌اند.
        </p>
      </div>

      {projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-80">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} baseUrl="/projects/completed" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">در حال حاضر هیچ پروژه تکمیل شده‌ای برای نمایش وجود ندارد.</p>
          <a href="/projects/active" className="text-mblue hover:underline">
            مشاهده پروژه‌های در حال اجرا →
          </a>
        </div>
      )}
    </div>
  );
}
