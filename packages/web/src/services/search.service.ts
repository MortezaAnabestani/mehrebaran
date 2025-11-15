import api from "@/lib/api";

export interface SearchResult {
  type: "project" | "news" | "article" | "video" | "gallery" | "focus-area";
  id: string;
  title: string;
  description?: string;
  slug: string;
  coverImage?: any;
  createdAt: Date;
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  results: SearchResult[];
}

export const globalSearch = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Failed to search:", error);
    return {
      query,
      totalResults: 0,
      results: [],
    };
  }
};
