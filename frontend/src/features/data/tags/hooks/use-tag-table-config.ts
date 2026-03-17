import { TableColumnConfigMap } from "@/features/shared/table";
import { useTimeZone } from "@/hooks";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { dateUtils } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { TAG_COLUMNS, TagColumn } from "../tags.constants";
import { Tag } from "../tags.types";

export const useTagTableConfig = () => {
  const tTagColumns = useTranslations("tags.columns");
  const locale = useLocale() as (typeof SUPPORTED_LOCALES)[number];
  const timezone = useTimeZone();
  const tableConfig: TableColumnConfigMap<TagColumn, Tag> = useMemo(
    () => ({
      name: {
        label: tTagColumns(TAG_COLUMNS.NAME),
        defaultVisible: true,
        resizable: true,
        sortable: true,
      },
      slug: {
        label: tTagColumns(TAG_COLUMNS.SLUG),
        defaultVisible: true,
        resizable: true,
      },
      storyCount: {
        label: tTagColumns(TAG_COLUMNS.STORY_COUNT),
        defaultVisible: true,
        resizable: true,
      },
      createdAt: {
        label: tTagColumns(TAG_COLUMNS.CREATED_AT),
        defaultVisible: true,
        resizable: true,
        sortable: true,
        format: (value) =>
          dateUtils.formatDate(value, { locale, timeZone: timezone }),
      },
      updatedAt: {
        label: tTagColumns(TAG_COLUMNS.UPDATED_AT),
        defaultVisible: true,
        resizable: true,
        sortable: true,
        format: (value) =>
          dateUtils.formatDate(value, { locale, timeZone: timezone }),
      },
    }),
    [tTagColumns, locale, timezone],
  );

  return tableConfig;
};
