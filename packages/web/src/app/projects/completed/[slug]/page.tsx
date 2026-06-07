import { getProjectByIdOrSlug, getProjects } from "@/services/project.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProjectDetailClient from "../../[slug]/ProjectDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Helper function to normalize slug (decode and convert underscores to dashes)
function normalizeSlug(slug: string): string {
  const decoded = decodeURIComponent(slug);
  return decoded.replace(/_/g, "-");
}

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const { data: projects } = await getProjects({ status: "completed", limit: 10 });
  return projects.map((p) => ({
    slug: encodeURIComponent(p.slug || p._id),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const project = await getProjectByIdOrSlug(normalizedSlug);

  if (!project) {
    return {
      title: "پروژه یافت نشد | کانون مهرباران",
    };
  }

  const url = `/projects/completed/${slug}`;
  const imageUrl = project.featuredImage?.desktop ? `${process.env.NEXT_PUBLIC_UPLOADS}${project.featuredImage.desktop}` : undefined;

  return {
    title: `${project.title} | پروژه پایان‌یافته | کانون مهرباران`,
    description: project.excerpt || `جزئیات پروژه پایان‌یافته: ${project.title}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.title} | کانون مهرباران`,
      description: project.excerpt || `جزئیات پروژه پایان‌یافته: ${project.title}`,
      url: url,
      siteName: "کانون مهرباران",
      images: imageUrl ? [{ url: imageUrl }] : [],
      locale: "fa_IR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | کانون مهرباران`,
      description: project.excerpt || `جزئیات پروژه پایان‌یافته: ${project.title}`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function CompletedProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const project = await getProjectByIdOrSlug(normalizedSlug);

  if (!project) {
    notFound();
  }

  // Verify project is completed
  if (project.status !== "completed") {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: project.title,
        description: project.excerpt,
        image: project.featuredImage?.desktop ? `${process.env.NEXT_PUBLIC_UPLOADS}${project.featuredImage.desktop}` : undefined,
        url: `https://mehrbaran.com/projects/completed/${slug}`,
        inLanguage: "fa-IR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "خانه",
            item: "https://mehrbaran.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "پروژه‌های پایان‌یافته",
            item: "https://mehrbaran.com/projects/completed",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: `https://mehrbaran.com/projects/completed/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailClient project={project} />
    </>
  );
}
