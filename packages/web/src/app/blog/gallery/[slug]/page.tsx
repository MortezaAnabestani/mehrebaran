import { getGalleryByIdOrSlug } from "@/services/gallery.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import sanitizeHtml from "sanitize-html";

import HeadTitle from "@/components/features/home/HeadTitle";
import Comment from "@/components/shared/Comment";
import GallerySwiper from "@/components/ui/swiper/GallerySwiper";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedGallery = cache(getGalleryByIdOrSlug);

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getCachedGallery(slug);

  if (!gallery) {
    return { title: "گالری یافت نشد" };
  }

  const firstImageRaw = gallery.images?.[0]?.desktop;
  const uploadDomain = process.env.NEXT_PUBLIC_UPLOADS || "http://localhost:5001";
  const firstImage = firstImageRaw
    ? firstImageRaw.startsWith("/uploads/")
      ? `${uploadDomain}${firstImageRaw}`
      : firstImageRaw
    : null;

  return {
    title: gallery.seo?.metaTitle ? `${gallery.seo.metaTitle} | کانون مهرباران` : `${gallery.title} | کانون مهرباران`,
    description: gallery.seo?.metaDescription || gallery.description,
    alternates: {
      canonical: `https://mehrbaran.com/blog/gallery/${slug}`,
    },
    openGraph: {
      title: gallery.seo?.metaTitle || gallery.title,
      description: gallery.seo?.metaDescription || gallery.description,
      url: `https://mehrbaran.com/blog/gallery/${slug}`,
      type: "article",
      images: firstImage ? [{ url: firstImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: gallery.seo?.metaTitle || gallery.title,
      description: gallery.seo?.metaDescription || gallery.description,
      images: firstImage ? [firstImage] : [],
    },
  };
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const gallery = await getCachedGallery(slug);

  if (!gallery) {
    notFound();
  }

  const photographer = typeof gallery.photographer !== "string" ? gallery.photographer : null;

  const imageUrls = gallery.images?.map((img: { desktop: string }) => {
    return img.desktop;
  });

  return (
    <article className="w-9/10 md:w-8/10 mx-auto my-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              "headline": gallery.seo?.metaTitle || gallery.title,
              "description": gallery.seo?.metaDescription || gallery.description,
              "image": imageUrls,
              "inLanguage": "fa-IR",
              ...(photographer && {
                "author": {
                  "@type": "Person",
                  "name": photographer.name,
                  "url": `https://mehrbaran.com/authors/${photographer.slug}`
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
              "datePublished": gallery.createdAt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://mehrbaran.com/blog/gallery/${slug}`
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
                  "name": "گالری تصاویر",
                  "item": "https://mehrbaran.com/blog/gallery"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": gallery.seo?.metaTitle || gallery.title,
                  "item": `https://mehrbaran.com/blog/gallery/${slug}`
                }
              ]
            }
          ])
        }}
      />
      <HeadTitle as="h1" title={gallery.title} />

      {gallery.subtitle && (
        <h2 className="font-semibold text-xl text-gray-700 my-5 text-center">{gallery.subtitle}</h2>
      )}

      <div className="flex items-center justify-between text-gray-600 my-5">
        {photographer && (
          <div className="font-bold text-lg">
            <span>عکاس: </span>
            <Link href={`/authors/${photographer.slug}`} className="text-mblue hover:underline">
              {photographer.name}
            </Link>
          </div>
        )}
        <time dateTime={new Date(gallery.createdAt).toISOString()} className="text-sm">
          {new Date(gallery.createdAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      <div
        className="text-base/loose text-justify prose max-w-none my-5"
        dangerouslySetInnerHTML={{
          __html: gallery.description
            ? sanitizeHtml(gallery.description, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "span", "iframe"]),
                allowedAttributes: false,
              })
            : "",
        }}
      />

      <div className="relative bg-gray-100 my-10">
        <GallerySwiper images={imageUrls ?? []} />
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">نظرات</h2>
        <Comment postId={gallery._id} postType="Gallery" />
      </section>
    </article>
  );
}
