import { ICategory } from "./category.types";

export interface IResponsiveImage {
  desktop: string;
  mobile: string;
}

export interface ISeo {
  metaTitle: string;
  metaDescription?: string;
}

export interface IProject {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  seo: ISeo;
  excerpt?: string;
  featuredImage: IResponsiveImage;
  gallery: IResponsiveImage[];
  category: ICategory | string;
  status: "draft" | "active" | "completed";
  targetAmount: number;
  amountRaised: number;
  targetVolunteer: number;
  collectedVolunteer: number;
  views: number;
  deadline: Date;
  isFeaturedInCompleted?: boolean; // نمایش در صفحه پروژه‌های تکمیل شده
  createdAt: Date;
  updatedAt: Date;
}
