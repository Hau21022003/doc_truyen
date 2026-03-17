"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Chapter } from "@/features/data/chapter/chapter.types";
import { useIsMobile } from "@/hooks";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";

export function ChapterReadingHeader({ chapter }: { chapter: Chapter }) {
  const t = useTranslations();
  const isMobile = useIsMobile();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{t("common.home")}</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink href={`/story/${chapter.story?.slug}`}>
            {stringUtils.truncate(
              chapter.story?.title || "",
              isMobile ? 30 : 60,
            )}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{`Chap ${chapter.chapterNumber}`}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
