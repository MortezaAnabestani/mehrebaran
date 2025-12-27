import api from "@/lib/api";
import type { IStory, IStoryFeed, IStoryStats, StoryType, StoryPrivacy } from "@mehrebaran/common-types";

// ===========================
// Request Types
// ===========================

export interface CreateStoryData {
  type: StoryType;
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail?: string;
    duration?: number;
  };
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  caption?: string;
  privacy?: StoryPrivacy;
  linkedNeed?: string;
  linkedUrl?: string;
  allowReplies?: boolean;
  allowSharing?: boolean;
}

export interface GetStoriesParams {
  userId?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

// ===========================
// Response Types
// ===========================

export interface GetStoryFeedResponse {
  success: boolean;
  data: IStoryFeed;
  message: string;
}

export interface GetStoriesResponse {
  success: boolean;
  data: IStory[];
  message: string;
  total?: number;
}

export interface GetStoryByIdResponse {
  success: boolean;
  data: IStory;
  message: string;
}

export interface CreateStoryResponse {
  success: boolean;
  data: IStory;
  message: string;
}

export interface DeleteStoryResponse {
  success: boolean;
  message: string;
}

export interface ViewStoryResponse {
  success: boolean;
  data: {
    viewsCount: number;
  };
  message: string;
}

export interface ReactToStoryResponse {
  success: boolean;
  data: {
    reactionsCount: number;
  };
  message: string;
}

export interface GetStoryStatsResponse {
  success: boolean;
  data: IStoryStats;
  message: string;
}

// ===========================
// Story Service Class
// ===========================

class StoryService {
  // ===========================
  // Fetch Stories
  // ===========================

  /**
   * Get story feed (stories from followed users)
   */
  public async getStoryFeed(limit: number = 20): Promise<GetStoryFeedResponse> {
    const response = await api.get("/stories/feed", { params: { limit } });
    return response.data;
  }

  /**
   * Get stories by user ID
   */
  public async getUserStories(userId: string): Promise<GetStoriesResponse> {
    const response = await api.get(`/stories/user/${userId}`);
    return response.data;
  }

  /**
   * Get current user's stories
   */
  public async getMyStories(): Promise<GetStoriesResponse> {
    const response = await api.get("/stories/my");
    return response.data;
  }

  /**
   * Get a single story by ID
   */
  public async getStoryById(id: string): Promise<GetStoryByIdResponse> {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  }

  /**
   * Get active stories (not expired)
   */
  public async getActiveStories(params?: GetStoriesParams): Promise<GetStoriesResponse> {
    const response = await api.get("/stories", {
      params: { ...params, isActive: true },
    });
    return response.data;
  }

  // ===========================
  // Create & Delete
  // ===========================

  /**
   * Create a new story
   */
  public async createStory(data: CreateStoryData): Promise<CreateStoryResponse> {
    const response = await api.post("/stories", data);
    return response.data;
  }

  /**
   * Delete a story
   */
  public async deleteStory(id: string): Promise<DeleteStoryResponse> {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  }

  // ===========================
  // Interactions
  // ===========================

  /**
   * View a story
   */
  public async viewStory(id: string, viewDuration?: number): Promise<ViewStoryResponse> {
    const response = await api.post(`/stories/${id}/view`, {
      viewDuration,
    });
    return response.data;
  }

  /**
   * React to a story
   */
  public async reactToStory(id: string, emoji: string): Promise<ReactToStoryResponse> {
    const response = await api.post(`/stories/${id}/react`, {
      emoji,
    });
    return response.data;
  }

  /**
   * Remove reaction from a story
   */
  public async removeReaction(id: string): Promise<ReactToStoryResponse> {
    const response = await api.delete(`/stories/${id}/react`);
    return response.data;
  }

  // ===========================
  // Stats & Viewers
  // ===========================

  /**
   * Get story stats for current user
   */
  public async getMyStoryStats(): Promise<GetStoryStatsResponse> {
    const response = await api.get("/stories/stats");
    return response.data;
  }

  /**
   * Get viewers of a story
   */
  public async getViewers(id: string): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await api.get(`/stories/${id}/viewers`);
    return response.data;
  }

  // ===========================
  // Highlights
  // ===========================

  /**
   * Create a highlight
   */
  public async createHighlight(data: {
    title: string;
    coverImage?: string;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post("/stories/highlights", data);
    return response.data;
  }

  /**
   * Get highlights for a user
   */
  public async getUserHighlights(
    userId: string
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await api.get(`/stories/highlights/user/${userId}`);
    return response.data;
  }

  /**
   * Add story to highlight
   */
  public async addStoryToHighlight(
    highlightId: string,
    storyId: string
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post(`/stories/highlights/${highlightId}/add-story`, {
      storyId,
    });
    return response.data;
  }

  /**
   * Remove story from highlight
   */
  public async removeStoryFromHighlight(
    highlightId: string,
    storyId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/stories/highlights/${highlightId}/remove-story/${storyId}`);
    return response.data;
  }

  /**
   * Update highlight
   */
  public async updateHighlight(
    highlightId: string,
    data: {
      title?: string;
      coverImage?: string;
    }
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.put(`/stories/highlights/${highlightId}`, data);
    return response.data;
  }

  /**
   * Delete highlight
   */
  public async deleteHighlight(highlightId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/stories/highlights/${highlightId}`);
    return response.data;
  }

  // ===========================
  // Helper Methods
  // ===========================

  /**
   * Check if a story has expired
   */
  public isStoryExpired(story: IStory): boolean {
    const expiresAt = new Date(story.expiresAt);
    return expiresAt < new Date();
  }

  /**
   * Calculate time remaining for a story
   */
  public getTimeRemaining(story: IStory): string {
    const expiresAt = new Date(story.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();

    if (diffMs <= 0) return "منقضی شده";

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours} ساعت باقی‌مانده`;
    }
    return `${diffMinutes} دقیقه باقی‌مانده`;
  }

  /**
   * Format story time ago
   */
  public getStoryTimeAgo(dateString: Date | string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "لحظاتی پیش";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقیقه پیش`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ساعت پیش`;
    return `${Math.floor(seconds / 86400)} روز پیش`;
  }

  /**
   * Get story privacy label
   */
  public getPrivacyLabel(privacy: StoryPrivacy): string {
    const labels: Record<StoryPrivacy, string> = {
      public: "عمومی",
      followers: "دنبال‌کنندگان",
      close_friends: "دوستان نزدیک",
      custom: "سفارشی",
    };
    return labels[privacy];
  }

  /**
   * Get story privacy icon
   */
  public getPrivacyIcon(privacy: StoryPrivacy): string {
    const icons: Record<StoryPrivacy, string> = {
      public: "🌐",
      followers: "/icons/user.svg",
      close_friends: "⭐",
      custom: "🔒",
    };
    return icons[privacy];
  }
}

// Export singleton instance
const storyService = new StoryService();
export default storyService;
