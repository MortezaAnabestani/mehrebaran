import { IArticle, IVideo, IGallery } from "./";

export type FeaturedItemType = "Article" | "Video" | "Gallery";

export interface IFeaturedItem {
  _id: string;
  order: number;

  item: IArticle | IVideo | IGallery | string;
  itemType: FeaturedItemType;

  createdAt: Date;
  updatedAt: Date;
}
