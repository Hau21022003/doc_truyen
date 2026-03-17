"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Story } from "@/features/data/story/story.types";
import { useIsMobile } from "@/hooks";
import { stringUtils } from "@/shared/utils";
import { useTranslations } from "next-intl";

export function StoryDetailsHeader({ story }: { story: Story }) {
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
          <BreadcrumbPage>
            {stringUtils.truncate(story.title, isMobile ? 30 : 60)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
