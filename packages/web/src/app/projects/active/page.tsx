import { getProjects } from "@/services/project.service";
import ProjectCard from "@/components/shared/ProjectCard";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پروژه‌های در حال اجرا | کانون مسئولیت اجتماعی مهر باران",
  description: "مشاهده و حمایت از پروژه‌های خیریه در حال اجرای کانون مهر باران",
};

export default async function ActiveProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === "string" ? Number(searchParams.limit) : 9;

  // Get total count for pagination
  const allProjectsResponse = await getProjects({ status: "active" });
  const totalResults = allProjectsResponse.results;

  // Get paginated projects
  const { data: projects } = await getProjects({
    status: "active",
    page,
    limit,
    sort: "-createdAt",
  });

  const totalPages = Math.ceil(totalResults / limit);

  return (
    <div className="md:w-8/10 w-9/10 mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-mblue">پروژه‌های در حال اجرا</h1>
        <p className="text-gray-600">
          با حمایت از این پروژه‌ها، می‌توانید در ایجاد تغییرات مثبت در جامعه مشارکت کنید.
        </p>
      </div>

      {projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-80">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} baseUrl="/projects/active" />
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
          <p className="text-gray-600 mb-4">در حال حاضر هیچ پروژه فعالی برای نمایش وجود ندارد.</p>
          <a href="/projects/completed" className="text-green-600 hover:underline">
            مشاهده پروژه‌های تکمیل شده →
          </a>
        </div>
      )}
    </div>
  );
}
