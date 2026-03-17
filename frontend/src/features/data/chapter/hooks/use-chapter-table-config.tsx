import { TableColumnConfigMap } from "@/features/shared/table";
import { useTimeZone } from "@/hooks";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { dateUtils } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  CHAPTER_COLUMNS,
  ChapterColumn,
  isChapterSortableColumn,
} from "../chapter.constants";
import { Chapter } from "../chapter.types";
import ChapterStatusBadge from "../components/chapter-status-badge";

export const useChapterTableConfig = () => {
  const tChapter = useTranslations("chapter");
  const tChapterColumns = useTranslations("chapter.columns");
  const tChapterStatus = useTranslations("chapter.statusConstants");
  const locale = useLocale() as (typeof SUPPORTED_LOCALES)[number];
  const timezone = useTimeZone();

  const tableConfig: TableColumnConfigMap<ChapterColumn, Chapter> = useMemo(
    () => ({
      chapterNumber: {
        label: tChapterColumns(CHAPTER_COLUMNS.CHAPTER_NUMBER),
        defaultVisible: true,
        resizable: true,
        sortable: isChapterSortableColumn(CHAPTER_COLUMNS.CHAPTER_NUMBER),
        render: (row) => {
          return (
            <p className="line-clamp-3">{`Chap ${row.chapterNumber}: ${row.title}`}</p>
          );
        },
      },
      slug: {
        label: tChapterColumns(CHAPTER_COLUMNS.SLUG),
        defaultVisible: true,
        resizable: true,
        sortable: isChapterSortableColumn(CHAPTER_COLUMNS.SLUG),
      },
      status: {
        label: tChapterColumns(CHAPTER_COLUMNS.STATUS),
        defaultVisible: true,
        resizable: true,
        width: 120,
        sortable: isChapterSortableColumn(CHAPTER_COLUMNS.STATUS),
        render: (chapter) => <ChapterStatusBadge status={chapter.status} />,
      },
      publishedAt: {
        label: tChapterColumns(CHAPTER_COLUMNS.PUBLISHED_AT),
        defaultVisible: true,
        resizable: true,
        sortable: isChapterSortableColumn(CHAPTER_COLUMNS.PUBLISHED_AT),
        format: (value) =>
          dateUtils.formatDate(value, { locale, timeZone: timezone }),
      },
      createdAt: {
        label: tChapterColumns(CHAPTER_COLUMNS.CREATED_AT),
        defaultVisible: true,
        resizable: true,
        sortable: isChapterSortableColumn(CHAPTER_COLUMNS.CREATED_AT),
        format: (value) =>
          dateUtils.formatDate(value, { locale, timeZone: timezone }),
      },
      updatedAt: {
        label: tChapterColumns(CHAPTER_COLUMNS.UPDATED_AT),
        defaultVisible: true,
        resizable: true,
        sortable: isChapterSortableColumn(CHAPTER_COLUMNS.UPDATED_AT),
        format: (value) =>
          dateUtils.formatDate(value, { locale, timeZone: timezone }),
      },
    }),
    [tChapterColumns, tChapterStatus, locale, timezone],
  );

  return tableConfig;
};
