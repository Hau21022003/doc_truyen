import { slugSchema } from "@/shared/schemas";
import { queryBaseSchema } from "@/shared/schemas/query-base.schema";
import z from "zod";
import {
  STORY_PROGRESS_VALUES,
  STORY_SORTABLE_COLUMN_VALUES,
  STORY_STATUS_VALUES,
} from "./story.constants";

export const upsertStorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  coverImageTempId: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(), // Hỗ trợ hiển thị
  authorName: z
    .string()
    .max(100, "Author name must be less than 100 characters"),
  status: z.enum(STORY_STATUS_VALUES).optional(),
  progress: z.enum(STORY_PROGRESS_VALUES).optional(),
  tagIds: z.array(z.number()).default([]).optional(),
});

export type UpsertStoryInput = z.infer<typeof upsertStorySchema>;

export const storyQuerySchema = queryBaseSchema.extend({
  status: z.enum(STORY_STATUS_VALUES).nullable().optional(),
  progress: z.enum(STORY_PROGRESS_VALUES).nullable().optional(),
  tagIds: z.array(z.number()).optional(),
  sortBy: z.enum(STORY_SORTABLE_COLUMN_VALUES).optional(),
});

export type StoryQueryInput = z.infer<typeof storyQuerySchema>;
