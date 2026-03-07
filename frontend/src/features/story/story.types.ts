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
  createdAt: string;
  updatedAt: string;
  tags?: StoryTag[];
  chapters?: StoryChapter[];
}

export interface StoryTag {
  id: number;
  name: string;
  slug: string;
}

export interface StoryChapter {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
