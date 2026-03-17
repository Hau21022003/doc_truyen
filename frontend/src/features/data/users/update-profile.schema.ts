import { Timezone } from "@/shared/constants";
import z from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  timezone: z.enum(Timezone, "Timezone is not valid").optional(),
  enableStoryNotifications: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
