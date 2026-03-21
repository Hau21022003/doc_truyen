import { Story } from "../story/story.types";
import { User } from "../users/user.types";
import { CommentReportReason } from "./story-comment.constants";

export interface ChapterInComment {
  id: number;
  title: string;
  chapterNumber?: number;
}

export interface StoryComment {
  id: number;
  storyId: number;
  chapterId: number | null;
  chapter: ChapterInComment | null;
  userId: string | null;
  userName: string;
  userAvatar: string | null;
  guestName?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStoryComment {
  id: number;
  storyId: number;
  story?: Story;
  userId: string | null;
  guestName: string;
  user?: User | null;
  content: string;
  isFlagged: boolean;
  flagCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentReport {
  id: number;
  reason: CommentReportReason;
  description: string;
  reporterId: string | null;
  reporter?: User | null;
  createdAt: string;
}

export interface CommentDetail extends AdminStoryComment {
  reports: CommentReport[];
}
