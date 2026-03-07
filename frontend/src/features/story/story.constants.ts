export const STORY_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type StoryStatus = (typeof STORY_STATUS)[keyof typeof STORY_STATUS];

export const STORY_STATUS_VALUES = Object.values(STORY_STATUS) as [
  StoryStatus,
  ...StoryStatus[],
];

export const STORY_PROGRESS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  HIATUS: "hiatus",
} as const;

export type StoryProgress =
  (typeof STORY_PROGRESS)[keyof typeof STORY_PROGRESS];

export const STORY_PROGRESS_VALUES = Object.values(STORY_PROGRESS) as [
  StoryProgress,
  ...StoryProgress[],
];

// Columns constants
export const STORY_COLUMNS = {
  TITLE: "title",
  SLUG: "slug",
  DESCRIPTION: "description",
  AUTHOR_NAME: "authorName",
  STATUS: "status",
  PROGRESS: "progress",
  VIEW_COUNT: "viewCount",
  LAST_ADDED_CHAPTER_DATE: "lastAddedChapterDate",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export type StoryColumn = (typeof STORY_COLUMNS)[keyof typeof STORY_COLUMNS];

// Sortable columns
export const STORY_SORTABLE_COLUMNS = {
  TITLE: "title",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  VIEW_COUNT: "viewCount",
  LAST_ADDED_CHAPTER_DATE: "lastAddedChapterDate",
} as const;

export type StorySortableColumn =
  (typeof STORY_SORTABLE_COLUMNS)[keyof typeof STORY_SORTABLE_COLUMNS];

export const STORY_SORTABLE_COLUMN_VALUES = Object.values(
  STORY_SORTABLE_COLUMNS,
) as [StorySortableColumn, ...StorySortableColumn[]];

const SORTABLE_COLUMNS = new Set(STORY_SORTABLE_COLUMN_VALUES);

export const isStorySortableColumn = (column: StoryColumn) =>
  SORTABLE_COLUMNS.has(column as StorySortableColumn);

export const STORY_FILTER_KEYS = {
  SEARCH: "search",
  PROGRESS: "progress",
  STATUS: "status",
  TAGS: "tags",
  UPDATED_AT: "updatedAt",
} as const;
