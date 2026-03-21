import { paginationSchema } from "@/shared/schemas";
import { queryBaseSchema } from "@/shared/schemas/query-base.schema";
import z from "zod";
import { COMMENT_REPORT_REASON_VALUES } from "./story-comment.constants";

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

export const reportCommentSchema = z.object({
  reason: z.enum(COMMENT_REPORT_REASON_VALUES),
  description: z.string().min(10).max(500).optional(),
});

export type ReportCommentInput = z.infer<typeof reportCommentSchema>;

export const queryCommentsSchema = queryBaseSchema.extend({
  isFlagged: z.boolean().optional().nullable(),
});

export type QueryCommentsInput = z.infer<typeof queryCommentsSchema>;
