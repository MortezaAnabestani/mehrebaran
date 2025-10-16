import { IResponsiveImage } from "./project.types";

export interface ISetting {
  _id: string;
  key: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHomePageHeroSetting {
  image: IResponsiveImage;
  title: string;
  subtitle: string;
}
