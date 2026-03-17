"use client";

import { dateUtils, generateAvatarUrl, SupportedLocale } from "@/shared/utils";
import { useLocale } from "next-intl";
import { StoryComment } from "../story-comment.types";

function formatCommentTime(
  date?: Date | string | number,
  locale: SupportedLocale = "vi",
): string {
  if (!date) return "-";

  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  // Nếu trong vòng 24h → relative time
  if (Math.abs(diffInHours) < 24) {
    return dateUtils.formatRelativeTime(dateObj, locale);
  }

  // Nếu quá 24h → format ngày + giờ
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

export default function StoryCommentItem({
  comment,
}: {
  comment: StoryComment;
}) {
  const locale = useLocale() as SupportedLocale;
  return (
    <div className="flex gap-4 items-start">
      <img
        src={comment.userAvatar ?? generateAvatarUrl(comment.userName)}
        alt={`Avatar_${comment.userName}`}
        className="w-14 h-14 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium">{comment.userName}</p>
          {comment.chapter && (
            <div className="h-7 rounded-full text-sm flex items-center justify-center px-2 text-primary-orange bg-primary-orange/10">{`Chap ${comment.chapter.chapterNumber}`}</div>
          )}
        </div>
        <p className="">{comment.content}</p>
        <p className="text-sm text-muted-foreground">
          {formatCommentTime(comment.createdAt, locale)}
        </p>
      </div>
    </div>
  );
}
