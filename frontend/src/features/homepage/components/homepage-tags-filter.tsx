"use client";

import { IconCategoryOutline } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllTagsQuery } from "@/features/tags/tags.query";
import { cn } from "@/lib/utils";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { useHomepageFilters } from "../hooks/use-homepage-filters";

interface HomepageTagsFilterProps {
  className?: string;
}
export function HomepageTagsFilter({
  className = "",
}: HomepageTagsFilterProps) {
  const t = useTranslations("homepage");

  const { data: tagsData, isLoading: isTagsLoading } = useAllTagsQuery();

  const tags = tagsData?.payload || [];

  const { tags: activeTags, toggleTag } = useHomepageFilters();

  const displayTags = tags.filter((tag) => tag.isFeatured);

  return (
    <section
      className={cn(
        "border border-border rounded-lg px-4 py-4 w-full space-y-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <IconCategoryOutline
          size={"default"}
          color="custom"
          className="text-primary-orange"
        />
        <p className="font-medium text-lg leading-none">{t("hotTags")}</p>
      </div>

      <Separator />

      <div className="flex gap-2 flex-wrap items-center">
        {isTagsLoading &&
          Array.from({ length: 10 }).map((_, i) => {
            const randomWidth = Math.floor(Math.random() * 60) + 60; // 60px -> 120px

            return (
              <Skeleton
                key={i}
                className="h-8"
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
      </div>
    </section>
  );
}
