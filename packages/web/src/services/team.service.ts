import api from "@/lib/api";
import { ITeam } from "common-types";

/**
 * Response types for team endpoints
 */
interface GetTeamsResponse {
  message: string;
  results: number;
  data: ITeam[];
}

interface GetTeamByIdResponse {
  message: string;
  data: ITeam;
}

interface CreateTeamResponse {
  message: string;
  data: ITeam;
}

interface TeamStatsResponse {
  message: string;
  data: {
    totalMembers: number;
    activeMembers: number;
    tasksAssigned: number;
    tasksCompleted: number;
    teamProgress: number;
  };
}

/**
 * Request types
 */
export interface GetTeamsParams {
  needId?: string;
  status?: "active" | "paused" | "completed" | "disbanded";
  focusArea?: string;
  limit?: number;
  skip?: number;
}

export interface CreateTeamData {
  need: string;
  name: string;
  description?: string;
  focusArea?: "fundraising" | "logistics" | "communication" | "technical" | "volunteer" | "coordination" | "documentation" | "general";
  maxMembers?: number;
  tags?: string[];
  isPrivate?: boolean;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  focusArea?: string;
  status?: "active" | "paused" | "completed" | "disbanded";
  maxMembers?: number;
  tags?: string[];
  isPrivate?: boolean;
}

export interface AddMemberData {
  userId: string;
  role?: "leader" | "co_leader" | "member";
}

export interface UpdateMemberRoleData {
  role: "leader" | "co_leader" | "member";
}

/**
 * Team Service - تمام درخواست‌های مربوط به تیم‌ها
 */
class TeamService {
  /**
   * دریافت لیست تیم‌ها
   */
  public async getTeams(params?: GetTeamsParams): Promise<GetTeamsResponse> {
    try {
      const response = await api.get("/teams", { params });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch teams:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت لیست تیم‌ها");
    }
  }

  /**
   * دریافت تیم‌های کاربر جاری
   */
  public async getMyTeams(): Promise<GetTeamsResponse> {
    try {
      const response = await api.get("/teams/my-teams");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch my teams:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت تیم‌های شما");
    }
  }

  /**
   * دریافت جزئیات یک تیم
   */
  public async getTeamById(teamId: string): Promise<GetTeamByIdResponse> {
    try {
      const response = await api.get(`/teams/${teamId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch team:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت اطلاعات تیم");
    }
  }

  /**
   * ایجاد تیم جدید
   */
  public async createTeam(data: CreateTeamData): Promise<CreateTeamResponse> {
    try {
      const response = await api.post("/teams", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to create team:", error);
      throw new Error(error.response?.data?.message || "خطا در ایجاد تیم");
    }
  }

  /**
   * ویرایش تیم
   */
  public async updateTeam(teamId: string, data: UpdateTeamData): Promise<GetTeamByIdResponse> {
    try {
      const response = await api.patch(`/teams/${teamId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to update team:", error);
      throw new Error(error.response?.data?.message || "خطا در ویرایش تیم");
    }
  }

  /**
   * حذف تیم
   */
  public async deleteTeam(teamId: string): Promise<void> {
    try {
      await api.delete(`/teams/${teamId}`);
    } catch (error: any) {
      console.error("Failed to delete team:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف تیم");
    }
  }

  /**
   * دریافت آمار تیم
   */
  public async getTeamStats(teamId: string): Promise<TeamStatsResponse> {
    try {
      const response = await api.get(`/teams/${teamId}/stats`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch team stats:", error);
      throw new Error(error.response?.data?.message || "خطا در دریافت آمار تیم");
    }
  }

  /**
   * افزودن عضو به تیم
   */
  public async addMember(teamId: string, data: AddMemberData): Promise<GetTeamByIdResponse> {
    try {
      const response = await api.post(`/teams/${teamId}/members`, data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to add member:", error);
      throw new Error(error.response?.data?.message || "خطا در افزودن عضو");
    }
  }

  /**
   * حذف عضو از تیم
   */
  public async removeMember(teamId: string, userId: string): Promise<GetTeamByIdResponse> {
    try {
      const response = await api.delete(`/teams/${teamId}/members/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      throw new Error(error.response?.data?.message || "خطا در حذف عضو");
    }
  }

  /**
   * تغییر نقش عضو
   */
  public async updateMemberRole(
    teamId: string,
    userId: string,
    data: UpdateMemberRoleData
  ): Promise<GetTeamByIdResponse> {
    try {
      const response = await api.patch(`/teams/${teamId}/members/${userId}/role`, data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to update member role:", error);
      throw new Error(error.response?.data?.message || "خطا در تغییر نقش عضو");
    }
  }

  /**
   * دعوت کاربر به تیم
   */
  public async inviteUser(teamId: string, userId: string): Promise<void> {
    try {
      await api.post(`/teams/${teamId}/invite`, { userId });
    } catch (error: any) {
      console.error("Failed to invite user:", error);
      throw new Error(error.response?.data?.message || "خطا در ارسال دعوتنامه");
    }
  }
}

export const teamService = new TeamService();
