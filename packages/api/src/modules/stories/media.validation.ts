import { z } from "zod";

// Simple validation schemas compatible with Zod 4

export const uploadMediaSchema = z.object({
  body: z.object({
    category: z.string(),
    relatedModel: z.string().optional(),
    relatedId: z.string().optional(),
    isPublic: z.string().optional(),
    altText: z.string().optional(),
    caption: z.string().optional(),
    generateThumbnails: z.string().optional(),
  }),
});

export const mediaIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const getUserMediaSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  query: z.object({
    category: z.string().optional(),
    limit: z.string().optional(),
    skip: z.string().optional(),
  }),
});

export const getRelatedMediaSchema = z.object({
  params: z.object({
    model: z.string(),
    id: z.string(),
  }),
});
