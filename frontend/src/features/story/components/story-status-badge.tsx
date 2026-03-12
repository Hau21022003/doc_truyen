"use client";

import {
  IconArchiveOutline,
  IconCheckCircleOutline,
  IconDraftOutline,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { STORY_STATUS, StoryStatus } from "../story.constants";

export function getStoryStatusConfig(
  status: StoryStatus,
  tStoryStatus: (key: string) => string,
) {
  switch (status) {
    case STORY_STATUS.DRAFT:
      return {
        icon: IconDraftOutline,
        title: tStoryStatus(status),
        color:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      };
    case STORY_STATUS.PUBLISHED:
      return {
        icon: IconCheckCircleOutline,
        title: tStoryStatus(status),
        color:
          "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      };
    case STORY_STATUS.ARCHIVED:
      return {
        icon: IconArchiveOutline,
        title: tStoryStatus(status),
        color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      };
    default:
      return {
        icon: IconDraftOutline,
        title: tStoryStatus(status),
        color:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      };
  }
}

interface StoryStatusBadgeProps {
  status: StoryStatus;
}
export default function StoryStatusBadge({ status }: StoryStatusBadgeProps) {
  const tStoryStatus = useTranslations("story.statusConstants");
  const config = getStoryStatusConfig(status, tStoryStatus);
  const Icon = config.icon;
  return (
    <Badge className={config.color}>
      <Icon color="custom" />
      {config.title}
    </Badge>
  );
}
