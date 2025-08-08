//Home
export interface MenuItem {
  label: string;
  href: string;
}

export interface WhatWeDidType {
  title: string;
  numOfProject: number;
  icon: string;
  color: "mblue" | "mgray";
  href?: string;
  textColor: "black" | "white";
}

export interface RuningProjectsType {
  title: string;
  img: string;
  description: string;
}

export interface DonationProjectsType {
  targetAmount: number;
  collectedAmount: number;
  targetVolunteer: number;
  collectedVolunteer: number;
  totalRaised: "میزان مبلغ تأمین‌شده";
  requiredVolunteers: "تعداد داوطلب مورد نیاز";
}

export interface NewsCardType {
  img: string;
  title: string;
  description: string;
  href: string;
}

export interface AreasOfActivity {
  title: string;
  icon: string;
  description: string;
  color: "mblue" | "mgray";
  position: "top" | "bottom";
}

export interface FAQsType {
  answer: string;
  question: string;
}
