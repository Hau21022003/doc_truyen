"use client";
import { IconCheck } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getWidthFromPopoverSize } from "../filter.utils";
import { FilterContentProps } from "./filter-content.types";

export function ComboboxFilterContent({
  config,
  value,
  onChange,
  onClose,
}: FilterContentProps) {
  const t = useTranslations("filter");
  const [searchTerm, setSearchTerm] = useState("");

  const handleOptionSelect = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];

    let newValues: string[];

    if (currentValues.includes(optionValue)) {
      newValues = currentValues.filter((v) => v !== optionValue);
    } else {
      newValues = [...currentValues, optionValue];
    }

    onChange?.(newValues);
  };

  const filteredOptions = config.options?.filter((option) => {
    const label =
      typeof option.label === "string" ? option.label.toLowerCase() : "";
    return label.includes(searchTerm.toLowerCase());
  });

  const popoverWidth = getWidthFromPopoverSize(config.popoverSize);

  return (
    <div className={cn("flex flex-col gap-1 p-2", popoverWidth)}>
      <InputGroup>
        <InputGroupInput
          placeholder={config.placeholder || `${t("search")}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        {filteredOptions?.map((option) => {
          const isSelected =
            Array.isArray(value) && value.includes(option.value);
          // const isSelected = value === option.value;
          const content = option.render ? option.render() : option.label;
          return (
            <div className="relative">
              <Button
                key={option.value}
                size={"sm"}
                variant={"ghost"}
                onClick={() => handleOptionSelect(option.value)}
                className={cn(
                  "font-normal pr-6 w-full cursor-pointer overflow-hidden justify-start",
                  isSelected &&
                    "bg-primary-purple/20 dark:bg-primary-purple/20 hover:bg-primary-purple/20 dark:hover:bg-primary-purple/20",
                )}
              >
                {/* Kiểm tra kiểu của content */}
                {typeof content === "string" ? (
                  <p className="line-clamp-1 truncate w-full text-start">
                    {content}
                  </p>
                ) : (
                  content // JSX/react elements
                )}
              </Button>
              {isSelected && (
                <IconCheck
                  size={"xs"}
                  className="absolute text-muted-foreground right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
