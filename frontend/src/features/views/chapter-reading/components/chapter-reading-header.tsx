"use client";
import {
  IconClockOutline,
  IconCommentOutline,
  IconEye,
} from "@/components/icons";
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
import { dateUtils, numberUtils, stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";

export function ChapterReadingHeader({ chapter }: { chapter: Chapter }) {
  const t = useTranslations();
  const isMobile = useIsMobile();

  return (
    <div className="mb-4">
      <div className="p-2 px-3 rounded-lg bg-primary-orange/20">
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
                  isMobile ? 20 : 60,
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{`Chap ${chapter.chapterNumber}`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col items-center gap-2  mt-4 text-sm">
        <p className="text-lg line-clamp-2 max-w-3xl font-semibold">
          {chapter.story?.title} - Chap {chapter.chapterNumber}
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <IconClockOutline size={"sm"} />
            <p>Post At: {dateUtils.formatSmartDate(chapter.publishedAt)}</p>
          </div>

          <div className="flex items-center gap-1">
            <IconEye size={"sm"} />
            <p>
              {numberUtils.formatCompactNumber(chapter.story?.viewCount || 0)}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <IconCommentOutline size={"sm"} />
            <p>
              {numberUtils.formatCompactNumber(
                chapter.story?.commentCount || 0,
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
