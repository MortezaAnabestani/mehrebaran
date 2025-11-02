import api from "@/lib/api";
import { IComment } from "common-types";

export const getCommentsByPost = async (postId: string): Promise<IComment[]> => {
  try {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Failed to fetch comments for post ${postId}:`, error);
    return [];
  }
};

interface CreateCommentData {
  content: string;
  post: string;
  postType: "News" | "Article";
  guestName?: string;
  guestEmail?: string;
  parent?: string;
}

export const createComment = async (data: CreateCommentData): Promise<IComment | null> => {
  try {
    const response = await api.post("/comments", data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
};
