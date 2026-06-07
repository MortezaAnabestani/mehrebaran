import { getProjects } from "@/services/project.service";
import ProjectCard from "@/components/shared/ProjectCard";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "پروژه‌ها | کانون مهرباران",
  description: "مشاهده همه پروژه‌های خیریه کانون مهرباران - پروژه‌های در حال اجرا و پایان‌یافته",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "پروژه‌ها | کانون مهرباران",
    description: "مشاهده همه پروژه‌های خیریه کانون مهرباران - پروژه‌های در حال اجرا و پایان‌یافته",
    url: "/projects",
    siteName: "کانون مهرباران",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "پروژه‌ها | کانون مهرباران",
    description: "مشاهده همه پروژه‌های خیریه کانون مهرباران - پروژه‌های در حال اجرا و پایان‌یافته",
  },
};

export const revalidate = 3600; // 1 hour

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const limit = typeof params.limit === "string" ? Number(params.limit) : 12;

  const response = await getProjects({
    page,
    limit,
    sort: "-createdAt",
  });
  const projects = response.data;
  const totalResults = response.results;

  const totalPages = Math.ceil(totalResults / limit);

  // Separate projects by status for display
  const activeProjects = projects.filter((p) => p.status === "active");
  const completedProjects = projects.filter((p) => p.status === "completed");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "پروژه‌ها | کانون مهرباران",
    description: "مشاهده همه پروژه‌های خیریه کانون مهرباران - پروژه‌های در حال اجرا و پایان‌یافته",
    url: "https://mehrbaran.com/projects",
    inLanguage: "fa-IR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="md:w-8/10 w-9/10 mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4 text-center">پروژه‌های خیریه کانون مهرباران</h1>
        <p className="text-center text-gray-600 mb-12">
          مشاهده پروژه‌های در حال اجرا و پایان‌یافته کانون مسئولیت اجتماعی مهرباران
        </p>

      {projects.length > 0 ? (
        <>
          {/* Active Projects Section */}
          {activeProjects.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-mblue">پروژه‌های در حال اجرا</h2>
                <Link href="/projects/active" className="text-mblue hover:underline text-sm">
                  مشاهده همه →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-150">
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
                <h2 className="text-2xl font-bold text-green-600">پروژه‌های پایان‌یافته</h2>
                <Link href="/projects/completed" className="text-green-600 hover:underline text-sm">
                  مشاهده همه →
                </Link>
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
    </>
  );
}
