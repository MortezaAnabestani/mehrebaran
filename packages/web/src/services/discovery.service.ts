import api from "@/lib/api";
import type { IUser } from "@/types/user";
import type { INeed } from "@/types/need";
import type { ITeam } from "@/types/team";

// ===========================
// Types & Interfaces
// ===========================

export interface GetRecommendedNeedsParams {
  limit?: number;
  skip?: number;
}

export interface GetRecommendedUsersParams {
  limit?: number;
  skip?: number;
}

export interface GetRecommendedTeamsParams {
  limit?: number;
  skip?: number;
}

export interface GetTrendingNeedsParams {
  limit?: number;
  skip?: number;
  period?: "day" | "week" | "month" | "all";
}

export interface GetTrendingUsersParams {
  limit?: number;
  skip?: number;
  period?: "day" | "week" | "month" | "all";
}

export interface GetTrendingTeamsParams {
  limit?: number;
  skip?: number;
  period?: "day" | "week" | "month" | "all";
}

export interface GetNewUsersParams {
  limit?: number;
  skip?: number;
}

export interface GetNewNeedsParams {
  limit?: number;
  skip?: number;
}

export interface GetNewTeamsParams {
  limit?: number;
  skip?: number;
}

export interface GetRecommendedNeedsResponse {
  success: boolean;
  data: INeed[];
  message: string;
}

export interface GetRecommendedUsersResponse {
  success: boolean;
  data: IUser[];
  message: string;
}

export interface GetRecommendedTeamsResponse {
  success: boolean;
  data: ITeam[];
  message: string;
}

export interface GetTrendingNeedsResponse {
  success: boolean;
  data: INeed[];
  message: string;
}

export interface GetTrendingUsersResponse {
  success: boolean;
  data: IUser[];
  message: string;
}

export interface GetTrendingTeamsResponse {
  success: boolean;
  data: ITeam[];
  message: string;
}

export interface GetNewUsersResponse {
  success: boolean;
  data: IUser[];
  message: string;
}

export interface GetNewNeedsResponse {
  success: boolean;
  data: INeed[];
  message: string;
}

export interface GetNewTeamsResponse {
  success: boolean;
  data: ITeam[];
  message: string;
}

// ===========================
// Discovery Service Class
// ===========================

class DiscoveryService {
  // ===========================
  // Recommended Content
  // ===========================

  /**
   * Get recommended needs for the current user
   */
  public async getRecommendedNeeds(
    params?: GetRecommendedNeedsParams
  ): Promise<GetRecommendedNeedsResponse> {
    const response = await api.get("/discovery/recommended-needs", { params });
    return response.data;
  }

  /**
   * Get recommended users to follow
   */
  public async getRecommendedUsers(
    params?: GetRecommendedUsersParams
  ): Promise<GetRecommendedUsersResponse> {
    const response = await api.get("/discovery/recommended-users", { params });
    return response.data;
  }

  /**
   * Get recommended teams to join
   */
  public async getRecommendedTeams(
    params?: GetRecommendedTeamsParams
  ): Promise<GetRecommendedTeamsResponse> {
    const response = await api.get("/discovery/recommended-teams", { params });
    return response.data;
  }

  // ===========================
  // Trending Content
  // ===========================

  /**
   * Get trending needs based on activity
   */
  public async getTrendingNeeds(
    params?: GetTrendingNeedsParams
  ): Promise<GetTrendingNeedsResponse> {
    const response = await api.get("/discovery/trending-needs", { params });
    return response.data;
  }

  /**
   * Get trending users based on activity
   */
  public async getTrendingUsers(
    params?: GetTrendingUsersParams
  ): Promise<GetTrendingUsersResponse> {
    const response = await api.get("/discovery/trending-users", { params });
    return response.data;
  }

  /**
   * Get trending teams based on activity
   */
  public async getTrendingTeams(
    params?: GetTrendingTeamsParams
  ): Promise<GetTrendingTeamsResponse> {
    const response = await api.get("/discovery/trending-teams", { params });
    return response.data;
  }

  // ===========================
  // New Content
  // ===========================

  /**
   * Get newly registered users
   */
  public async getNewUsers(
    params?: GetNewUsersParams
  ): Promise<GetNewUsersResponse> {
    const response = await api.get("/discovery/new-users", { params });
    return response.data;
  }

  /**
   * Get newly created needs
   */
  public async getNewNeeds(
    params?: GetNewNeedsParams
  ): Promise<GetNewNeedsResponse> {
    const response = await api.get("/discovery/new-needs", { params });
    return response.data;
  }

  /**
   * Get newly created teams
   */
  public async getNewTeams(
    params?: GetNewTeamsParams
  ): Promise<GetNewTeamsResponse> {
    const response = await api.get("/discovery/new-teams", { params });
    return response.data;
  }

  // ===========================
  // Helper Methods
  // ===========================

  /**
   * Get all recommended content at once
   */
  public async getAllRecommendations(limit: number = 10): Promise<{
    needs: INeed[];
    users: IUser[];
    teams: ITeam[];
  }> {
    const [needsRes, usersRes, teamsRes] = await Promise.all([
      this.getRecommendedNeeds({ limit }),
      this.getRecommendedUsers({ limit }),
      this.getRecommendedTeams({ limit }),
    ]);

    return {
      needs: needsRes.data,
      users: usersRes.data,
      teams: teamsRes.data,
    };
  }

  /**
   * Get all trending content at once
   */
  public async getAllTrending(
    period: "day" | "week" | "month" | "all" = "week",
    limit: number = 10
  ): Promise<{
    needs: INeed[];
    users: IUser[];
    teams: ITeam[];
  }> {
    const [needsRes, usersRes, teamsRes] = await Promise.all([
      this.getTrendingNeeds({ period, limit }),
      this.getTrendingUsers({ period, limit }),
      this.getTrendingTeams({ period, limit }),
    ]);

    return {
      needs: needsRes.data,
      users: usersRes.data,
      teams: teamsRes.data,
    };
  }

  /**
   * Get all new content at once
   */
  public async getAllNewContent(limit: number = 10): Promise<{
    needs: INeed[];
    users: IUser[];
    teams: ITeam[];
  }> {
    const [needsRes, usersRes, teamsRes] = await Promise.all([
      this.getNewNeeds({ limit }),
      this.getNewUsers({ limit }),
      this.getNewTeams({ limit }),
    ]);

    return {
      needs: needsRes.data,
      users: usersRes.data,
      teams: teamsRes.data,
    };
  }
}

// Export singleton instance
const discoveryService = new DiscoveryService();
export default discoveryService;
