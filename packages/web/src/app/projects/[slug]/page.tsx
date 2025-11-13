import { getProjectByIdOrSlug } from "@/services/project.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";
import { cookies } from "next/headers";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectByIdOrSlug(params.slug);

  if (!project) {
    return {
      title: "پروژه یافت نشد",
    };
  }

  return {
    title: project.title,
    description: project.excerpt,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProjectByIdOrSlug(params.slug);

  if (!project) {
    notFound();
  }

  // Check if user is authenticated (simple check for token)
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isAuthenticated = !!token;

  return <ProjectDetailClient project={project} isAuthenticated={isAuthenticated} />;
}
