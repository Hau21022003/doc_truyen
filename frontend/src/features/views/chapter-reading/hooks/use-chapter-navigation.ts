// features/views/chapter-reading/hooks/use-chapter-navigation.ts
import { Chapter } from "@/features/data/chapter/chapter.types";
import { useStoryBySlugQuery } from "@/features/data/story/story.query";
import { useRouter } from "@/i18n/navigation";
import { useMemo } from "react";

interface UseChapterNavigationParams {
  chapter: Chapter;
  currentChapterNumber: number;
}

interface ChapterNavigationState {
  prevChapter?: Chapter;
  nextChapter?: Chapter;
  canGoPrev: boolean;
  canGoNext: boolean;
  chapters: Chapter[];
  isLoading: boolean;
}

interface ChapterNavigationActions {
  navigateToChapter: (chapterNumber: number) => void;
  goToPrev: () => void;
  goToNext: () => void;
}

export function useChapterNavigation({
  chapter,
  currentChapterNumber,
}: UseChapterNavigationParams): ChapterNavigationState &
  ChapterNavigationActions {
  const router = useRouter();
  const { data: storyData, isLoading } = useStoryBySlugQuery(
    chapter.story?.slug || "",
  );
  const chapters = storyData?.payload.chapters || [];

  const navigationState = useMemo(() => {
    // 1. Sort chapters theo thứ tự giảm dần
    const sortedChapters = [...chapters].sort(
      (a, b) => (b.chapterNumber ?? 0) - (a.chapterNumber ?? 0),
    );

    // 2. Tìm index của chapter hiện tại
    const currentIndex = sortedChapters.findIndex(
      (c) => c.chapterNumber === currentChapterNumber,
    );

    // 3. Handle edge case
    if (currentIndex === -1) {
      return {
        prevChapter: undefined,
        nextChapter: undefined,
        canGoPrev: false,
        canGoNext: false,
        chapters: sortedChapters,
      };
    }

    // 4. Nếu sort giảm dần:
    // - prevChapter (chapter nhỏ hơn) nằm ở phía sau (index lớn hơn)
    // - nextChapter (chapter lớn hơn) nằm ở phía trước (index nhỏ hơn)
    const canGoPrev = currentIndex < sortedChapters.length - 1;
    const canGoNext = currentIndex > 0;

    return {
      prevChapter: canGoPrev ? sortedChapters[currentIndex + 1] : undefined,
      nextChapter: canGoNext ? sortedChapters[currentIndex - 1] : undefined,
      canGoPrev,
      canGoNext,
      chapters: sortedChapters,
    };
  }, [chapters, currentChapterNumber]);

  const navigateToChapter = (chapterNumber: number) => {
    router.push(`/story/${chapter.story?.slug}/chapter-${chapterNumber}`);
  };

  const goToPrev = () => {
    if (navigationState.prevChapter) {
      navigateToChapter(navigationState.prevChapter.chapterNumber!);
    }
  };

  const goToNext = () => {
    if (navigationState.nextChapter) {
      navigateToChapter(navigationState.nextChapter.chapterNumber!);
    }
  };

  return {
    ...navigationState,
    isLoading,
    navigateToChapter,
    goToPrev,
    goToNext,
  };
}
