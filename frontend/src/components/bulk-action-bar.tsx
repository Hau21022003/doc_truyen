// components/bulk-action-bar.tsx
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { IconArchive, IconClearOutline } from "./icons";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface BulkActionBarProps {
  count: number;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionBar({
  count,
  onDelete,
  onClear,
}: BulkActionBarProps) {
  const t = useTranslations("common");
  const isMobile = useIsMobile();

  if (!count) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background border-t",
        "px-4 py-3",
        "flex items-center justify-between gap-3",
        "md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:rounded-xl md:border md:shadow-lg md:px-4 md:py-2",
      )}
    >
      {/* LEFT */}
      <span className="text-muted-foreground">
        {t("selection.selected", { count })}
      </span>

      {!isMobile && <Separator orientation="vertical" className="min-h-8" />}

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onClear}
          className="cursor-pointer [&_svg:not([class*='size-'])]:size-5 "
          variant={"ghost"}
        >
          <IconClearOutline />
          {t("selection.clear")}
        </Button>
        <Button
          onClick={onDelete}
          className="cursor-pointer [&_svg:not([class*='size-'])]:size-5 text-destructive hover:text-destructive"
          variant={"ghost"}
        >
          <IconArchive color="custom" />
          {t("actions.delete")}
        </Button>
      </div>
    </div>
  );
}
