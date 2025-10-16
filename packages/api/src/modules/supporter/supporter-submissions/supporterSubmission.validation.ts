import { z } from "zod";

const responsiveImageSchema = z.object({
  desktop: z.string().url(),
  mobile: z.string().url(),
});

export const createSubmissionSchema = z.object({
  params: z.object({
    needId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: z.object({
    image: responsiveImageSchema,
    caption: z.string().optional(),
  }),
});

export const updateSubmissionStatusSchema = z.object({
  params: z.object({
    submissionId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: z.object({
    status: z.enum(["approved", "rejected"]),
  }),
});
