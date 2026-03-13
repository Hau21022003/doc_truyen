import { paginationSchema } from "@/shared/schemas";
import z from "zod";

export const createBookmarkSchema = z.object({
  storyId: z.number().int().min(1, "Story ID is required"),
  lastReadChapterId: z.number().int().positive().optional().nullable(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;

export const bookmarkQuerySchema = paginationSchema;

export type BookmarkQueryInput = z.infer<typeof bookmarkQuerySchema>;
