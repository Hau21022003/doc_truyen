"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { STORY_PROGRESS, StoryProgress } from "../story.constants";

export function getStoryProgressConfig(
  progress: StoryProgress,
  tStoryProgress: (key: string) => string,
) {
  switch (progress) {
    case STORY_PROGRESS.ONGOING:
      return {
        title: tStoryProgress(progress),
        dotColor: "bg-blue-400 dark:bg-blue-300",
      };
    case STORY_PROGRESS.COMPLETED:
      return {
        title: tStoryProgress(progress),
        dotColor: "bg-green-400 dark:bg-green-300",
      };
    case STORY_PROGRESS.HIATUS:
      return {
        title: tStoryProgress(progress),
        dotColor: "bg-red-400 dark:bg-red-300",
      };
    default:
      return {
        title: tStoryProgress(progress),
        dotColor: "bg-blue-400 dark:bg-blue-300",
      };
  }
}

interface StoryProgressBadgeProps {
  progress: StoryProgress;
}

export default function StoryProgressBadge({
  progress,
}: StoryProgressBadgeProps) {
  const tStoryProgress = useTranslations("story.progressConstants");
  const config = getStoryProgressConfig(progress, tStoryProgress);

  return (
    <Badge variant={"outline"}>
      <div className={`w-2 h-2 rounded-full mr-1 ${config.dotColor}`} />
      {config.title}
    </Badge>
  );
}
