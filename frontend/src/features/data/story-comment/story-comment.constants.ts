export const COMMENT_REPORT_REASON = {
  SPAM: "spam",
  OFFENSIVE: "offensive",
  INAPPROPRIATE: "inappropriate",
  HARASSMENT: "harassment",
  MISINFORMATION: "misinformation",
  OTHER: "other",
};

export const COMMENT_REPORT_REASON_VALUES = Object.values(
  COMMENT_REPORT_REASON,
) as [CommentReportReason, ...CommentReportReason[]];

export type CommentReportReason =
  (typeof COMMENT_REPORT_REASON)[keyof typeof COMMENT_REPORT_REASON];

export const COMMENT_COLUMNS = {
  STORY_TITLE: "storyTitle",
  USER_NAME: "userName",
  CONTENT: "content",
  // IS_FLAGGED: "isFlagged",
  FLAG_COUNT: "flagCount",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export type CommentColumn =
  (typeof COMMENT_COLUMNS)[keyof typeof COMMENT_COLUMNS];

export const COMMENT_SORTABLE_COLUMNS = [
  COMMENT_COLUMNS.CREATED_AT,
  COMMENT_COLUMNS.UPDATED_AT,
  COMMENT_COLUMNS.FLAG_COUNT,
];
export const isCommentSortableColumn = (
  column: string,
): column is CommentColumn => {
  return COMMENT_SORTABLE_COLUMNS.includes(column as any);
};
