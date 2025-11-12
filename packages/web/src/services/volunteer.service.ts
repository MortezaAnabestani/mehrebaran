// packages/web/src/services/volunteer.service.ts
import api from "@/lib/api";
import { IVolunteerRegistration } from "common-types";

export interface RegisterVolunteerDTO {
  projectId: string;
  skills: string[];
  availableHours: number;
  preferredRole?: string;
  experience?: string;
  motivation?: string;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface VolunteerStatsResponse {
  total: number;
  pending: number;
  approved: number;
  active: number;
  completed: number;
  totalHours: number;
}

export interface ActiveVolunteerResponse {
  _id: string;
  volunteer: {
    _id: string;
    profile: {
      fullName: string;
      avatar?: string;
    };
  };
  hoursContributed: number;
  tasksCompleted: number;
  skills: string[];
}

/**
 * Register as volunteer (requires auth)
 */
export const registerAsVolunteer = async (
  data: RegisterVolunteerDTO
): Promise<IVolunteerRegistration> => {
  try {
    const response = await api.post("/volunteers/register", data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "خطا در ثبت‌نام داوطلب");
  }
};

/**
 * Get volunteer registration by ID
 */
export const getVolunteerRegistration = async (
  id: string
): Promise<IVolunteerRegistration> => {
  try {
    const response = await api.get(`/volunteers/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "ثبت‌نام داوطلب یافت نشد");
  }
};

/**
 * Get volunteers for a project
 */
export const getProjectVolunteers = async (
  projectId: string,
  filters?: {
    status?: string;
    limit?: number;
  }
): Promise<IVolunteerRegistration[]> => {
  try {
    const response = await api.get(`/volunteers/project/${projectId}`, { params: filters });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch project volunteers:", error);
    return [];
  }
};

/**
 * Get user's volunteer registrations (requires auth)
 */
export const getMyVolunteerRegistrations = async (): Promise<IVolunteerRegistration[]> => {
  try {
    const response = await api.get("/volunteers/my-registrations");
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch my volunteer registrations:", error);
    return [];
  }
};

/**
 * Withdraw from volunteering (requires auth)
 */
export const withdrawVolunteer = async (id: string): Promise<IVolunteerRegistration> => {
  try {
    const response = await api.post(`/volunteers/${id}/withdraw`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "خطا در انصراف از داوطلبی");
  }
};

/**
 * Get volunteer statistics for a project
 */
export const getProjectVolunteerStats = async (
  projectId: string
): Promise<VolunteerStatsResponse> => {
  try {
    const response = await api.get(`/volunteers/project/${projectId}/stats`);
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch volunteer stats:", error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      active: 0,
      completed: 0,
      totalHours: 0,
    };
  }
};

/**
 * Get active volunteers for a project
 */
export const getActiveVolunteers = async (
  projectId: string,
  limit: number = 20
): Promise<ActiveVolunteerResponse[]> => {
  try {
    const response = await api.get(`/volunteers/project/${projectId}/active`, {
      params: { limit },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch active volunteers:", error);
    return [];
  }
};
