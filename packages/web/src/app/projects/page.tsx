import { getProjects } from "@/services/project.service";
import ProjectCard from "@/components/shared/ProjectCard";
import Pagination from "@/components/ui/Pagination";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === "string" ? Number(searchParams.limit) : 9;

  const allProjectsResponse = await getProjects({ status: "active" });
  const totalResults = allProjectsResponse.results;

  const { data: projects, results } = await getProjects({
    status: "active",
    page,
    limit,
    sort: "-createdAt",
  });

  const totalPages = Math.ceil(totalResults / limit);

  return (
    <div className="md:w-8/10 w-9/10 mx-auto py-12">
      <h1 className="text-2xl font-bold mb-8">طرح‌های در حال اجرا</h1>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-80">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">در حال حاضر هیچ طرح فعالی برای نمایش وجود ندارد.</p>
      )}

      <div className="mt-12 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
