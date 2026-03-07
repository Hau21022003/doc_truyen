export const CHAPTER_COLUMNS = {
  SLUG: "slug",
  CHAPTER_NUMBER: "chapterNumber",
  STATUS: "status",
  PUBLISHED_AT: "publishedAt",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export type ChapterColumn =
  (typeof CHAPTER_COLUMNS)[keyof typeof CHAPTER_COLUMNS];

// Chapter status
export const CHAPTER_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type ChapterStatus =
  (typeof CHAPTER_STATUS)[keyof typeof CHAPTER_STATUS];

export const CHAPTER_STATUS_VALUES = Object.values(CHAPTER_STATUS) as [
  ChapterStatus,
  ...ChapterStatus[],
];

// Chapter Content type
export const CHAPTER_CONTENT_TYPE = {
  TEXT: "text",
  IMAGE: "image",
} as const;

export type ChapterContentType =
  (typeof CHAPTER_CONTENT_TYPE)[keyof typeof CHAPTER_CONTENT_TYPE];

export const CHAPTER_CONTENT_TYPE_VALUES = Object.values(
  CHAPTER_CONTENT_TYPE,
) as [ChapterContentType, ...ChapterContentType[]];

// Sortable columns
export const CHAPTER_SORTABLE_COLUMNS = {
  TITLE: "title",
  CHAPTER_NUMBER: "chapterNumber",
  STATUS: "status",
  PUBLISHED_AT: "publishedAt",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export type ChapterSortableColumn =
  (typeof CHAPTER_SORTABLE_COLUMNS)[keyof typeof CHAPTER_SORTABLE_COLUMNS];

export const CHAPTER_SORTABLE_COLUMN_VALUES = Object.values(
  CHAPTER_SORTABLE_COLUMNS,
) as [ChapterSortableColumn, ...ChapterSortableColumn[]];

const SORTABLE_COLUMNS = new Set(CHAPTER_SORTABLE_COLUMN_VALUES);

export const isChapterSortableColumn = (column: ChapterColumn) =>
  SORTABLE_COLUMNS.has(column as ChapterSortableColumn);

export const CHAPTER_FILTER_KEYS = {
  SEARCH: "search",
  STATUS: "status",
  STORY_ID: "storyId",
  UPDATED_AT: "updatedAt",
} as const;
