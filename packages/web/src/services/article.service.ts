import api from "@/lib/api";
import { IArticle } from "common-types";

interface GetArticlesResponse {
  results: number;
  data: IArticle[];
}

interface GetArticlesParams {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
  sort?: string;
  category?: string;
}

export const getArticles = async (params: GetArticlesParams): Promise<GetArticlesResponse> => {
  try {
    const response = await api.get("/articles", { params });
    return response.data || { results: 0, data: [] };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return { results: 0, data: [] };
  }
};

export const getArticleByIdOrSlug = async (identifier: string): Promise<IArticle | null> => {
  try {
    const response = await api.get(`/articles/${identifier}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch article with identifier "${identifier}":`, error);
    return null;
  }
};
