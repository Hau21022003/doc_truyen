"use client";
import { Rating } from "@/components/rating";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { dateUtils } from "@/shared/utils";
import { imageUtils } from "@/shared/utils/image.utils";
import { useLocale } from "next-intl";
import Link from "next/link";
import { HomepageStory } from "../../story/story.types";

interface StoryGridProps {
  stories: HomepageStory[];
}

export function HomepageStoryGrid({ stories }: StoryGridProps) {
  const locale = useLocale() as (typeof SUPPORTED_LOCALES)[number];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {stories.map((story) => (
        <div key={story.id} className="mb-7.5 flex items-start gap-2">
          <Link href={`/story/${story.slug}`}>
            <img
              src={
                story.coverImage
                  ? imageUtils.optimizeCloudinary(story.coverImage, {
                      width: 110,
                      height: 150,
                    })
                  : ""
              }
              alt={`CoverImage_${story.id}`}
              className="shrink-0 object-cover"
              style={{ width: 110, height: 150 }}
            />
          </Link>

          <div className="flex-1 min-w-0">
            <Link href={`/story/${story.slug}`}>
              <h3 className="font-semibold uppercase line-clamp-2">
                {story.title}
              </h3>
            </Link>
            <Rating
              value={story.averageRating}
              size="lg"
              showValue
              className="mt-1"
            />
            <ul className="mt-2 space-y-2">
              {story.chapters.slice(0, 2).map((chapter) => (
                <li key={chapter.id} className="flex items-center gap-4">
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="font-medium uppercase hover:bg-primary-orange dark:hover:bg-primary-orange hover:text-primary-orange-foreground"
                    asChild
                  >
                    <Link href={`/story/${story.slug}/chapter/${chapter.id}`}>
                      {`Chap ${chapter.chapterNumber}`}
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {dateUtils.formatSmartDate(chapter.publishedAt, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
