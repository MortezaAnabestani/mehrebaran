import api from "@/lib/api";
import { IVideo } from "common-types";

interface GetVideosResponse {
  results: number;
  data: IVideo[];
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
    return response.data || { results: 0, data: [] };
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return { results: 0, data: [] };
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
