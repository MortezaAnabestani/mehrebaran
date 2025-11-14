import api from "@/lib/api";
import { IGallery } from "common-types";

interface GetGalleriesResponse {
  results: number;
  data: IGallery[];
}

interface GetGalleriesParams {
  page?: number;
  limit?: number;
  status?: "draft" | "published";
  sort?: string;
  category?: string;
}

export const getGalleries = async (params: GetGalleriesParams): Promise<GetGalleriesResponse> => {
  try {
    const response = await api.get("/blog/gallery", { params });
    return response.data || { results: 0, data: [] };
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
    return { results: 0, data: [] };
  }
};

export const getGalleryByIdOrSlug = async (identifier: string): Promise<IGallery | null> => {
  try {
    const response = await api.get(`/blog/gallery/${identifier}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch gallery with identifier "${identifier}":`, error);
    return null;
  }
};
