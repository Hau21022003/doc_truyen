import { Chapter } from "../chapter/chapter.types";
import { Story } from "../story/story.types";

/**
 * Reading history entry with full story and chapter details
 */
export interface ReadingHistory {
  id: number;
  userId: string;
  storyId: number;
  chapterId: number;
  createdAt: string;
  updatedAt: string;
  story: Story;
  chapter: Chapter;
}
