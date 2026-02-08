"use client";
import LocalSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");

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
