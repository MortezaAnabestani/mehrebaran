import api from "@/lib/api";
import { IGallery } from "common-types";

interface GetGalleriesResponse {
  galleries: IGallery[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
    return response.data || { galleries: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
    return { galleries: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
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
