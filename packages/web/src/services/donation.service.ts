// packages/web/src/services/donation.service.ts
import api from "@/lib/api";
import { IDonation } from "common-types";

export interface CreateDonationDTO {
  projectId: string;
  amount: number;
  paymentMethod: "online" | "bank_transfer" | "cash";
  donorInfo?: {
    fullName?: string;
    mobile?: string;
    email?: string;
    isAnonymous?: boolean;
  };
  message?: string;
  dedicatedTo?: string;
}

export interface UploadReceiptDTO {
  receiptImage: string;
  description?: string;
}

export interface DonationStatsResponse {
  totalAmount: number;
  donorCount: number;
  averageDonation: number;
  byPaymentMethod: Array<{
    _id: string;
    count: number;
    total: number;
  }>;
}

export interface RecentDonorResponse {
  _id: string;
  donor?: {
    _id: string;
    profile: {
      fullName: string;
      avatar?: string;
    };
  };
  donorInfo?: {
    fullName: string;
    isAnonymous: boolean;
  };
  amount: number;
  createdAt: string;
}

/**
 * Create a new donation
 */
export const createDonation = async (data: CreateDonationDTO): Promise<IDonation> => {
  try {
    const response = await api.post("/donations", data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "خطا در ثبت کمک مالی");
  }
};

/**
 * Get donation by ID or tracking code
 */
export const getDonation = async (identifier: string): Promise<IDonation> => {
  try {
    const response = await api.get(`/donations/${identifier}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "کمک مالی یافت نشد");
  }
};

/**
 * Get donations for a project
 */
export const getProjectDonations = async (
  projectId: string,
  filters?: {
    status?: string;
    paymentMethod?: string;
    limit?: number;
  }
): Promise<IDonation[]> => {
  try {
    const response = await api.get(`/donations/project/${projectId}`, { params: filters });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch project donations:", error);
    return [];
  }
};

/**
 * Get user's donations (requires auth)
 */
export const getMyDonations = async (): Promise<IDonation[]> => {
  try {
    const response = await api.get("/donations/user/my-donations");
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch my donations:", error);
    return [];
  }
};

/**
 * Initiate online payment via Zarinpal
 */
export const initiatePayment = async (donationId: string): Promise<{
  paymentUrl: string;
  authority: string;
}> => {
  try {
    const response = await api.post(`/donations/${donationId}/pay`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "خطا در ایجاد درخواست پرداخت");
  }
};

/**
 * Verify payment after callback from Zarinpal
 */
export const verifyPayment = async (
  donationId: string,
  authority: string,
  status: string
): Promise<{
  donation: IDonation;
  refId: string;
  certificateUrl?: string;
}> => {
  try {
    const response = await api.get(`/donations/${donationId}/verify`, {
      params: { Authority: authority, Status: status },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "خطا در تایید پرداخت");
  }
};

/**
 * Upload receipt for bank transfer (requires auth)
 */
export const uploadReceipt = async (
  donationId: string,
  data: UploadReceiptDTO
): Promise<IDonation> => {
  try {
    const response = await api.post(`/donations/${donationId}/upload-receipt`, data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "خطا در آپلود رسید");
  }
};

/**
 * Get donation statistics for a project
 */
export const getProjectDonationStats = async (
  projectId: string
): Promise<DonationStatsResponse> => {
  try {
    const response = await api.get(`/donations/project/${projectId}/stats`);
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch donation stats:", error);
    return {
      totalAmount: 0,
      donorCount: 0,
      averageDonation: 0,
      byPaymentMethod: [],
    };
  }
};

/**
 * Get recent donors for a project
 */
export const getRecentDonors = async (
  projectId: string,
  limit: number = 10
): Promise<RecentDonorResponse[]> => {
  try {
    const response = await api.get(`/donations/project/${projectId}/donors`, {
      params: { limit },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch recent donors:", error);
    return [];
  }
};
