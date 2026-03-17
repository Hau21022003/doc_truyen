"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { FilterContentProps } from "./filter-content.types";

export function TextFilterContent({
  config,
  value,
  onChange,
}: FilterContentProps) {
  const t = useTranslations("filter");
  return (
    <div className="p-2">
      <InputGroup className="max-w-xs">
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
