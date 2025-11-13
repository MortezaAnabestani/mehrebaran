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
  console.log("🔍 [getNewsByIdOrSlug] Called with identifier:", identifier);
  try {
    const url = `/news/${identifier}`;
    console.log("🔍 [getNewsByIdOrSlug] API URL:", url);
    const response = await api.get(url);
    console.log("🔍 [getNewsByIdOrSlug] Response status:", response.status);
    return response.data.data;
  } catch (error: any) {
    console.error(`❌ Failed to fetch news with identifier "${identifier}":`, error.response?.status, error.message);
    return null;
  }
};
