import { IUser } from "./user.types";
import { IProject } from "./project.types";

export type PaymentMethod = "online" | "bank_transfer" | "cash";
export type DonationStatus = "pending" | "completed" | "failed" | "refunded" | "verified" | "rejected";
export type Currency = "IRT" | "USD";

export interface IDonorInfo {
  name: string;
  email?: string;
  phone?: string;
  isAnonymous: boolean;
}

export interface IReceiptInfo {
  image: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: IUser | string;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface IDonation {
  _id: string;
  project: IProject | string;
  donor?: IUser | string; // Optional - can be anonymous

  // Payment Information
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  status: DonationStatus;

  // Online Payment Details
  paymentGateway?: string; // "zarinpal" | "idpay" | "zibal"
  transactionId?: string;
  authority?: string; // Zarinpal Authority code
  refId?: string; // Reference ID from gateway
  trackingCode?: string;

  // Donor Information (optional for anonymous)
  donorInfo?: IDonorInfo;

  // Receipt for Bank Transfer
  receipt?: IReceiptInfo;

  // Additional
  message?: string; // Message from donor to organization
  dedicatedTo?: string; // "In memory of..." or "In honor of..."

  // Certificate
  certificateUrl?: string;
  certificateGenerated: boolean;
  certificateGeneratedAt?: Date;

  // Admin Actions
  adminNotes?: string;
  verifiedBy?: IUser | string;
  verifiedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface ICreateDonationDTO {
  projectId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  donorInfo?: IDonorInfo;
  message?: string;
  dedicatedTo?: string;
}

export interface IVerifyDonationDTO {
  authority: string;
  status: string;
}

export interface IUploadReceiptDTO {
  donationId: string;
  receiptImage: string;
  description?: string;
}
