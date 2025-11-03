import { z } from "zod";

// Simple validation schemas compatible with Zod 4

export const getNotificationsSchema = z.object({
  query: z.object({
    type: z.string().optional(),
    isRead: z.string().optional(),
    limit: z.string().optional(),
    skip: z.string().optional(),
  }),
});

export const getGroupedNotificationsSchema = z.object({
  query: z.object({
    limit: z.string().optional(),
  }),
});

export const notificationIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    channels: z.any().optional(),
    typeSettings: z.any().optional(),
    quietHours: z.any().optional(),
    emailDigest: z.any().optional(),
    muteAll: z.boolean().optional(),
    muteAllUntil: z.string().optional(),
  }),
});

export const toggleChannelSchema = z.object({
  body: z.object({
    channel: z.string(),
    enabled: z.boolean(),
  }),
});

export const muteTypeSchema = z.object({
  body: z.object({
    type: z.string(),
  }),
});

export const toggleGlobalMuteSchema = z.object({
  body: z.object({
    mute: z.boolean(),
    muteUntil: z.string().optional(),
  }),
});

export const registerPushTokenSchema = z.object({
  body: z.object({
    token: z.string(),
    platform: z.string(),
    deviceId: z.string().optional(),
  }),
});

export const pushTokenParamSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
});
