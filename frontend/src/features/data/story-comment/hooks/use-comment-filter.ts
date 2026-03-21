import { FILTER_TYPE } from "@/features/shared/filter/filter.constants";
import { AnyFilterConfig } from "@/features/shared/filter/filter.types";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export const useCommentFilter = () => {
  const t = useTranslations("comment");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const [isFlagged, setIsFlagged] = useState<boolean | null>(null);

  const filterConfigs: AnyFilterConfig[] = useMemo(
    () =>
      [
        {
          key: "search",
          label: t(`filters.search`),
          placeholder: t(`filters.searchPlaceholder`),
          type: FILTER_TYPE.TEXT,
          popoverSize: "xl",
          defaultVisible: true,
          onChange(value) {
            setSearch(value);
          },
        },
        {
          key: "isFlagged",
          label: t(`filters.isFlagged`),
          type: FILTER_TYPE.SELECT,
          defaultVisible: true,
          options: [
            {
              value: true,
              label: tCommon("yes"),
            },
            {
              value: false,
              label: tCommon("no"),
            },
          ],
          onChange(value) {
            setIsFlagged(value as boolean | null);
          },
        },
      ] as AnyFilterConfig[],
    [t, tCommon],
  );

  const params = useMemo(
    () => ({
      search: debouncedSearch,
      isFlagged,
    }),
    [debouncedSearch, isFlagged],
  );

  return {
    params,
    filterConfigs,
  };
};
