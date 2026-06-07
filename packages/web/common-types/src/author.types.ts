import { IResponsiveImage } from "./project.types";

export interface IAuthor {
  _id: string;
  slug: string;
  metaTitle: string;
  metaDescription?: string;
  name: string;
  bio?: string;
  avatar?: IResponsiveImage;
  email?: string;
  mobile?: string;
  birthday?: Date;
  instagramId?: string;
  favoriteTemplate?: "poetic" | "scientific";
}
