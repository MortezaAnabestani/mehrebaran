import { getProjectByIdOrSlug } from "@/services/project.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProjectDetailClient from "../../[slug]/ProjectDetailClient";

export const revalidate = 60;

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

  const uploadDomain = process.env.NEXT_PUBLIC_UPLOADS || "https://mehrbaran.com";
  const featuredImage = project.featuredImage?.desktop
    ? `${uploadDomain}${project.featuredImage.desktop}`
    : "https://mehrbaran.com/images/default-og.jpg";

  return {
    title: `${project.seo?.metaTitle || project.title} | پروژه‌های در حال اجرا کانون مهرباران`,
    description: project.seo?.metaDescription || project.excerpt,
    alternates: {
      canonical: `https://mehrbaran.com/projects/active/${normalizedSlug}`,
    },
    openGraph: {
      title: `${project.seo?.metaTitle || project.title} | کانون مهرباران`,
      description: project.seo?.metaDescription || project.excerpt,
      url: `https://mehrbaran.com/projects/active/${normalizedSlug}`,
      images: [
        {
          url: featuredImage,
          alt: project.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.seo?.metaTitle || project.title} | کانون مهرباران`,
      description: project.seo?.metaDescription || project.excerpt,
      images: [featuredImage],
    },
  };
}

export default async function ActiveProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const project = await getProjectByIdOrSlug(normalizedSlug);

  if (!project) {
    notFound();
  }

  // Verify project is active
  if (project.status !== "active") {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      inLanguage: "fa-IR",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://mehrbaran.com/projects/active/${normalizedSlug}`,
      },
      headline: project.seo?.metaTitle || project.title,
      description: project.seo?.metaDescription || project.excerpt,
      image: project.featuredImage?.desktop
        ? `${process.env.NEXT_PUBLIC_UPLOADS || "https://mehrbaran.com"}${project.featuredImage.desktop}`
        : "https://mehrbaran.com/images/default-og.jpg",
      publisher: {
        "@type": "Organization",
        name: "کانون مهرباران",
        logo: {
          "@type": "ImageObject",
          url: "https://mehrbaran.com/icons/logo.svg",
        },
      },
      datePublished: project.createdAt,
      dateModified: project.updatedAt || project.createdAt,
    },
    {
      "@context": "https://schema.org",
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
          name: "پروژه‌ها",
          item: "https://mehrbaran.com/projects",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "پروژه‌های جاری",
          item: "https://mehrbaran.com/projects/active",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: project.title,
          item: `https://mehrbaran.com/projects/active/${normalizedSlug}`,
        },
      ],
    },
  ];

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
