import { ICategory } from "./category.types";

export interface IResponsiveImage {
  desktop: string;
  mobile: string;
}

export interface ISeo {
  metaTitle: string;
  metaDescription?: string;
}

export interface IBankInfo {
  bankName: string;
  accountNumber: string;
  cardNumber: string;
  iban: string;
  accountHolderName: string;
}

export interface IDonationSettings {
  enabled: boolean;
  minimumAmount?: number;
  allowAnonymous: boolean;
  showDonors: boolean;
}

export interface IVolunteerSettings {
  enabled: boolean;
  requiredSkills?: string[];
  maxVolunteers?: number;
  autoApprove: boolean;
}

export interface ICertificateSettings {
  donationTemplate?: string; // URL to background image
  volunteerTemplate?: string; // URL to background image
  customMessage?: string;
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

  // Bank & Payment Information
  bankInfo?: IBankInfo;
  paymentGateway?: "zarinpal" | "idpay" | "zibal";
  merchantId?: string;

  // Donation Settings
  donationSettings: IDonationSettings;
  donorCount: number;

  // Volunteer Settings
  volunteerSettings: IVolunteerSettings;
  volunteerCount: number;
  pendingVolunteers: number;

  // Certificate Settings
  certificateSettings?: ICertificateSettings;

  createdAt: Date;
  updatedAt: Date;
}
