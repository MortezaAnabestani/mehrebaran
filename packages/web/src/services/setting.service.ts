import api from "@/lib/api";
import { IHomePageHeroSetting, IBlogBackgroundSetting } from "common-types";

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

export const getBlogBackgroundSettings = async (): Promise<IBlogBackgroundSetting | null> => {
  return getSetting("blogBackground");
};
