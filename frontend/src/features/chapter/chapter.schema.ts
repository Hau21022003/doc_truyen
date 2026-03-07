import { SORT_DIRECTION_VALUES, SORT_DIRECTIONS } from "@/shared/constants";
import { paginationSchema, slugSchema } from "@/shared/schemas";
import z from "zod";
import {
  CHAPTER_CONTENT_TYPE_VALUES,
  CHAPTER_STATUS_VALUES,
} from "./chapter.constants";

// Content schema for chapter content
export const chapterContentSchema = z.object({
  contentType: z.enum(CHAPTER_CONTENT_TYPE_VALUES),
  textContent: z.string().trim().min(1).optional(),
  imageUrl: z.string().optional(),
  imageTempId: z.string().optional(),
});

// Main chapter schema
export const upsertChapterSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: slugSchema,
  chapterNumber: z.number().int().min(1).optional(),
  status: z.enum(CHAPTER_STATUS_VALUES).default("draft"),
  storyId: z.number().int().min(1, "Story ID is required"),
  contents: z.array(chapterContentSchema).optional(),
});

export type UpsertChapterInput = z.infer<typeof upsertChapterSchema>;

// Query schema for chapters
export const chapterQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  storyId: z.number().int().min(1).optional(),
  status: z.enum(CHAPTER_STATUS_VALUES).optional(),
  sortBy: z
    .enum(["title", "chapterNumber", "status", "publishedAt", "createdAt"])
    .optional(),
  sortOrder: z
    .enum(SORT_DIRECTION_VALUES)
    .default(SORT_DIRECTIONS.DESC)
    .optional(),
});

export type ChapterQueryInput = z.infer<typeof chapterQuerySchema>;
