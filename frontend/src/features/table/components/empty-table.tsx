"use client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function EmptyTable() {
  const t = useTranslations("common");
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Image
            width={80}
            height={80}
            className="w-20 h-20"
            src={"/images/empty-box.png"}
            alt="Empty Box"
          />
        </EmptyMedia>
        <EmptyTitle>{t("table.empty.title")}</EmptyTitle>
        <EmptyDescription>{t("table.empty.description")}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
