import { getVideoByIdOrSlug } from "@/services/video.service"; // 👈 باید این سرویس را بسازید
import { notFound } from "next/navigation";
import { Metadata } from "next";

import HeadTitle from "@/components/features/home/HeadTitle";
import Comment from "@/components/shared/Comment";
import Link from "next/link";
import VideoPlayer from "@/components/features/video/VideoPlayer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoByIdOrSlug(slug);
  if (!video) return { title: "ویدئو یافت نشد" };

  return {
    title: video.seo.metaTitle,
    description: video.seo.metaDescription || video.description,
    openGraph: {
      title: video.seo.metaTitle,
      description: video.description,
      images: [{ url: video.coverImage.desktop }],
    },
  };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const video = await getVideoByIdOrSlug(slug);

  if (!video) {
    notFound();
  }

  const cameraman = typeof video.cameraman !== "string" ? video.cameraman : null;

  return (
    <div className="w-9/10 md:w-8/10 mx-auto my-10">
      <HeadTitle title={video.title} />

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
        <p className="text-sm">
          {new Date(video.createdAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div
        className="text-base/loose text-justify prose max-w-none"
        dangerouslySetInnerHTML={{ __html: video.description }}
      />

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">نظرات</h2>
        <Comment postId={video._id} postType="Video" />
      </div>
    </div>
  );
}
