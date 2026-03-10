import { ChapterContentType, ChapterStatus } from "./chapter.constants";

export interface ChapterContent {
  id: number;
  position: number;
  contentType: ChapterContentType;
  textContent?: string;
  imageUrl?: string;
}

export interface Chapter {
  id: number;
  title: string;
  slug: string;
  chapterNumber?: number;
  status: ChapterStatus;
  publishedAt?: string;
  storyId: number;
  createdAt: string;
  updatedAt: string;
  contents?: ChapterContent[];
}

export interface ChapterWithContent extends Chapter {
  contents: ChapterContent[];
}
