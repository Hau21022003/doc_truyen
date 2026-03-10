"use client";

import CustomButton from "@/components/custom-button";
import {
  IconLoading,
  IconPlus,
  IconReset,
  IconRoundArrow,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";

function getSubmitConfig(
  mode: "create" | "edit",
  tChapter: (key: string) => string,
  isSubmitting?: boolean,
) {
  if (isSubmitting) {
    return {
      title:
        mode === "create"
          ? tChapter("creatingChapter")
          : tChapter("updatingChapter"),
      icon: <IconLoading className="animate-spin" color="custom" />,
    };
  }

  if (mode === "create") {
    return {
      title: tChapter("createChapter"),
      icon: <IconPlus color="custom" />,
    };
  }

  return {
    title: tChapter("updateChapter"),
    icon: <IconRoundArrow color="custom" />,
  };
}

interface UpsertChapterFormHeaderProps {
  storyTitle?: string;
  storyId?: number;
  isDirty: boolean;
  onReset: () => void;
  isSubmitting?: boolean;
  mode: "edit" | "create";
}

export function UpsertChapterFormHeader({
  storyTitle,
  storyId,
  isDirty,
  onReset,
  isSubmitting,
  mode,
}: UpsertChapterFormHeaderProps) {
  const tChapter = useTranslations("chapter");
  const tCommon = useTranslations("common");

  const submitConfig = useMemo(
    () => getSubmitConfig(mode, tChapter, isSubmitting),
    [isSubmitting, mode, tChapter],
  );

  return (
    <div className="sticky z-20 top-0 bg-background">
      <div className="flex items-center gap-2 py-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button
            type="button"
            size="icon"
            variant={"outline"}
            className="rounded-full"
            asChild
          >
            <Link href={`/admin/story/${storyId}/chapters`}>
              <ArrowLeft />
            </Link>
          </Button>
          <h3 className="flex-1 max-w-xl font-medium truncate">
            {tChapter("title", { title: storyTitle || "" })}
          </h3>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Button
            type="button"
            className="cursor-pointer"
            variant={"outline"}
            disabled={!isDirty}
            onClick={onReset}
          >
            <IconReset color="custom" />
            <p>{tCommon("actions.reset")}</p>
          </Button>
          <CustomButton
            disabled={isSubmitting || !isDirty}
            type="submit"
            form="form-rhf-upsert"
            color="orange"
          >
            {submitConfig.icon}
            <p>{submitConfig.title}</p>
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
