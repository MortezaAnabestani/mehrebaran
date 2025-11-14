import { getArticleByIdOrSlug } from "@/services/article.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import HeadTitle from "@/components/features/home/HeadTitle";
import Comment from "@/components/shared/Comment";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleByIdOrSlug(params.slug);

  if (!article) {
    return { title: "مقاله یافت نشد" };
  }

  return {
    title: article.seo.metaTitle,
    description: article.seo.metaDescription || article.excerpt,
    openGraph: {
      title: article.seo.metaTitle,
      description: article.excerpt,
      images: [{ url: article.featuredImage.desktop }],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const article = await getArticleByIdOrSlug(params.slug);

  if (!article) {
    notFound();
  }

  const author = typeof article.author !== "string" ? article.author : null;

  return (
    <div className="w-9/10 md:w-8/10 mx-auto my-10">
      <HeadTitle title={article.title} />

      {article.subtitle && (
        <h2 className="font-semibold text-xl text-gray-700 my-5 text-center">{article.subtitle}</h2>
      )}

      <div className="relative h-60 md:h-120 border border-mgray shadow-xs shadow-mgray my-5">
        <OptimizedImage
          src={article.featuredImage.desktop}
          alt={article.title}
          fill
          priority="up"
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
        <p className="text-sm">
          {new Date(article.createdAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div
        className="text-base/loose text-justify prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">نظرات</h2>
        <Comment postId={article._id} postType="Article" />
      </div>
    </div>
  );
}
