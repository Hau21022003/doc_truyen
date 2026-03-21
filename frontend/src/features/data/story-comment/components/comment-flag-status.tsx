"use client";

import { useTranslations } from "next-intl";

interface CommentFlagStatusProps {
  isFlagged: boolean;
  flagCount: number;
}

export default function CommentFlagStatus({
  isFlagged,
  flagCount,
}: CommentFlagStatusProps) {
  const t = useTranslations();

  if (!isFlagged) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
      <span className="text-sm text-red-600 dark:text-red-400 font-medium">
        {t("comment.reports", { count: flagCount })}
      </span>
    </div>
  );
}
