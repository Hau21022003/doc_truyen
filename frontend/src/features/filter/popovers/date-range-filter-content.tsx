import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { FilterContentProps } from "./filter-content.types";

export function DateRangeFilterContent({
  config,
  value,
  onChange,
}: FilterContentProps) {
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

  return (
    <div>
      <Calendar
        mode="range"
        defaultMonth={value?.from ? new Date(value.from) : undefined}
        selected={dateRange}
        onSelect={setDateRange}
        captionLayout="dropdown"
        // numberOfMonths={2}
      />
    </div>
  );
}
