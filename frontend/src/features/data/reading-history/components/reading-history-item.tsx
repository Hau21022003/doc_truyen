"use client";

import { useTimeZone } from "@/hooks";
import { SupportedLocale } from "@/i18n/routing";
import { dateUtils } from "@/shared/utils";
import { imageUtils } from "@/shared/utils/image.utils";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ReadingHistory } from "../reading-history.types";

export function ReadingHistoryItem({ history }: { history: ReadingHistory }) {
  const locale = useLocale() as SupportedLocale;
  const timezone = useTimeZone();

  return (
    <div className="flex items-start gap-4">
      <Link href={`/story/${history.story.slug}`}>
        <img
          src={imageUtils.optimizeCloudinary(history.story.coverImage || "", {
            height: 80,
            width: 80,
          })}
          alt=""
          className="w-20 h-20 shrink-0"
        />
      </Link>
      <div className="flex-1 space-y-1">
        <Link
          href={`/story/${history.story.slug}`}
          className="line-clamp-2 max-w-2xl font-medium"
        >
          {history.story.title}
        </Link>
        <Link
          href={`/story/${history.story.slug}/chapter-${history.chapter.chapterNumber}`}
          className="hover:underline underline-offset-4 text-primary-orange"
        >{`Chap ${history.chapter.chapterNumber}`}</Link>

        <p className="text-muted-foreground text-sm mt-1">
          {dateUtils.formatTime(history.updatedAt, {
            locale,
            timeZone: timezone,
          })}
        </p>
      </div>
    </div>
  );
}
