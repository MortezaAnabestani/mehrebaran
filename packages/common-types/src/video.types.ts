import { IResponsiveImage, ITag, IAuthor, ICategory } from "./";

export interface IVideoSeo {
  metaTitle: string;
  metaDescription?: string;
}

export interface IVideo {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  seo: IVideoSeo;
  description: string;
  videoUrl: string;
  coverImage: IResponsiveImage;
  cameraman?: IAuthor | string;
  category?: ICategory | string;
  tags?: (ITag | string)[];
  status: "draft" | "published";
  views: number;
  relatedVideos?: (IVideo | string)[];
  createdAt: Date;
  updatedAt: Date;
}
