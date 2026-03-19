import z from "zod";

export const dateInputSchema = z.union([
  z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Must be in YYYY-MM-DD format",
  }),
  z.date(),
]);

export const viewStatsQuerySchema = z
  .object({
    from: dateInputSchema,
    to: dateInputSchema,
  })
  .nullable();

export type ViewStatsQuery = z.infer<typeof viewStatsQuerySchema>;
