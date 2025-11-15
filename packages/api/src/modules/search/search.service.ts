import { ProjectModel } from "../projects/project.model";
import { NewsModel } from "../news/news.model";
import { ArticleModel } from "../blog/articles/article.model";
import { VideoModel } from "../blog/videos/video.model";
import { GalleryModel } from "../blog/gallery/gallery.model";
import { FocusAreaModel } from "../focus-areas/focus-area.model";

interface SearchResult {
  type: "project" | "news" | "article" | "video" | "gallery" | "focus-area";
  id: string;
  title: string;
  description?: string;
  slug: string;
  coverImage?: any;
  createdAt: Date;
}

class SearchService {
  public async globalSearch(query: string): Promise<{ total: number; data: SearchResult[] }> {
    const searchRegex = new RegExp(query, "i");

    // جستجو در پروژه‌ها
    const projects = await ProjectModel.find({
      status: "published",
      $or: [{ title: searchRegex }, { description: searchRegex }, { fullDescription: searchRegex }],
    })
      .select("title description slug coverImage createdAt")
      .limit(10)
      .lean();

    // جستجو در اخبار
    const news = await NewsModel.find({
      status: "published",
      $or: [{ title: searchRegex }, { excerpt: searchRegex }, { content: searchRegex }],
    })
      .select("title excerpt slug featuredImage createdAt")
      .limit(10)
      .lean();

    // جستجو در مقالات
    const articles = await ArticleModel.find({
      status: "published",
      $or: [{ title: searchRegex }, { excerpt: searchRegex }, { content: searchRegex }],
    })
      .select("title excerpt slug featuredImage createdAt")
      .limit(10)
      .lean();

    // جستجو در ویدیوها
    const videos = await VideoModel.find({
      status: "published",
      $or: [{ title: searchRegex }, { description: searchRegex }],
    })
      .select("title description slug coverImage createdAt")
      .limit(10)
      .lean();

    // جستجو در گالری‌ها
    const galleries = await GalleryModel.find({
      status: "published",
      $or: [{ title: searchRegex }, { description: searchRegex }],
    })
      .select("title description slug coverImage createdAt")
      .limit(10)
      .lean();

    // جستجو در حوزه‌های فعالیت
    const focusAreas = await FocusAreaModel.find({
      isActive: true,
      $or: [{ title: searchRegex }, { description: searchRegex }],
    })
      .select("title description slug icon createdAt")
      .limit(10)
      .lean();

    // تبدیل به فرمت یکسان
    const results: SearchResult[] = [
      ...projects.map((p: any) => ({
        type: "project" as const,
        id: p._id.toString(),
        title: p.title,
        description: p.description,
        slug: p.slug,
        coverImage: p.coverImage,
        createdAt: p.createdAt,
      })),
      ...news.map((n: any) => ({
        type: "news" as const,
        id: n._id.toString(),
        title: n.title,
        description: n.excerpt,
        slug: n.slug,
        coverImage: n.featuredImage,
        createdAt: n.createdAt,
      })),
      ...articles.map((a: any) => ({
        type: "article" as const,
        id: a._id.toString(),
        title: a.title,
        description: a.excerpt,
        slug: a.slug,
        coverImage: a.featuredImage,
        createdAt: a.createdAt,
      })),
      ...videos.map((v: any) => ({
        type: "video" as const,
        id: v._id.toString(),
        title: v.title,
        description: v.description,
        slug: v.slug,
        coverImage: v.coverImage,
        createdAt: v.createdAt,
      })),
      ...galleries.map((g: any) => ({
        type: "gallery" as const,
        id: g._id.toString(),
        title: g.title,
        description: g.description,
        slug: g.slug,
        coverImage: g.coverImage,
        createdAt: g.createdAt,
      })),
      ...focusAreas.map((f: any) => ({
        type: "focus-area" as const,
        id: f._id.toString(),
        title: f.title,
        description: f.description,
        slug: f.slug,
        coverImage: f.icon,
        createdAt: f.createdAt,
      })),
    ];

    // مرتب‌سازی بر اساس تاریخ (جدیدترین‌ها ابتدا)
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      total: results.length,
      data: results.slice(0, 50), // حداکثر 50 نتیجه
    };
  }
}

export const searchService = new SearchService();
