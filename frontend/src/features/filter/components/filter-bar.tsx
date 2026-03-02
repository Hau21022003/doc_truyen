"use client";
import { IconX } from "@/components/icons";
import { useTranslations } from "next-intl";
import { AnyFilterConfig } from "../filter.types";
import { useFilter } from "../hooks/use-filter";
import AddMoreFilter from "./add-more-filter";
import { FilterItem } from "./filter-item";

// interface FilterBarProps<T extends readonly FilterConfig[]> {
//   configs: T;
// }
interface FilterBarProps {
  // configs: FilterConfig[];
  configs: AnyFilterConfig[];
}

export function FilterBar({ configs }: FilterBarProps) {
  // export function FilterBar<T extends readonly FilterConfig[]>({
  //   configs,
  // }: FilterBarProps<T>) {
  const t = useTranslations("filter");
  const {
    filterStateMap,
    visibleFilters,
    hasChanged,
    toggleFilter,
    updateFilterValue,
    resetFilters,
  } = useFilter(configs);

  return (
    <div className="flex items-center justify-center gap-2 md:justify-start flex-wrap">
      {visibleFilters.map((filterKey) => {
        const config = configs.find((c) => c.key === filterKey);
        if (!config) return null;

        return (
          <FilterItem
            key={filterKey}
            config={config}
            state={filterStateMap[filterKey]}
            onVisibleToggle={() => toggleFilter(filterKey)}
            onValueChange={(value) => updateFilterValue(filterKey, value)}
          />
        );
      })}

      <AddMoreFilter
        availableFilters={configs.filter((f) => !filterStateMap[f.key].visible)}
        onAddFilter={(key) => toggleFilter(key)}
      />
      {hasChanged && (
        <button
          className="px-1 cursor-pointer text-muted-foreground inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0"
          onClick={resetFilters}
        >
          <IconX color="custom" />
          {t("clearAll")}
        </button>
      )}
    </div>
  );
}
