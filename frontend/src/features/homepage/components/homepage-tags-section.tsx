"use client";

import { IconCategoryOutline } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAllTagsQuery } from "@/features/tags/tags.query";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

export default function HomepageTagsFilter({
  className = "",
  activeTags,
}: {
  className?: string;
  activeTags: string[];
}) {
  const t = useTranslations("homepage");

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    data: tagsData,
    error: tagsError,
    isLoading: isTagsLoading,
  } = useAllTagsQuery();

  const tags = tagsData?.payload || [];

  const toggleTag = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentTags = params.getAll("tag");

    if (currentTags.includes(slug)) {
      // remove tag
      const newTags = currentTags.filter((t) => t !== slug);
      params.delete("tag");
      newTags.forEach((t) => params.append("tag", t));
    } else {
      // add tag
      params.append("tag", slug);
    }

    router.push(`?${params.toString()}`);
  };

  const displayTags = tags.filter((tag) => tag.isFeatured);

  return (
    <section
      className={cn(
        "border border-border bg-muted rounded-lg px-4 py-4 w-full space-y-2",
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
