"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

const getConfigClassname = (size: "sm" | "default" | "md") => {
  switch (size) {
    case "sm":
      return "w-20 h-20";
    case "default":
      return "w-30 h-30";
    case "md":
      return "w-40 h-40";
  }
};

export function EmptyData({
  size = "default",
}: {
  size?: "sm" | "default" | "md";
}) {
  const t = useTranslations("common");
  const className = getConfigClassname(size);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Image
            width={80}
            height={80}
            className={className}
            src={"/images/empty-box.png"}
            alt="Empty Box"
          />
        </EmptyMedia>
        <EmptyTitle>{t("empty.title")}</EmptyTitle>
        <EmptyDescription>{t("empty.description")}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
