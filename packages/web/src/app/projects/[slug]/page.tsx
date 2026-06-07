259    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | کانون مهر باران`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const project = await cachedGetProject(normalizedSlug);

  if (!project) {
    notFound();
  }

  // Check if user is authenticated (simple check for token)
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isAuthenticated = !!token;

  const siteUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
  const url = `${siteUrl}/projects/${normalizedSlug}`;
  const imageUrl = project.featuredImage?.desktop ? (process.env.NEXT_PUBLIC_UPLOADS + project.featuredImage.desktop) : undefined;
  const description = project.excerpt ? (project.excerpt.length > 155 ? project.excerpt.substring(0, 150) + "..." : project.excerpt) : "جزئیات پروژه در کانون مهر باران";

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description,
    image: imageUrl ? [imageUrl] : [],
    author: {
      "@type": "Organization",
      name: "کانون مهر باران",
    },
    publisher: {
      "@type": "Organization",
      name: "کانون مهر باران",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    inLanguage: "fa-IR"
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "پروژه‌ها",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <ProjectDetailClient project={project} isAuthenticated={isAuthenticated} />
    </>
  );
}
