import { getArticleByIdOrSlug } from "@/services/article.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";

import HeadTitle from "@/components/features/home/HeadTitle";
import Comment from "@/components/shared/Comment";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedArticle = cache(getArticleByIdOrSlug);

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCachedArticle(slug);

  if (!article) {
    return { title: "مقاله یافت نشد" };
  }

  const author = typeof article.author !== "string" ? article.author : null;

  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.excerpt,
    alternates: {
      canonical: `https://mehrbaran.com/blog/articles/${slug}`,
    },
    openGraph: {
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.excerpt,
      url: `https://mehrbaran.com/blog/articles/${slug}`,
      images: [{ url: article.featuredImage?.desktop, alt: article.title }],
      type: "article",
      publishedTime: new Date(article.createdAt).toISOString(),
      authors: author ? [`https://mehrbaran.com/authors/${author.slug}`] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.excerpt,
      images: [article.featuredImage?.desktop],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getCachedArticle(slug);

  if (!article) {
    notFound();
  }

  const author = typeof article.author !== "string" ? article.author : null;

  return (
    <article className="w-9/10 md:w-8/10 mx-auto my-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": article.seo?.metaTitle || article.title,
              "description": article.seo?.metaDescription || article.excerpt,
              "image": article.featuredImage?.desktop,
              "inLanguage": "fa-IR",
              ...(author && {
                "author": {
                  "@type": "Person",
                  "name": author.name,
                  "url": `https://mehrbaran.com/authors/${author.slug}`
                }
              }),
              "publisher": {
                "@type": "Organization",
                "name": "کانون مهرباران",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://mehrbaran.com/icons/logo.svg"
                }
              },
              "datePublished": article.createdAt,
              "dateModified": article.updatedAt || article.createdAt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://mehrbaran.com/blog/articles/${slug}`
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "خانه",
                  "item": "https://mehrbaran.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "مقالات",
                  "item": "https://mehrbaran.com/blog/articles"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": article.seo?.metaTitle || article.title,
                  "item": `https://mehrbaran.com/blog/articles/${slug}`
                }
              ]
            }
          ])
        }}
      />
      <HeadTitle as="h1" title={article.title} />

      {article.subtitle && (
        <h2 className="font-semibold text-xl text-gray-700 my-5 text-center">{article.subtitle}</h2>
      )}

      <div className="relative h-60 md:h-120 border border-mgray shadow-xs shadow-mgray my-5">
        <OptimizedImage
          src={article.featuredImage?.desktop}
          alt={article.title || "مقاله"}
          fill
          priority="up"
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-center justify-between text-gray-600 my-5">
        {author && (
          <div className="font-bold text-lg">
            <span>منبع: </span>
            <Link href={`/authors/${author.slug}`} className="text-mblue hover:underline">
              {author.name}
            </Link>
          </div>
        )}
        <time dateTime={new Date(article.createdAt).toISOString()} className="text-sm">
          {new Date(article.createdAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      <div
        className="text-base/loose text-justify prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(article.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "span", "iframe"]),
            allowedAttributes: false,
          }),
        }}
      />

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">نظرات</h2>
        <Comment postId={article._id} postType="Article" />
      </section>
    </article>
  );
}
