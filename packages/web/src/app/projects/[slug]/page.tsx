import { getProjectByIdOrSlug } from "@/services/project.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";
import { cookies } from "next/headers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Helper function to normalize slug (convert underscores to dashes)
function normalizeSlug(slug: string): string {
  return slug.replace(/_/g, "-");
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
  console.log("🔍 [ProjectDetailPage] Raw slug:", slug);
  const normalizedSlug = normalizeSlug(slug);
  console.log("🔍 [ProjectDetailPage] Normalized slug:", normalizedSlug);
  const project = await getProjectByIdOrSlug(normalizedSlug);
  console.log("🔍 [ProjectDetailPage] Project found:", project ? "✅ Yes" : "❌ No");

  if (!project) {
    notFound();
  }

  // Check if user is authenticated (simple check for token)
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isAuthenticated = !!token;

  return <ProjectDetailClient project={project} isAuthenticated={isAuthenticated} />;
}
