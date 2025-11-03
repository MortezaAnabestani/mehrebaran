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
    const response = await api.get("/discovery/recommendations/needs", { params });
    return response.data;
  }

  /**
   * Get recommended users to follow
   */
  public async getRecommendedUsers(
    params?: GetRecommendedUsersParams
  ): Promise<GetRecommendedUsersResponse> {
    const response = await api.get("/discovery/recommendations/users", { params });
    return response.data;
  }

  /**
   * Get recommended teams to join
   */
  public async getRecommendedTeams(
    params?: GetRecommendedTeamsParams
  ): Promise<GetRecommendedTeamsResponse> {
    const response = await api.get("/discovery/recommendations/teams", { params });
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
    const response = await api.get("/discovery/trending/needs", { params });
    return response.data;
  }

  /**
   * Get trending users based on activity
   */
  public async getTrendingUsers(
    params?: GetTrendingUsersParams
  ): Promise<GetTrendingUsersResponse> {
    const response = await api.get("/discovery/trending/users", { params });
    return response.data;
  }

  /**
   * Get trending tags based on activity
   */
  public async getTrendingTags(
    params?: { limit?: number; skip?: number; period?: "day" | "week" | "month" | "all" }
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await api.get("/discovery/trending/tags", { params });
    return response.data;
  }

  // ===========================
  // Leaderboard
  // ===========================

  /**
   * Get leaderboard
   */
  public async getLeaderboard(
    params?: { category?: string; period?: string; limit?: number }
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await api.get("/discovery/leaderboard", { params });
    return response.data;
  }

  /**
   * Get my rank in leaderboard
   */
  public async getMyRank(
    params?: { category?: string; period?: string }
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get("/discovery/leaderboard/me", { params });
    return response.data;
  }

  /**
   * Get user rank in leaderboard
   */
  public async getUserRank(
    userId: string,
    params?: { category?: string; period?: string }
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get(`/discovery/leaderboard/user/${userId}`, { params });
    return response.data;
  }

  /**
   * Get nearby users in leaderboard
   */
  public async getNearbyUsers(
    params?: { category?: string; period?: string; range?: number }
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await api.get("/discovery/leaderboard/nearby", { params });
    return response.data;
  }

  /**
   * Get top users
   */
  public async getTopUsers(
    params?: { category?: string; period?: string; limit?: number }
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await api.get("/discovery/leaderboard/top", { params });
    return response.data;
  }

  // ===========================
  // Personalized Feed & Stats
  // ===========================

  /**
   * Get personalized recommendations
   */
  public async getPersonalizedRecommendations(
    params?: { limit?: number }
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get("/discovery/recommendations/personalized", { params });
    return response.data;
  }

  /**
   * Get user preferences
   */
  public async getUserPreferences(): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get("/discovery/recommendations/preferences");
    return response.data;
  }

  /**
   * Get personalized feed
   */
  public async getPersonalizedFeed(
    params?: { limit?: number; skip?: number }
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await api.get("/discovery/feed", { params });
    return response.data;
  }

  /**
   * Get discovery stats
   */
  public async getDiscoveryStats(): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get("/discovery/stats");
    return response.data;
  }

  /**
   * Get all trending content
   */
  public async getAllTrendingContent(
    params?: { period?: "day" | "week" | "month" | "all"; limit?: number }
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.get("/discovery/trending/all", { params });
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
  }> {
    const [needsRes, usersRes] = await Promise.all([
      this.getTrendingNeeds({ period, limit }),
      this.getTrendingUsers({ period, limit }),
    ]);

    return {
      needs: needsRes.data,
      users: usersRes.data,
    };
  }
}

// Export singleton instance
const discoveryService = new DiscoveryService();
export default discoveryService;
