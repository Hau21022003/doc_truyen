import { FILTER_TYPE } from "@/features/filter/filter.constants";
import { AnyFilterConfig } from "@/features/filter/filter.types";
import { useAllTagsQuery } from "@/features/tags/tags.query";
import { useDebounce } from "@/hooks/use-debounce";
import { dateUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  STORY_FILTER_KEYS,
  STORY_PROGRESS_VALUES,
  STORY_STATUS_VALUES,
  StoryProgress,
  StoryStatus,
} from "../story.constants";

export const useStoryFilter = () => {
  const t = useTranslations("story");
  const [search, setSearch] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const [status, setStatus] = useState<StoryStatus | null>(null);
  const [progress, setProgress] = useState<StoryProgress | null>(null);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [tagIds, setTagIds] = useState<number[]>([]);

  const { data: tagsData } = useAllTagsQuery();
  const tags = tagsData?.payload || [];

  const filterConfigs: AnyFilterConfig[] = useMemo(
    () => [
      {
        key: STORY_FILTER_KEYS.SEARCH,
        label: t(`filters.${STORY_FILTER_KEYS.SEARCH}`),
        type: FILTER_TYPE.TEXT,
        defaultVisible: true,
        onChange(value) {
          setSearch(value);
        },
      },
      {
        key: STORY_FILTER_KEYS.PROGRESS,
        label: t(`filters.${STORY_FILTER_KEYS.PROGRESS}`),
        type: FILTER_TYPE.SELECT,
        defaultVisible: false,
        popoverSize: "md",
        options: STORY_PROGRESS_VALUES.map((storyProgress) => ({
          value: storyProgress,
          label: t(`progressConstants.${storyProgress}`),
        })),
        onChange(value) {
          setProgress(value as StoryProgress | null);
        },
      },
      {
        key: STORY_FILTER_KEYS.STATUS,
        label: t(`filters.${STORY_FILTER_KEYS.STATUS}`),
        type: FILTER_TYPE.SELECT,
        defaultVisible: false,
        popoverSize: "md",
        options: STORY_STATUS_VALUES.map((storyStatus) => ({
          value: storyStatus,
          label: t(`statusConstants.${storyStatus}`),
        })),
        onChange(value) {
          setStatus(value as StoryStatus | null);
        },
      },

      {
        key: STORY_FILTER_KEYS.TAGS,
        label: t(`filters.${STORY_FILTER_KEYS.TAGS}`),
        type: FILTER_TYPE.COMBOBOX,
        defaultVisible: false,
        popoverSize: "md",
        options: tags.map((tag) => ({
          value: tag.id.toString(),
          label: tag.name,
        })),
        onChange(value) {
          if (!value) {
            setTagIds([]);
            return;
          }

          setTagIds(value.map((id) => Number(id)));
        },
      },
      {
        key: STORY_FILTER_KEYS.UPDATED_AT,
        label: t(`filters.${STORY_FILTER_KEYS.UPDATED_AT}`),
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
    [tags, t],
  );

  const params = useMemo(
    () => ({
      search: debouncedSearch,
      status,
      progress,
      tagIds,
      startDate,
      endDate,
    }),
    [debouncedSearch, status, progress, tagIds, startDate, endDate],
  );

  return {
    params,
    filterConfigs,
  };
};
