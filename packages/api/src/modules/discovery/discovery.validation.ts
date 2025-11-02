import { z } from "zod";

// ============= Leaderboard Validation =============

export const getLeaderboardSchema = z.object({
  query: z.object({
    category: z
      .enum([
        "points",
        "contributions",
        "needs_created",
        "needs_supported",
        "badges",
        "level",
        "tasks_completed",
        "teams_created",
      ])
      .optional(),
    period: z.enum(["daily", "weekly", "monthly", "all_time"]).optional(),
    limit: z
      .string()
      .optional()
      .refine((val) => !val || (parseInt(val) > 0 && parseInt(val) <= 500), {
        message: "تعداد باید بین 1 تا 500 باشد.",
      }),
  }),
});

export const getUserRankSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست."),
  }),
  query: z.object({
    category: z
      .enum([
        "points",
        "contributions",
        "needs_created",
        "needs_supported",
        "badges",
        "level",
        "tasks_completed",
        "teams_created",
      ])
      .optional(),
    period: z.enum(["daily", "weekly", "monthly", "all_time"]).optional(),
  }),
});

export const getNearbyUsersSchema = z.object({
  query: z.object({
    category: z
      .enum([
        "points",
        "contributions",
        "needs_created",
        "needs_supported",
        "badges",
        "level",
        "tasks_completed",
        "teams_created",
      ])
      .optional(),
    period: z.enum(["daily", "weekly", "monthly", "all_time"]).optional(),
    range: z
      .string()
      .optional()
      .refine((val) => !val || (parseInt(val) > 0 && parseInt(val) <= 50), {
        message: "محدوده باید بین 1 تا 50 باشد.",
      }),
  }),
});

export const getTopUsersSchema = z.object({
  query: z.object({
    category: z
      .enum([
        "points",
        "contributions",
        "needs_created",
        "needs_supported",
        "badges",
        "level",
        "tasks_completed",
        "teams_created",
      ])
      .optional(),
    period: z.enum(["daily", "weekly", "monthly", "all_time"]).optional(),
    limit: z
      .string()
      .optional()
      .refine((val) => !val || (parseInt(val) > 0 && parseInt(val) <= 100), {
        message: "تعداد باید بین 1 تا 100 باشد.",
      }),
  }),
});

export const getMultipleCategoryLeaderboardsSchema = z.object({
  query: z.object({
    categories: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const cats = val.split(",").map((c) => c.trim());
          const validCats = [
            "points",
            "contributions",
            "needs_created",
            "needs_supported",
            "badges",
            "level",
            "tasks_completed",
            "teams_created",
          ];
          return cats.every((c) => validCats.includes(c));
        },
        {
          message: "دسته‌بندی‌های نامعتبر.",
        }
      ),
    period: z.enum(["daily", "weekly", "monthly", "all_time"]).optional(),
    limit: z
      .string()
      .optional()
      .refine((val) => !val || (parseInt(val) > 0 && parseInt(val) <= 100), {
        message: "تعداد باید بین 1 تا 100 باشد.",
      }),
  }),
});

// ============= Trending Validation =============

export const getTrendingSchema = z.object({
  query: z.object({
    period: z.enum(["1h", "6h", "24h", "7d", "30d"]).optional(),
    limit: z
      .string()
      .optional()
      .refine((val) => !val || (parseInt(val) > 0 && parseInt(val) <= 100), {
        message: "تعداد باید بین 1 تا 100 باشد.",
      }),
  }),
});

// ============= Recommendations Validation =============

export const recommendNeedsSchema = z.object({
  query: z.object({
    strategy: z
      .enum(["collaborative", "content_based", "hybrid", "popular", "trending", "personalized"])
      .optional(),
    limit: z
      .string()
      .optional()
      .refine((val) => !val || (parseInt(val) > 0 && parseInt(val) <= 100), {
        message: "تعداد باید بین 1 تا 100 باشد.",
      }),
  }),
});

export const recommendUsersSchema = z.object({
  query: z.object({
    limit: z
      .string()
      .optional()
      .refine((val) => !val || (parseInt(val) > 0 && parseInt(val) <= 100), {
        message: "تعداد باید بین 1 تا 100 باشد.",
      }),
  }),
});

export const recommendTeamsSchema = z.object({
  query: z.object({
    limit: z
      .string()
      .optional()
      .refine((val) => !val || (parseInt(val) > 0 && parseInt(val) <= 100), {
        message: "تعداد باید بین 1 تا 100 باشد.",
      }),
  }),
});

export const discoveryValidation = {
  getLeaderboardSchema,
  getUserRankSchema,
  getNearbyUsersSchema,
  getTopUsersSchema,
  getMultipleCategoryLeaderboardsSchema,
  getTrendingSchema,
  recommendNeedsSchema,
  recommendUsersSchema,
  recommendTeamsSchema,
};
