// features/views/chapter-reading/components/chapter-reading-sticky-navigator.tsx
"use client";

import { Chapter } from "@/features/data/chapter/chapter.types";
import { useStickyNavigator } from "../hooks/use-sticky-navigator";
import { ChapterReadingNavigator } from "./chapter-reading-navigator";

interface ChapterReadingStickyNavigatorProps {
  chapter: Chapter;
  currentChapterNumber: number;
  threshold?: number;
}

export function ChapterReadingStickyNavigator({
  chapter,
  currentChapterNumber,
  threshold = 200,
}: ChapterReadingStickyNavigatorProps) {
  const { isVisible } = useStickyNavigator({ threshold });

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom">
      {/* Overlay background */}
      <div className="bg-background/95 backdrop-blur border-t">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ChapterReadingNavigator
            chapter={chapter}
            currentChapterNumber={currentChapterNumber}
          />
        </div>
      </div>
    </div>
  );
}
