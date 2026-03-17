"use client";

import CustomButton from "@/components/custom-button";
import {
  IconLoading,
  IconPlus,
  IconReset,
  IconRoundArrow,
} from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("");
  const tChapter = useTranslations("chapter");
  const tCommon = useTranslations("common");

  const submitConfig = useMemo(
    () => getSubmitConfig(mode, tChapter, isSubmitting),
    [isSubmitting, mode, tChapter],
  );

  return (
    <div className="sticky z-20 top-0 bg-background">
      <div className="flex items-center justify-between gap-2 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/story">
                {t("story.title")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/story/${storyId}/chapters`}>
                {stringUtils.truncate(storyTitle || "")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{submitConfig.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Right */}
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
