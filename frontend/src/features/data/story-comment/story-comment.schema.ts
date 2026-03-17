import { paginationSchema } from "@/shared/schemas";
import z from "zod";

export const createStoryCommentSchema = z.object({
  storyId: z.number().int().min(1, "Story ID is required"),
  chapterId: z.number().int().positive().optional(),
  content: z.string().trim().min(1, "Content is required").max(1000),
  guestName: z.string().trim().max(50).optional(),
});

export type CreateStoryCommentInput = z.infer<typeof createStoryCommentSchema>;

export const queryStoryCommentsSchema = paginationSchema.extend({
  storyId: z.number().int().min(1, "Story ID is required"),
  chapterId: z.number().int().positive().optional(),
});

export type QueryStoryCommentsInput = z.infer<typeof queryStoryCommentsSchema>;
