"use client";

import CustomCheckbox from "@/components/custom-checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  DATE_RANGE_PRESETS,
  PresetKey,
} from "../types/date-range-presets.types";
import { FilterContentProps } from "./filter-content.types";

export function DateRangeFilterContent({
  config,
  value,
  onChange,
}: FilterContentProps) {
  const t = useTranslations("filter");
  const [showPresets, setShowPresets] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(null);

  const dateRange: DateRange | undefined =
    value && typeof value === "object" && "from" in value && "to" in value
      ? {
          from: value.from ? new Date(value.from) : undefined,
          to: value.to ? new Date(value.to) : undefined,
        }
      : undefined;

  const setDateRange = (range?: DateRange) => {
    if (!range) {
      onChange(null);
      return;
    }
    onChange(range);
  };

  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col">
      <div className="p-2 flex items-center gap-2">
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={() => setShowPresets(true)}
          className={cn(
            showPresets &&
              "bg-primary-purple/20 dark:bg-primary-purple/20 hover:bg-primary-purple/20 dark:hover:bg-primary-purple/20",
          )}
        >
          {t("presets")}
        </Button>
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={() => {
            setShowPresets(false);
            setSelectedPreset(null);
          }}
          className={cn(
            !showPresets &&
              "bg-primary-purple/20 dark:bg-primary-purple/20 hover:bg-primary-purple/20 dark:hover:bg-primary-purple/20",
          )}
        >
          {t("custom")}
        </Button>
      </div>

      <Separator />
      {showPresets && (
        <div className="grid grid-cols-1 gap-1 py-2">
          {Object.entries(DATE_RANGE_PRESETS).map(([key, getRange]) => {
            const preset = key as PresetKey;
            const checked = preset === selectedPreset;

            return (
              <FieldGroup key={preset} className="px-3 py-1">
                <Field orientation="horizontal">
                  <CustomCheckbox
                    size={"sm"}
                    id={`preset-${preset}`}
                    checked={checked}
                    color="purple"
                    onCheckedChange={() => {
                      if (checked) {
                        setSelectedPreset(null);
                        onChange(null);
                      } else {
                        const range = getRange();
                        setSelectedPreset(preset);
                        setDateRange(range);
                      }
                    }}
                  />
                  <FieldContent>
                    <FieldLabel
                      className="font-normal"
                      htmlFor={`preset-${preset}`}
                    >
                      {t(`preset.${preset}`)}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              </FieldGroup>
            );
          })}
        </div>
      )}

      {!showPresets && (
        <Calendar
          mode="range"
          defaultMonth={value?.from ? new Date(value.from) : undefined}
          selected={dateRange}
          onSelect={setDateRange}
          captionLayout="dropdown"
          numberOfMonths={isMobile ? 1 : 2}
        />
      )}
    </div>
  );
}
