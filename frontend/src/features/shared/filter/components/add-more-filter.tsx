"use client";

import { IconPlus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { AnyFilterConfig } from "../filter.types";

interface AddMoreFilterProps {
  availableFilters: AnyFilterConfig[];
  onAddFilter: (key: string) => void;
}
export default function AddMoreFilter({
  availableFilters,
  onAddFilter,
}: AddMoreFilterProps) {
  const t = useTranslations("filter");
  const hasAvailableFilters = availableFilters.length > 0;

  if (!hasAvailableFilters) {
    return (
      <button
        disabled
        className="px-1 cursor-pointer text-primary-purple inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0"
      >
        <IconPlus color="custom" size={"xs"} />
        <p>{t("add_filter")}</p>
      </button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-1 cursor-pointer text-primary-purple inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0">
          <IconPlus color="custom" size={"xs"} />
          <p>{t("add_filter")}</p>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-2 max-w-44">
        <div className="flex flex-col">
          {availableFilters.map((filter) => (
            <Button
              key={filter.key}
              variant="ghost"
              size={"sm"}
              className={cn(
                "justify-start font-normal ",
                "hover:bg-primary-purple/20 dark:hover:bg-primary-purple/20",
              )}
              onClick={() => onAddFilter(filter.key)}
            >
              <p className="truncate">{filter.label}</p>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
