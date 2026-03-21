"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { getWidthFromPopoverSize } from "../filter.utils";
import { FilterContentProps } from "./filter-content.types";

export function TextFilterContent({
  config,
  value,
  onChange,
}: FilterContentProps) {
  const t = useTranslations("filter");
  const popoverWidth = getWidthFromPopoverSize(config.popoverSize);
  return (
    <div className={cn("p-2", popoverWidth, popoverWidth?.replace("max-", ""))}>
      <InputGroup className="w-full">
        <InputGroupInput
          placeholder={config.placeholder || `${t("search")}...`}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
