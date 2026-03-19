"use client";

import { IconBookmark, IconCommentFill } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StoryRating from "@/features/data/story/components/story-rating";
import { Story } from "@/features/data/story/story.types";
import { numberUtils } from "@/shared/utils/number.utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";
import { useStoryDetailsActions } from "../hooks/use-story-details-actions";

export function StoryDetailsInfo({ story }: { story: Story }) {
  const tStoryDetails = useTranslations("storyDetails");
  const { addBookmark } = useStoryDetailsActions();

  // Sắp xếp chapters theo chapterNumber để tìm first và last
  const sortedChapters = useMemo(() => {
    if (!story.chapters?.length) return [];
    return [...story.chapters].sort(
      (a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0),
    );
  }, [story.chapters]);

  const firstChapter = sortedChapters[0];
  const lastChapter = sortedChapters[sortedChapters.length - 1];
  const hasChapters = sortedChapters.length > 0;

  return (
    <div className="w-full flex flex-col">
      <img
        src={story.coverImage || ""}
        alt=""
        className="mx-auto w-50 lg:w-full aspect-[3/4] object-cover"
      />

      {/* Right info */}
      <div className="mt-3 px-4 lg:px-0 ">
        <p className="text-lg font-semibold line-clamp-2 " title={story.title}>
          {story.title}
        </p>
        <div className="mt-2">
          <StoryRating story={story} />
        </div>
        {/* Comment count - bookmark count */}
        <div className="flex items-stretch mt-4">
          <div className="flex-1 flex flex-col items-center gap-1">
            <button onClick={() => addBookmark(story.id)}>
              <IconBookmark
                color="custom"
                className="text-primary-orange"
                size={"xl"}
              />
            </button>
            <p className="text-muted-foreground text-center max-w-32">
              {tStoryDetails("bookmarked", {
                count: numberUtils.formatCompactNumber(story.bookmarkCount),
              })}
            </p>
          </div>
          <Separator orientation="vertical" className="min-h-20 w-1" />
          <div className="flex-1 flex flex-col items-center">
            <IconCommentFill
              color="custom"
              className="text-primary-orange"
              size={"xl"}
            />
            <p className="text-muted-foreground text-center">
              {tStoryDetails("comments", {
                count: numberUtils.formatCompactNumber(story.commentCount),
              })}
            </p>
          </div>
        </div>

        {/* buttons */}
        <div className="mt-3 flex gap-4 items-start">
          <Button
            asChild
            className="bg-primary-orange text-primary-orange-foreground hover:text-primary-orange-foreground hover:bg-primary-orange flex-1"
          >
            <Link
              href={
                hasChapters && firstChapter
                  ? `/story/${story.slug}/chapter-${firstChapter.chapterNumber}`
                  : "#"
              }
            >
              {tStoryDetails("readFirst")}
            </Link>
          </Button>
          <Button
            asChild
            className="bg-primary-orange text-primary-orange-foreground hover:text-primary-orange-foreground hover:bg-primary-orange flex-1"
          >
            <Link
              href={
                hasChapters && lastChapter
                  ? `/story/${story.slug}/chapter-${lastChapter.chapterNumber}`
                  : "#"
              }
            >
              {tStoryDetails("readLast")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
