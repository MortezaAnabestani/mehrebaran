import { getProjects } from "@/services/project.service";
import { Metadata } from "next";
import ActiveProjectsClient from "./ActiveProjectsClient";

export const metadata: Metadata = {
  title: "پروژه‌های در حال اجرا | کانون مسئولیت اجتماعی مهرباران",
  description: "مشاهده و حمایت از پروژه‌های خیریه در حال اجرای کانون مهرباران",
  alternates: {
    canonical: "/projects/active",
  },
  openGraph: {
    title: "پروژه‌های در حال اجرا | کانون مسئولیت اجتماعی مهرباران",
    description: "مشاهده و حمایت از پروژه‌های خیریه در حال اجرای کانون مهرباران",
    url: "/projects/active",
    siteName: "کانون مهرباران",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "پروژه‌های در حال اجرا | کانون مسئولیت اجتماعی مهرباران",
    description: "مشاهده و حمایت از پروژه‌های خیریه در حال اجرای کانون مهرباران",
  },
};

export default async function ActiveProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const limit = 12;
  const category = typeof params.category === "string" ? params.category : undefined;

  // Get projects with filter
  const filters: Record<string, string | number> = { status: "active", page, limit, sort: "-createdAt" };
  if (category) {
    filters.category = category;
  }

  const response = await getProjects(filters);
  const totalPages = Math.ceil(response.results / limit);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "پروژه‌های در حال اجرا | کانون مسئولیت اجتماعی مهرباران",
    description: "مشاهده و حمایت از پروژه‌های خیریه در حال اجرای کانون مهرباران",
    url: "https://mehrbaran.com/projects/active",
    inLanguage: "fa-IR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ActiveProjectsClient
        initialProjects={response.data}
        totalPages={totalPages}
        currentPage={page}
        selectedCategory={category}
      />
    </>
  );
}
