import { Chapter } from "../chapter/chapter.types";
import { StoryProgress, StoryStatus } from "./story.constants";

export interface Story {
  id: number;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string | null;
  authorName: string;
  status: StoryStatus;
  progress: StoryProgress;
  lastAddedChapterDate?: string;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  commentCount: number;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: StoryTag[];
  chapters?: Chapter[];
}

export interface StoryTag {
  id: number;
  name: string;
  slug: string;
}

export interface HomepageStory extends Omit<Story, "tags" | "chapters"> {
  tags: StoryTag[];
  chapters: Chapter[];
}

export type HomeStoryQuery = {
  page?: number;
  search?: string;
  tags?: string[];
};

export interface RateStoryResponse {
  storyId: number;
  userRating: number;
  averageRating: number;
  ratingCount: number;
}
