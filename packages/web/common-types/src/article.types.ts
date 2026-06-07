import { ICategory, IResponsiveImage, ITag, IAuthor } from "./";

export interface IArticleSeo {
  metaTitle: string;
  metaDescription?: string;
}

export interface IArticle {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  seo: IArticleSeo;
  content: string; // HTML
  excerpt: string;
  featuredImage: IResponsiveImage;
  gallery?: IResponsiveImage[];
  category: ICategory | string;
  tags?: (ITag | string)[];
  author: IAuthor | string;
  status: "draft" | "published" | "archived";
  views: number;
  relatedArticles?: (IArticle | string)[];
  createdAt: Date;
  updatedAt: Date;
}
