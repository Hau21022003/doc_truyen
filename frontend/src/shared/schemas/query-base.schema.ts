import z from "zod";
import { SORT_DIRECTION_VALUES, SORT_DIRECTIONS } from "../constants";
import { paginationSchema } from "./pagination.schema";

export const queryBaseSchema = paginationSchema.extend({
  // cho các query parameters cơ bản
  search: z.string().trim().nullable().optional(),
  // cho sorting
  sortBy: z.string().optional(),
  sortOrder: z
    .enum(SORT_DIRECTION_VALUES)
    .default(SORT_DIRECTIONS.DESC)
    .optional(),
  //cho date range filtering
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),
  timezone: z.string().default("UTC").optional(),
});

export type QueryBaseInput = z.infer<typeof queryBaseSchema>;
