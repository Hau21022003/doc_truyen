"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllTagsQuery } from "@/features/data/tags/tags.query";
import { cn } from "@/lib/utils";
import { stringUtils } from "@/shared/utils";
import { useHomepageFilters } from "../hooks/use-homepage-filters";

interface HomepageMobileTagsFilterProps {
  className?: string;
}
export function HomepageMobileTagsFilter({
  className = "",
}: HomepageMobileTagsFilterProps) {
  const { data: tagsData, isLoading: isTagsLoading } = useAllTagsQuery();

  const tags = tagsData?.payload || [];
  const displayTags = tags.filter((tag) => tag.isFeatured);

  const { tags: activeTags, toggleTag } = useHomepageFilters();

  return (
    <section
      className={cn(
        "w-full flex items-center gap-2 overflow-x-scroll",
        className,
      )}
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE + Edge
      }}
    >
      {isTagsLoading &&
        Array.from({ length: 10 }).map((_, i) => {
          const randomWidth = Math.floor(Math.random() * 60) + 60; // 60px -> 120px

          return (
            <Skeleton
              key={i}
              className="h-8 shrink-0"
              style={{ width: `${randomWidth}px` }}
            />
          );
        })}
      {displayTags.map((tag) => {
        const isActive = activeTags.includes(tag.slug);
        return (
          <Button
            onClick={() => toggleTag(tag.slug)}
            className={cn(
              isActive &&
                "bg-primary-orange/80 hover:bg-primary-orange/80 dark:bg-primary-orange/80 hover:dark:bg-primary-orange/80",
            )}
            variant={"outline"}
            size={"sm"}
          >
            {stringUtils.truncate(tag.name)}
          </Button>
        );
      })}
    </section>
  );
}
