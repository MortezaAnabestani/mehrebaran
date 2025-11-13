import { getProjectByIdOrSlug } from "@/services/project.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";
import { cookies } from "next/headers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Helper function to normalize slug (decode and convert underscores to dashes)
function normalizeSlug(slug: string): string {
  const decoded = decodeURIComponent(slug);
  return decoded.replace(/_/g, "-");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const project = await getProjectByIdOrSlug(normalizedSlug);

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
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const project = await getProjectByIdOrSlug(normalizedSlug);

  if (!project) {
    notFound();
  }

  // Check if user is authenticated (simple check for token)
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isAuthenticated = !!token;

  return <ProjectDetailClient project={project} isAuthenticated={isAuthenticated} />;
}
