"use client";

import { IconBookmark, IconCommentFill } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StoryRating from "@/features/data/story/components/story-rating";
import { Story } from "@/features/data/story/story.types";
import { numberUtils } from "@/shared/utils/number.utils";
import { useTranslations } from "next-intl";

export function StoryDetailsInfo({ story }: { story: Story }) {
  // const t = useTranslations();
  const tStoryDetails = useTranslations("storyDetails");

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
            <IconBookmark
              color="custom"
              className="text-primary-orange"
              size={"xl"}
            />
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
          <Button className="bg-primary-orange text-primary-orange-foreground hover:text-primary-orange-foreground hover:bg-primary-orange flex-1">
            {tStoryDetails("readFirst")}
          </Button>
          <Button className="bg-primary-orange text-primary-orange-foreground hover:text-primary-orange-foreground hover:bg-primary-orange flex-1">
            {tStoryDetails("readLast")}
          </Button>
        </div>
      </div>
    </div>
  );
}
