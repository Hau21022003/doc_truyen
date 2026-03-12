import {
  IconArchiveOutline,
  IconCheckCircleOutline,
  IconDraftOutline,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { CHAPTER_STATUS, ChapterStatus } from "../chapter.constants";

export function getChapterStatusConfig(
  status: ChapterStatus,
  tChapterStatus: (key: string) => string,
) {
  switch (status) {
    case CHAPTER_STATUS.DRAFT:
      return {
        icon: IconDraftOutline,
        title: tChapterStatus(status),
        color:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      };
    case CHAPTER_STATUS.PUBLISHED:
      return {
        icon: IconCheckCircleOutline,
        title: tChapterStatus(status),
        color:
          "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      };
    case CHAPTER_STATUS.ARCHIVED:
      return {
        icon: IconArchiveOutline,
        title: tChapterStatus(status),
        color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      };
    default:
      return {
        icon: IconDraftOutline,
        title: tChapterStatus(status),
        color:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      };
  }
}

interface ChapterStatusBadgeProps {
  status: ChapterStatus;
}
export default function ChapterStatusBadge({
  status,
}: ChapterStatusBadgeProps) {
  const tStoryStatus = useTranslations("chapter.statusConstants");
  const config = getChapterStatusConfig(status, tStoryStatus);

  return (
    <Badge className={config.color}>
      <config.icon color="custom" />
      {config.title}
    </Badge>
  );
}
