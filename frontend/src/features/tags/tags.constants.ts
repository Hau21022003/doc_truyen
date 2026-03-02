export const TAG_COLUMNS = {
  // ID: "id",
  NAME: "name",
  SLUG: "slug",
  STORY_COUNT: "storyCount",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export type TagColumn = (typeof TAG_COLUMNS)[keyof typeof TAG_COLUMNS];
