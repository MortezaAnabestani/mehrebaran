import api from "@/lib/api";
import { IHomePageHeroSetting } from "common-types";

export const getSetting = async (key: string): Promise<any | null> => {
  try {
    const response = await api.get(`/settings/${key}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch setting for key "${key}":`, error);
    return null;
  }
};

export const getHomePageHeroSettings = async (): Promise<IHomePageHeroSetting | null> => {
  return getSetting("homePageHero");
};
