import { SORT_DIRECTION_VALUES, SORT_DIRECTIONS } from "@/shared/constants";
import { paginationSchema, slugSchema } from "@/shared/schemas";
import z from "zod";

export const upsertTagSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: slugSchema,
});

export type UpsertTagInput = z.infer<typeof upsertTagSchema>;

export const tagQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sortBy: z.enum(["name", "createdAt", "storyCount"]).optional(),
  sortOrder: z
    .enum(SORT_DIRECTION_VALUES)
    .default(SORT_DIRECTIONS.DESC)
    .optional(),
});

export type TagQueryInput = z.infer<typeof tagQuerySchema>;
