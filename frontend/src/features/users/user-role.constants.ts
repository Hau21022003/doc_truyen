export const USER_ROLE = {
  READER: "reader",
  CONTENT_ADMIN: "content_admin",
  SYSTEM_ADMIN: "system_admin",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
