"use client";

import CustomButton from "@/components/custom-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chapter } from "@/features/data/chapter/chapter.types";
import { useChapterNavigation } from "../hooks/use-chapter-navigation";

export function ChapterReadingNavigator({
  chapter,
  currentChapterNumber,
}: {
  chapter: Chapter;
  currentChapterNumber: number;
}) {
  const {
    prevChapter,
    nextChapter,
    canGoPrev,
    canGoNext,
    chapters,
    navigateToChapter,
    goToPrev,
    goToNext,
  } = useChapterNavigation({
    chapter,
    currentChapterNumber,
  });

  return (
    <div className="flex justify-between">
      <Select
        onValueChange={(value) => navigateToChapter(Number(value))}
        value={currentChapterNumber.toString()}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Chọn chap" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {chapters.map((chapter) => (
              <SelectItem value={chapter.chapterNumber?.toString() || ""}>
                {`Chap ${chapter.chapterNumber}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <CustomButton
          color="orange"
          onClick={canGoPrev ? goToPrev : undefined}
          disabled={!canGoPrev}
        >
          Prev
        </CustomButton>

        <CustomButton
          color="orange"
          disabled={!canGoNext}
          onClick={canGoNext ? goToNext : undefined}
        >
          Next
        </CustomButton>
      </div>
    </div>
  );
}
