import LocalSwitcher from "@/components/language-switcher";
import { getTranslations } from "next-intl/server";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  // const pathname = usePathname();
  // console.log("oath", pathname);

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
