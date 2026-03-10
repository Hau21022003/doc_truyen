import { slugSchema } from "@/shared/schemas";
import { queryBaseSchema } from "@/shared/schemas/query-base.schema";
import z from "zod";
import {
  CHAPTER_CONTENT_TYPE_VALUES,
  CHAPTER_STATUS_VALUES,
} from "./chapter.constants";

// Content schema for chapter content
export const chapterContentSchema = z.object({
  contentType: z.enum(CHAPTER_CONTENT_TYPE_VALUES),
  textContent: z.string().trim().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  imageTempId: z.string().nullable().optional(),
});

// Main chapter schema
export const upsertChapterSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: slugSchema,
  chapterNumber: z.number().int().min(1).optional(),
  status: z.enum(CHAPTER_STATUS_VALUES).default("draft").optional(),
  storyId: z.number().int().min(1, "Story ID is required").optional(),
  contents: z.array(chapterContentSchema).optional(),
});

export type ChapterContentInput = z.infer<typeof chapterContentSchema>;
export type UpsertChapterInput = z.infer<typeof upsertChapterSchema>;

// Query schema for chapters
export const chapterQuerySchema = queryBaseSchema.extend({
  status: z.enum(CHAPTER_STATUS_VALUES).nullable().optional(),
});

export type ChapterQueryInput = z.infer<typeof chapterQuerySchema>;
