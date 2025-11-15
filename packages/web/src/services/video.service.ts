import api from "@/lib/api";
import { IVideo } from "common-types";

interface GetVideosResponse {
  videos: IVideo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface GetVideosParams {
  page?: number;
  limit?: number;
  status?: "draft" | "published";
  sort?: string;
  category?: string;
}

export const getVideos = async (params: GetVideosParams): Promise<GetVideosResponse> => {
  try {
    const response = await api.get("/blog/videos", { params });
    return response.data || { videos: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return { videos: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
};

export const getVideoByIdOrSlug = async (identifier: string): Promise<IVideo | null> => {
  try {
    const response = await api.get(`/blog/videos/${identifier}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch video with identifier "${identifier}":`, error);
    return null;
  }
};
