import { getProjects } from "@/services/project.service";
import { Metadata } from "next";
import ActiveProjectsClient from "./ActiveProjectsClient";

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
  const limit = 12;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;

  // Get projects with filter
  const filters: any = { status: "active", page, limit, sort: "-createdAt" };
  if (category) {
    filters.category = category;
  }

  const response = await getProjects(filters);
  const totalPages = Math.ceil(response.results / limit);

  return (
    <ActiveProjectsClient
      initialProjects={response.data}
      totalPages={totalPages}
      currentPage={page}
      selectedCategory={category}
    />
  );
}
