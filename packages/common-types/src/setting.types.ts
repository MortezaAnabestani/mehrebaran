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

export interface IBlogBackgroundSetting {
  image: string; // URL تصویر پس‌زمینه بخش بلاگ
}

// آمارهای بخش "در کنار هم چه کردیم"
export interface IWhatWeDidStatistics {
  totalProjects: number; // تعداد پروژه‌ها
  schoolsCovered: number; // مناطق و مدارس تحت پوشش طرح‌ها
  budgetRaised: number; // میزان بودجه جذب‌شده
  partnerOrganizations: number; // مجموعه‌های همکار
  volunteerHours: number; // مجموع ساعات داوطلبی
  activeVolunteers: number; // تعداد داوطلبان فعال
}

// تنظیمات صفحه پروژه‌های تکمیل شده
export interface ICompletedProjectsPageSetting {
  backgroundImage: string; // URL تصویر پس‌زمینه
  title: string; // عنوان روی عکس (مثل "باران تویی...")
  description: string; // متن توضیحات
}
