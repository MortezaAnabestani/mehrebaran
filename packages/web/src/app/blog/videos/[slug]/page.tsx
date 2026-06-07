import { getVideoByIdOrSlug } from "@/services/video.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import sanitizeHtml from "sanitize-html";

import HeadTitle from "@/components/features/home/HeadTitle";
import Comment from "@/components/shared/Comment";
import Link from "next/link";
import VideoPlayer from "@/components/features/video/VideoPlayer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedVideo = cache(getVideoByIdOrSlug);

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getCachedVideo(slug);
  if (!video) return { title: "ویدئو یافت نشد" };

  return {
    title: video.seo?.metaTitle ? `${video.seo.metaTitle} | کانون مهرباران` : `${video.title} | کانون مهرباران`,
    description: video.seo?.metaDescription || video.description,
    alternates: {
      canonical: `https://mehrbaran.com/blog/videos/${slug}`,
    },
    openGraph: {
      title: video.seo?.metaTitle || video.title,
      description: video.seo?.metaDescription || video.description,
      url: `https://mehrbaran.com/blog/videos/${slug}`,
      type: "video.other",
      images: video.coverImage?.desktop ? [{ url: video.coverImage.desktop }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: video.seo?.metaTitle || video.title,
      description: video.seo?.metaDescription || video.description,
      images: video.coverImage?.desktop ? [video.coverImage.desktop] : [],
    },
  };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const video = await getCachedVideo(slug);

  if (!video) {
    notFound();
  }

  const cameraman = typeof video.cameraman !== "string" ? video.cameraman : null;

  return (
    <article className="w-9/10 md:w-8/10 mx-auto my-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": video.title,
              "description": video.seo?.metaDescription || video.description,
              "thumbnailUrl": video.coverImage?.desktop,
              "uploadDate": video.createdAt,
              "inLanguage": "fa-IR",
              "publisher": {
                "@type": "Organization",
                "name": "کانون مهرباران",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://mehrbaran.com/icons/logo.svg"
                }
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
                  "name": "ویدئوها",
                  "item": "https://mehrbaran.com/blog/videos"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": video.seo?.metaTitle || video.title,
                  "item": `https://mehrbaran.com/blog/videos/${slug}`
                }
              ]
            }
          ])
        }}
      />
      <HeadTitle as="h1" title={video.title} />

      <VideoPlayer video={video} />

      <div className="flex items-center justify-between text-gray-600 my-5">
        {cameraman && (
          <div className="font-bold text-lg">
            <span>فیلمبردار: </span>
            <Link href={`/authors/${cameraman.slug}`} className="text-mblue hover:underline">
              {cameraman.name}
            </Link>
          </div>
        )}
        <time dateTime={new Date(video.createdAt).toISOString()} className="text-sm">
          {new Date(video.createdAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      <div
        className="text-base/loose text-justify prose max-w-none"
        dangerouslySetInnerHTML={{ __html: video.description ? sanitizeHtml(video.description) : "" }}
      />

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">نظرات</h2>
        <Comment postId={video._id} postType="Video" />
      </section>
    </article>
  );
}
