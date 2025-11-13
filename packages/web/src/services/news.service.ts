import api from "@/lib/api";
import { INews } from "common-types";

interface GetNewsResponse {
  results: number;
  data: INews[];
}

interface GetNewsParams {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
  sort?: string;
}

export const getNews = async (params: GetNewsParams): Promise<GetNewsResponse> => {
  try {
    const response = await api.get("/news", { params });
    return response.data || { results: 0, data: [] };
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return { results: 0, data: [] };
  }
};

export const getNewsByIdOrSlug = async (identifier: string): Promise<INews | null> => {
  try {
    const response = await api.get(`/news/${identifier}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return null;
  }
};
