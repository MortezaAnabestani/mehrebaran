import { z } from "zod";

// Simple validation schemas compatible with Zod 4

export const createStorySchema = z.object({
  body: z.object({
    type: z.enum(["image", "video", "text"]),
    mediaId: z.string().optional(),
    text: z.string().optional(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    fontFamily: z.string().optional(),
    caption: z.string().optional(),
    privacy: z.enum(["public", "followers", "close_friends", "custom"]).optional(),
    allowedUsers: z.array(z.string()).optional(),
    linkedNeedId: z.string().optional(),
    linkedUrl: z.string().optional(),
    allowReplies: z.boolean().optional(),
    allowSharing: z.boolean().optional(),
    expiresAt: z.string().optional(),
  }),
});

export const viewStorySchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    viewDuration: z.number().optional(),
  }),
});

export const addReactionSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    emoji: z.string(),
  }),
});

export const storyIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export const createHighlightSchema = z.object({
  body: z.object({
    title: z.string(),
    coverImage: z.string(),
    storyIds: z.array(z.string()).optional(),
  }),
});

export const addStoryToHighlightSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    storyId: z.string(),
  }),
});

export const removeStoryFromHighlightSchema = z.object({
  params: z.object({
    id: z.string(),
    storyId: z.string(),
  }),
});

export const updateHighlightSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().optional(),
    coverImage: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const highlightIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
