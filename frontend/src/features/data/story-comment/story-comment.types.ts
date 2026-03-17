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
