"use client";
import LocalSwitcher from "@/components/language-switcher";
import { getTranslations } from "next-intl/server";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { devLog } from "@/shared/utils";

export default function HomePage() {
  const t = useTranslations("HomePage");
  // const pathname = usePathname();
  // console.log("oath", pathname);
  devLog("oath", "a");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <LocalSwitcher />
      <Button variant={"outline"} className="bg-muted">
        aaaaaaaaaaaaaaaa9999gq
      </Button>
    </div>
  );
}
