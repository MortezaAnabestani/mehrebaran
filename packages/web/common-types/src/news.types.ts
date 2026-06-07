import { ICategory, IResponsiveImage, ITag, IAuthor } from "./";

export interface INewsSeo {
  metaTitle: string;
  metaDescription?: string;
}

export interface INews {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  seo: INewsSeo;
  content: string;
  excerpt: string;
  featuredImage: IResponsiveImage;
  gallery?: IResponsiveImage[];

  author: IAuthor | string;

  category: ICategory | string;
  tags?: (ITag | string)[];

  status: "draft" | "published" | "archived";
  views: number;
  relatedNews?: (INews | string)[];

  createdAt: Date;
  updatedAt: Date;
}
