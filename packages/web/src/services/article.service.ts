import api from "@/lib/api";
import { IArticle } from "common-types";

interface GetArticlesResponse {
  articles: IArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
    const response = await api.get("/blog/articles", { params });
    return response.data || { articles: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return { articles: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
};

export const getArticleByIdOrSlug = async (identifier: string): Promise<IArticle | null> => {
  try {
    const response = await api.get(`/blog/articles/${identifier}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch article with identifier "${identifier}":`, error);
    return null;
  }
};
