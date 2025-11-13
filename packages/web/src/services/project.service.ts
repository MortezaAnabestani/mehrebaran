// packages/web/src/services/project.service.ts
import api from "@/lib/api";
import { IProject } from "common-types";

interface GetProjectsResponse {
  results: number;
  data: IProject[];
}

interface GetProjectsParams {
  page?: number;
  limit?: number;
  status?: "active" | "completed";
  sort?: string;
}

export const getProjects = async (params: GetProjectsParams): Promise<GetProjectsResponse> => {
  try {
    const response = await api.get("/projects", { params });
    return response.data || { results: 0, data: [] };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { results: 0, data: [] };
  }
};

export const getProjectByIdOrSlug = async (identifier: string): Promise<IProject | null> => {
  try {
    const response = await api.get(`/projects/${identifier}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch project ${identifier}:`, error);
    return null;
  }
};
