// shared/constants/tag.constant.ts
export const TAG_COLUMNS = {
  NAME: "name",
  SLUG: "slug",
  STORY_COUNT: "storyCount",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export type TagColumn = (typeof TAG_COLUMNS)[keyof typeof TAG_COLUMNS];

export const TAG_COLUMN_LABELS: Record<TagColumn, string> = {
  [TAG_COLUMNS.NAME]: "Name",
  [TAG_COLUMNS.SLUG]: "Slug",
  [TAG_COLUMNS.STORY_COUNT]: "Story count",
  [TAG_COLUMNS.CREATED_AT]: "Created at",
  [TAG_COLUMNS.UPDATED_AT]: "Updated at",
};
