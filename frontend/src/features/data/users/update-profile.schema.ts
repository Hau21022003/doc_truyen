import { Timezone } from "@/shared/constants";
import { queryBaseSchema } from "@/shared/schemas/query-base.schema";
import z from "zod";
import { USER_ROLE_VALUES } from "./user-role.constants";

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

export const queryUsersSchema = queryBaseSchema.extend({
  role: z.enum(USER_ROLE_VALUES).optional().nullable(),
});

export type QueryUsersInput = z.infer<typeof queryUsersSchema>;
