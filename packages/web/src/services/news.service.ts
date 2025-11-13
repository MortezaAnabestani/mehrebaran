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
  console.log("🔍 [Service] getNewsByIdOrSlug called with:", identifier);
  try {
    const url = `/news/${identifier}`;
    console.log("🔍 [Service] Full API URL:", url);
    const response = await api.get(url);
    console.log("🔍 [Service] Success! Status:", response.status);
    return response.data.data;
  } catch (error: any) {
    console.error(`❌ [Service] Failed with identifier "${identifier}":`);
    console.error("❌ Status:", error.response?.status);
    console.error("❌ Message:", error.message);
    console.error("❌ URL:", error.config?.url);
    return null;
  }
};
