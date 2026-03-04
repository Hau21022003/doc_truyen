"use client";

import { IconArrowDown, IconXCircleFill } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDate } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FILTER_TYPE } from "../filter.constants";
import { AnyFilterConfig, FilterState } from "../filter.types";
import { isSameRange } from "../filter.utils";
import {
  ComboboxFilterContent,
  DateRangeFilterContent,
  SelectFilterContent,
  TextFilterContent,
} from "../popovers";
import { DATE_RANGE_PRESETS } from "../types/date-range-presets.types";

const FILTER_TYPE_COMPONENTS = {
  [FILTER_TYPE.TEXT]: TextFilterContent,
  [FILTER_TYPE.SELECT]: SelectFilterContent,
  [FILTER_TYPE.COMBOBOX]: ComboboxFilterContent,
  [FILTER_TYPE.DATE_RANGE]: DateRangeFilterContent,
} as const;

interface FilterItemProps {
  config: AnyFilterConfig;
  state: FilterState;
  onVisibleToggle: () => void;
  onValueChange: (value: any) => void;
  align?: "start" | "center" | "end";
}
export function FilterItem({
  config,
  state,
  onVisibleToggle,
  onValueChange,
  align = "start",
}: FilterItemProps) {
  const [open, setOpen] = useState(false);
  // Logic để render button + popover dựa trên type
  const FilterContentComponent = FILTER_TYPE_COMPONENTS[config.type];
  const isActive =
    state.value !== undefined && state.value !== null && state.value !== "";

  const t = useTranslations("filter");

  const renderValueDisplay = () => {
    const value = state.value;
    if (!value) return "";

    switch (config.type) {
      case "text":
        return value.toString();

      case "select":
        if (typeof state.value === "string") {
          const singleOption = config.options?.find(
            (o) => o.value === state.value,
          );
          if (singleOption?.render) {
            return singleOption.render();
          }
          return <span>{singleOption?.label || state.value}</span>;
        }
        return null;

      case "combobox":
        if (typeof value === "object" && Array.isArray(value)) {
          if (value.length === 0) return "";

          if (value.length === 1) {
            // If just one element, show its label or render function
            const singleOption = config.options?.find(
              (o) => o.value === value[0],
            );

            if (singleOption?.render) {
              return singleOption.render() as string;
            }

            // Fallback về label
            return singleOption?.label || value[0];
          }

          // If multiple elements, show count
          return (
            <p
              className={cn(
                "min-w-[16px] h-4 px-1 rounded-full inline-flex items-center justify-center",
                "text-[10px] leading-none font-medium",
                "bg-primary-purple text-primary-purple-foreground",
              )}
            >
              {value.length > 99 ? "99+" : value.length}
            </p>
          );
        }

        return value.toString();
      case "date-range":
        if (
          typeof value === "object" &&
          value !== null &&
          "from" in value &&
          "to" in value
        ) {
          const matchedPreset = Object.entries(DATE_RANGE_PRESETS).find(
            ([, getRange]) => isSameRange(value, getRange()),
          );

          if (matchedPreset) {
            const [key] = matchedPreset;
            return t(`preset.${key}`);
          }

          return `${formatDate(value.from)} - ${formatDate(value.to)}`;
        }

        return "";

      default:
        return value.toString();
    }
  };

  const formattedValue = renderValueDisplay();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          {isActive && (
            <IconXCircleFill
              className="text-muted-foreground absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
              color="custom"
              size={"xs"}
              onClick={(e) => {
                e.stopPropagation();
                onValueChange(null);
              }}
            />
          )}
          <Button
            className={cn(
              "max-w-[300px] border-dashed rounded-xl",
              isActive && "pr-3 pl-8",
            )}
            variant="outline"
            size={"sm"}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate pr-4 flex items-center gap-2 text-muted-foreground">
                  {config.render ? config.render() : <p>{config.label}</p>}
                  {isActive && (
                    <>
                      <div className="h-[16px] border-l-2 border-input" />
                      <div className="text-primary-purple truncate">
                        {formattedValue}
                      </div>
                    </>
                  )}
                </span>
              </TooltipTrigger>
              {formattedValue && (
                <TooltipContent>{formattedValue}</TooltipContent>
              )}
            </Tooltip>
          </Button>

          <IconArrowDown
            className="absolute text-muted-foreground right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            color="custom"
            size={"xs"}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        // className={cn("p-1 flex flex-col items-center", popoverWidth)}
        className="p-0 flex flex-col items-center w-fit"
        align={align}
      >
        <FilterContentComponent
          config={config}
          value={state.value}
          onChange={onValueChange}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
