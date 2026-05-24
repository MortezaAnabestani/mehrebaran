import { IResponsiveImage, ITag, IAuthor, ICategory, IUser } from "./";

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
  cameraman?: IUser | string | null;
  tags?: (ITag | string)[];
  status: "draft" | "published";
  views: number;
  relatedVideos?: (IVideo | string)[];
  createdAt: Date;
  updatedAt: Date;
}
