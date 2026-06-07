import { getProjects } from "@/services/project.service";
import ProjectCard from "@/components/shared/ProjectCard";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "پروژه‌های پایان‌یافته | کانون مهرباران",
  description: "مشاهده پروژه‌های خیریه پایان‌یافته کانون مهرباران",
  alternates: {
    canonical: "/projects/completed",
  },
  openGraph: {
    title: "پروژه‌های پایان‌یافته | کانون مهرباران",
    description: "مشاهده پروژه‌های خیریه پایان‌یافته کانون مهرباران",
    url: "/projects/completed",
    siteName: "کانون مهرباران",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "پروژه‌های پایان‌یافته | کانون مهرباران",
    description: "مشاهده پروژه‌های خیریه پایان‌یافته کانون مهرباران",
  },
};

export default async function CompletedProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const limit = typeof params.limit === "string" ? Number(params.limit) : 9;

  const response = await getProjects({
    status: "completed",
    page,
    limit,
    sort: "-createdAt",
  });
  const projects = response.data;
  const totalResults = response.results;

  const totalPages = Math.ceil(totalResults / limit);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "پروژه‌های پایان‌یافته | کانون مهرباران",
    description: "مشاهده پروژه‌های خیریه پایان‌یافته کانون مهرباران",
    url: "https://mehrbaran.com/projects/completed",
    inLanguage: "fa-IR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="md:w-8/10 w-9/10 mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-green-600">پروژه‌های پایان‌یافته</h1>
        <p className="text-gray-600">
          مشاهده پروژه‌های خیریه‌ای که با موفقیت به پایان رسیده‌اند و تاثیرات مثبتی در جامعه گذاشته‌اند.
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
          <p className="text-gray-600 mb-4">در حال حاضر هیچ پروژه پایان‌یافته‌ای برای نمایش وجود ندارد.</p>
          <Link href="/projects/active" className="text-mblue hover:underline">
            مشاهده پروژه‌های در حال اجرا →
          </Link>
        </div>
      )}
    </div>
    </>
  );
}
