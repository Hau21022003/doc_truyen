import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableColumnConfigMap } from "@/features/table";
import { useTimeZone } from "@/hooks";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { dateUtils, stringUtils } from "@/shared/utils";
import { imageUtils } from "@/shared/utils/image.utils";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  isStorySortableColumn,
  STORY_COLUMNS,
  StoryColumn,
} from "../story.constants";
import { Story } from "../story.types";

export const useStoryTableConfig = () => {
  const tStoryColumns = useTranslations("story.columns");
  const locale = useLocale() as (typeof SUPPORTED_LOCALES)[number];
  const timezone = useTimeZone();

  const tableConfig: TableColumnConfigMap<StoryColumn, Story> = useMemo(
    () => ({
      title: {
        label: tStoryColumns(STORY_COLUMNS.TITLE),
        defaultVisible: true,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.TITLE),
        render: (story) => {
          return (
            <div className="h-full flex items-center gap-2">
              <img
                src={
                  story.coverImage
                    ? imageUtils.optimizeCloudinary(story.coverImage, {
                        width: 80,
                        height: 80,
                      })
                    : ""
                }
                loading="lazy"
                decoding="async"
                alt={`CoverImage_${story.id}`}
                className="w-14 h-14 rounded-md object-cover shrink-0"
              />
              <p className="line-clamp-2">{story.title}</p>
            </div>
          );
        },
      },
      slug: {
        label: tStoryColumns(STORY_COLUMNS.SLUG),
        defaultVisible: true,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.SLUG),
      },
      description: {
        label: tStoryColumns(STORY_COLUMNS.DESCRIPTION),
        defaultVisible: false,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.DESCRIPTION),
        format: stringUtils.truncate,
        render: (story) => {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <p>{stringUtils.truncate(story.description || "")}</p>
              </TooltipTrigger>
              <TooltipContent
                align="end"
                className="max-w-sm whitespace-pre-line wrap-break-word"
              >
                <p>{story.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      authorName: {
        label: tStoryColumns(STORY_COLUMNS.AUTHOR_NAME),
        defaultVisible: true,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.AUTHOR_NAME),
      },
      status: {
        label: tStoryColumns(STORY_COLUMNS.STATUS),
        defaultVisible: true,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.STATUS),
      },
      progress: {
        label: tStoryColumns(STORY_COLUMNS.PROGRESS),
        defaultVisible: true,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.PROGRESS),
      },
      viewCount: {
        label: tStoryColumns(STORY_COLUMNS.VIEW_COUNT),
        defaultVisible: true,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.VIEW_COUNT),
      },
      lastAddedChapterDate: {
        label: tStoryColumns(STORY_COLUMNS.LAST_ADDED_CHAPTER_DATE),
        defaultVisible: true,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.LAST_ADDED_CHAPTER_DATE),
        format: (value) =>
          dateUtils.formatDate(value, { locale, timeZone: timezone }),
      },
      createdAt: {
        label: tStoryColumns(STORY_COLUMNS.CREATED_AT),
        defaultVisible: true,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.CREATED_AT),
        format: (value) =>
          dateUtils.formatDate(value, { locale, timeZone: timezone }),
      },
      updatedAt: {
        label: tStoryColumns(STORY_COLUMNS.UPDATED_AT),
        defaultVisible: false,
        resizable: true,
        sortable: isStorySortableColumn(STORY_COLUMNS.UPDATED_AT),
        format: (value) =>
          dateUtils.formatDate(value, { locale, timeZone: timezone }),
      },
    }),
    [tStoryColumns, locale, timezone],
  );

  return tableConfig;
};
