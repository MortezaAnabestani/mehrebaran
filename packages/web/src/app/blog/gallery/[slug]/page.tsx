import { getGalleryByIdOrSlug } from "@/services/gallery.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import HeadTitle from "@/components/features/home/HeadTitle";
import Comment from "@/components/shared/Comment";
import GallerySwiper from "@/components/ui/swiper/GallerySwiper";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryByIdOrSlug(slug);

  if (!gallery) {
    return { title: "گالری یافت نشد" };
  }

  return {
    title: gallery.seo.metaTitle,
    description: gallery.seo.metaDescription || gallery.description,
    openGraph: {
      title: gallery.seo.metaTitle,
      description: gallery.description,
      images: gallery.images.length > 0 ? [{ url: gallery.images[0].desktop }] : [],
    },
  };
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const gallery = await getGalleryByIdOrSlug(slug);

  if (!gallery) {
    notFound();
  }

  const photographer = typeof gallery.photographer !== "string" ? gallery.photographer : null;

  // استخراج تمام URL های تصاویر
  const imageUrls = gallery.images.map((img) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${baseUrl}/${img.desktop}`;
  });

  return (
    <div className="w-9/10 md:w-8/10 mx-auto my-10">
      <HeadTitle title={gallery.title} />

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
        <p className="text-sm">
          {new Date(gallery.createdAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div
        className="text-base/loose text-justify prose max-w-none my-5"
        dangerouslySetInnerHTML={{ __html: gallery.description }}
      />

      <div className="relative bg-gray-100 my-10">
        <GallerySwiper images={imageUrls} />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">نظرات</h2>
        <Comment postId={gallery._id} postType="Gallery" />
      </div>
    </div>
  );
}
