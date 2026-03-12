import { IconCheck } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getWidthFromPopoverSize } from "../filter.utils";
import { FilterContentProps } from "./filter-content.types";

export function SelectFilterContent({
  config,
  value,
  onChange,
  onClose,
}: FilterContentProps) {
  const handleOptionSelect = (optionValue: string) => {
    onChange?.(optionValue);
    onClose();
  };

  const popoverWidth = getWidthFromPopoverSize(config.popoverSize);

  return (
    <div
      className={cn(
        "p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto",
        popoverWidth,
      )}
    >
      {config.options?.map((option) => {
        const isSelected = value === option.value;
        const content = option.render ? option.render() : option.label;
        return (
          <div className="relative">
            <Button
              key={option.value}
              size={"sm"}
              variant={"ghost"}
              onClick={() => handleOptionSelect(option.value)}
              className={cn(
                "font-normal pr-8 w-full cursor-pointer",
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
  );
}
