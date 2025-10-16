import { IResponsiveImage, ITag, IAuthor, ICategory } from "./";

export interface IGallerySeo {
  metaTitle: string;
  metaDescription?: string;
}

export interface IGallery {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  seo: IGallerySeo;
  description: string;
  images: IResponsiveImage[];
  photographer?: IAuthor | string;
  category?: ICategory | string;
  tags?: (ITag | string)[];
  status: "draft" | "published";
  views: number;
  relatedGalleries?: (IGallery | string)[];
  createdAt: Date;
  updatedAt: Date;
}
