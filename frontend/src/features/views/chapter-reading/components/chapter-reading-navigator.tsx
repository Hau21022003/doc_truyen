"use client";

import CustomButton from "@/components/custom-button";
import { IconArrowLeft, IconHamburger } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    <div className="flex justify-center">
      <div className="w-full flex items-center justify-center gap-2">
        <CustomButton
          color="orange"
          onClick={canGoPrev ? goToPrev : undefined}
          disabled={!canGoPrev}
          className="flex-1 max-w-40 rounded-2xl rounded-tr-none rounded-br-none"
        >
          <IconArrowLeft size={"sm"} color="custom" />
          Prev
        </CustomButton>

        <Popover>
          <PopoverTrigger asChild>
            <button>
              <IconHamburger size={"lg"} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="p-2 w-64 max-h-80 overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {chapters.map((chap) => {
                const isActive = chap.chapterNumber === currentChapterNumber;

                return (
                  <button
                    key={chap.chapterNumber}
                    onClick={() => {
                      if (chap.chapterNumber) {
                        navigateToChapter(chap.chapterNumber);
                      }
                    }}
                    className={`text-left px-3 py-2 rounded-md text-sm transition
              ${isActive ? "bg-orange-500 text-white" : "hover:bg-muted"}
            `}
                  >
                    {`Chap ${chap.chapterNumber}`}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <CustomButton
          color="orange"
          disabled={!canGoNext}
          onClick={canGoNext ? goToNext : undefined}
          className="flex-1 max-w-40 rounded-2xl rounded-tl-none rounded-bl-none"
        >
          Next
          <IconArrowLeft className="rotate-180" size={"sm"} color="custom" />
        </CustomButton>
      </div>
    </div>
  );
}
