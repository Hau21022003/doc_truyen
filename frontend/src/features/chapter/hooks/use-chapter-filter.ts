import { FILTER_TYPE } from "@/features/filter/filter.constants";
import { AnyFilterConfig } from "@/features/filter/filter.types";
import { useDebounce } from "@/hooks/use-debounce";
import { dateUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  CHAPTER_FILTER_KEYS,
  CHAPTER_STATUS_VALUES,
  ChapterStatus,
} from "../chapter.constants";

export const useChapterFilter = () => {
  const t = useTranslations("chapter");
  const [search, setSearch] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const [status, setStatus] = useState<ChapterStatus | null>(null);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const filterConfigs: AnyFilterConfig[] = useMemo(
    () => [
      {
        key: CHAPTER_FILTER_KEYS.SEARCH,
        label: t(`filters.${CHAPTER_FILTER_KEYS.SEARCH}`),
        type: FILTER_TYPE.TEXT,
        defaultVisible: true,
        onChange(value) {
          setSearch(value);
        },
      },
      {
        key: CHAPTER_FILTER_KEYS.STATUS,
        label: t(`filters.${CHAPTER_FILTER_KEYS.STATUS}`),
        type: FILTER_TYPE.SELECT,
        defaultVisible: false,
        popoverSize: "md",
        options: CHAPTER_STATUS_VALUES.map((chapterStatus) => ({
          value: chapterStatus,
          label: t(`statusConstants.${chapterStatus}`),
        })),
        onChange(value) {
          setStatus(value as ChapterStatus | null);
        },
      },
      {
        key: CHAPTER_FILTER_KEYS.UPDATED_AT,
        label: t(`filters.${CHAPTER_FILTER_KEYS.UPDATED_AT}`),
        type: FILTER_TYPE.DATE_RANGE,
        defaultVisible: false,
        popoverSize: "md",
        onChange(dateRange) {
          if (!dateRange) {
            setStartDate(null);
            setEndDate(null);
            return;
          }

          setStartDate(
            dateRange.from ? dateUtils.formatDateToYMD(dateRange.from) : null,
          );

          setEndDate(
            dateRange.to ? dateUtils.formatDateToYMD(dateRange.to) : null,
          );
        },
      },
    ],
    [t],
  );

  const params = useMemo(
    () => ({
      search: debouncedSearch,
      status,
      startDate,
      endDate,
    }),
    [debouncedSearch, status, startDate, endDate],
  );

  return {
    params,
    filterConfigs,
  };
};
