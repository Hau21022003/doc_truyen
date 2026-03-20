export const USER_ROLE = {
  READER: "reader",
  CONTENT_ADMIN: "content_admin",
  SYSTEM_ADMIN: "system_admin",
} as const;

export const USER_ROLE_VALUES = Object.values(USER_ROLE) as [
  UserRole,
  ...UserRole[],
];

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_COLUMNS = {
  NAME: "name",
  EMAIL: "email",
  ROLE: "role",
  IS_ACTIVE: "isActive",
  LAST_LOGIN_AT: "lastLoginAt",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export type UserColumn = (typeof USER_COLUMNS)[keyof typeof USER_COLUMNS];

// Sortable columns
export const USER_SORTABLE_COLUMNS = [
  "name",
  "createdAt",
  "updatedAt",
] as const;

export type UserSortableColumn = (typeof USER_SORTABLE_COLUMNS)[number];

const SORTABLE_COLUMNS: Set<string> = new Set(USER_SORTABLE_COLUMNS);

export const isUserSortableColumn = (column: string) =>
  SORTABLE_COLUMNS.has(column);

// const SORTABLE_COLUMNS = new Set(USER_SORTABLE_COLUMNS);

// export const isUserSortableColumn = (column: UserSortableColumn) =>
//   SORTABLE_COLUMNS.has(column);
