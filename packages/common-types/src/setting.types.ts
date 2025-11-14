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

// تنظیمات Hero Section صفحه حوزه‌های فعالیت (Focus Page)
export interface IFocusPageHeroSetting {
  title: string; // عنوان اصلی (مثل "حوزه‌های فعالیت")
  subtitle: string; // زیرعنوان (مثل "کانون مهرباران")
  description: string; // توضیحات
  stats: {
    projects: { label: string; value: string }; // آمار پروژه‌ها
    volunteers: { label: string; value: string }; // آمار داوطلبان
    beneficiaries: { label: string; value: string }; // آمار ذینفعان
  };
  dockImages: string[]; // آرایه URL تصاویر برای AppleWatchDock (حداقل 4 عکس)
}
