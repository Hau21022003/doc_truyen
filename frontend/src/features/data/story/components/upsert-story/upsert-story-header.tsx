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
  translate: (key: string) => string,
  isSubmitting?: boolean,
) {
  if (isSubmitting) {
    return {
      title:
        mode === "create"
          ? translate("creatingStory")
          : translate("updatingStory"),
      icon: <IconLoading className="animate-spin" color="custom" />,
    };
  }

  if (mode === "create") {
    return {
      title: translate("createStory"),
      icon: <IconPlus color="custom" />,
    };
  }

  return {
    title: translate("updateStory"),
    icon: <IconRoundArrow color="custom" />,
  };
}

interface UpsertStoryHeaderProps {
  isDirty: boolean;
  onReset: () => void;
  isSubmitting?: boolean;
  mode: "edit" | "create";
}

export function UpsertStoryHeader({
  isDirty,
  onReset,
  isSubmitting,
  mode,
}: UpsertStoryHeaderProps) {
  const t = useTranslations("");
  const tStory = useTranslations("story");
  const tCommon = useTranslations("common");

  const submitConfig = useMemo(
    () => getSubmitConfig(mode, tStory, isSubmitting),
    [isSubmitting, mode, tStory],
  );

  return (
    <div className="sticky z-20 top-0 bg-background">
      <div className="flex items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant={"outline"}
            className="rounded-full"
            size={"icon"}
          >
            <Link href={"/admin/story"}>
              <ArrowLeft />
            </Link>
          </Button>
          <h3 className="font-medium">{tStory("title")}</h3>
        </div>

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
