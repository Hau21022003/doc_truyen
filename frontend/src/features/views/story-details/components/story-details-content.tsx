"use client";

import { ExpandableText } from "@/components/expandable-text";
import {
  IconArrowDown,
  IconArrowUp,
  IconStarFourFill,
} from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import StoryCommentForm from "@/features/data/story-comment/components/story-comment-form";
import StoryCommentList from "@/features/data/story-comment/components/story-comment-list";
import { Story } from "@/features/data/story/story.types";
import { SORT_DIRECTIONS } from "@/shared/constants";
import { dateUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useChapterSort } from "../hooks/use-chapter-sort";

export function StoryDetailsContent({ story }: { story: Story }) {
  const tStoryDetails = useTranslations("storyDetails");
  const tStory = useTranslations("story");
  const { chapterSort, toggleChapterSort } = useChapterSort();

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-y-2 text-sm">
        <p className="font-medium">{tStoryDetails("rating")}</p>
        <p className="text-muted-foreground">
          {tStoryDetails("ratingSummary", {
            // avg: story.averageRating,
            avg: story.averageRating.toFixed(1),
            count: story.ratingCount,
          })}
        </p>

        <p className="font-medium">{tStoryDetails("genre")}</p>
        <p className="text-muted-foreground">
          {story.tags?.map((tag) => tag.name).join(", ")}
        </p>

        <p className="font-medium">{tStoryDetails("status")}</p>
        <p className="text-muted-foreground">
          {tStory(`progressConstants.${story.progress}`)}
        </p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <IconStarFourFill color="custom" className="text-primary-orange" />
          <p className="uppercase font-medium text-lg">
            {tStoryDetails("summary")}
          </p>
        </div>

        <Separator />

        <ExpandableText
          text={story.description || ""}
          maxLength={300}
          showCharCount={false}
        />
      </section>

      {/* Chaps */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <IconStarFourFill color="custom" className="text-primary-orange" />

          <button
            onClick={toggleChapterSort}
            className="flex items-center gap-2"
          >
            <p className="uppercase font-medium text-lg">
              {tStoryDetails("tableOfContents")}
            </p>
            {chapterSort === SORT_DIRECTIONS.ASC ? (
              <IconArrowDown color="custom" />
            ) : (
              <IconArrowUp color="custom" />
            )}
          </button>
        </div>

        <Separator />

        {story.chapters && (
          <ul>
            {story.chapters.map((chapter, chapterIndex) => (
              <>
                <li
                  className="h-14 flex justify-between items-center"
                  key={chapter.id}
                >
                  <Link
                    href={`/story/${story.slug}/chapter-${chapter.chapterNumber}`}
                    className="uppercase text-sm font-medium hover:text-primary-orange"
                  >
                    {tStoryDetails("chapter", {
                      number: chapter.chapterNumber || "",
                    })}
                  </Link>

                  <p className="text-sm text-muted-foreground">
                    {dateUtils.formatSmartDate(chapter.publishedAt)}
                  </p>
                </li>
                {chapterIndex !== story.chapters!.length - 1 && <Separator />}
              </>
            ))}
          </ul>
        )}
      </section>

      {/* Comment */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <IconStarFourFill color="custom" className="text-primary-orange" />
          <p className="uppercase font-medium text-lg">
            {tStoryDetails("discussion")}
          </p>
        </div>

        <Separator />

        <StoryCommentForm storyId={story.id} />

        <StoryCommentList storyId={story.id} />
      </section>
    </div>
  );
}
