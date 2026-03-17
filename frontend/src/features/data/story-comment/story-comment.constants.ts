export const STORY_COMMENT_COLUMNS = {
  ID: "id",
  STORY_ID: "storyId",
  CHAPTER_ID: "chapterId",
  USER_ID: "userId",
  USER_NAME: "userName",
  USER_AVATAR: "userAvatar",
  GUEST_NAME: "guestName",
  CONTENT: "content",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export type StoryCommentColumn =
  (typeof STORY_COMMENT_COLUMNS)[keyof typeof STORY_COMMENT_COLUMNS];
