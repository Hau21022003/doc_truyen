"use client";

import CustomCheckbox from "@/components/custom-checkbox";
import { IconAdjustmentsHorizontal } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { TableColumnKey, TableState } from "../table.types";

interface HideColumnSelectProps<TColumn extends TableColumnKey, TRow> {
  tableState: TableState<TColumn, TRow>;
  className?: string;
}
export default function HideColumnSelect<TColumn extends TableColumnKey, TRow>({
  tableState,
  className = "",
}: HideColumnSelectProps<TColumn, TRow>) {
  const t = useTranslations("table");

  const columnOptions = (
    Object.keys(
      tableState.columns,
    ) as (typeof tableState.visibleColumns)[number][]
  ).map((key) => {
    const column = tableState.columns[key];

    return {
      key,
      label: column.config.label,
      visible: column.visible,
    };
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`${className}`}>
          <IconAdjustmentsHorizontal />
          {t("hide")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-60" align="end">
        <div className="flex flex-col gap-1 py-2 px-2 w-full">
          {columnOptions.map((columnOption) => {
            return (
              <FieldGroup key={columnOption.key} className="px-3 py-1">
                <Field orientation="horizontal">
                  <CustomCheckbox
                    id={`column-checkbox-${columnOption.key}`}
                    size={"sm"}
                    color="purple"
                    checked={columnOption.visible}
                    onCheckedChange={() => {
                      tableState.toggleColumn(columnOption.key);
                    }}
                  />
                  <FieldContent className="flex-1 min-w-0">
                    <FieldLabel
                      className="font-normal block truncate w-full text-left cursor-pointer"
                      htmlFor={`column-checkbox-${columnOption.key}`}
                    >
                      {columnOption.label}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              </FieldGroup>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
