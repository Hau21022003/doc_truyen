import { Chapter } from "../chapter/chapter.types";
import { Story } from "../story/story.types";

/**
 * Bookmark entry with story and last read chapter
 */
export interface Bookmark {
  id: number;
  userId: string;
  storyId: number;
  lastReadChapterId: number | null;
  createdAt: string;
  updatedAt: string;
  story: Story;
  lastReadChapter: Chapter | null;
}
