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
  id: string;
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
  deadLine?: number;
}

export interface CardType {
  img: string;
  title: string;
  description: string;
  href: string;
  featuredImage: { desktop: string; mobile: string };
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

export interface SigningDataForm1 {
  mobile: string;
}
export interface SigningDataForm2 {
  name: string;
  major: string;
  yearOfAdmission: string;
  verificationCode: string;
  ID: string;
}

export interface NeedsNetworkSectionsType {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  link: "social-responsibility" | "volunteer-camps" | "effective-altruism" | "environment";
  subject: {
    title: string;
    description: string;
    comments: string[];
    images: string[];
    totalVote: number;
  }[];
}
