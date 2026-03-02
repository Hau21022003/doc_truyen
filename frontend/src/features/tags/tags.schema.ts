import { paginationSchema, slugSchema } from "@/shared/schemas";
import z from "zod";

export const createTagSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: slugSchema,
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema.partial();

export type UpdateTagInput = z.infer<typeof updateTagSchema>;

export const tagQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sortBy: z.enum(["name", "createdAt", "storyCount"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
});

export type TagQueryInput = z.infer<typeof tagQuerySchema>;
