import api from "@/lib/api";
import { IFocusArea } from "common-types";

interface GetFocusAreasResponse {
  results: number;
  data: IFocusArea[];
}

interface GetFocusAreasParams {
  isActive?: boolean;
  sort?: string;
}

export const getFocusAreas = async (
  params: GetFocusAreasParams = {}
): Promise<GetFocusAreasResponse> => {
  try {
    const response = await api.get("/focus-areas", { params });
    return response.data || { results: 0, data: [] };
  } catch (error) {
    console.error("Failed to fetch focus areas:", error);
    return { results: 0, data: [] };
  }
};

export const getFocusAreaById = async (id: string): Promise<IFocusArea | null> => {
  try {
    const response = await api.get(`/focus-areas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch focus area:", error);
    return null;
  }
};
