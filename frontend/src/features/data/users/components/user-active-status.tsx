import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface UserActiveStatusProps {
  isActive: boolean;
}

export default function UserActiveStatus({ isActive }: UserActiveStatusProps) {
  const t = useTranslations("users.statusConstants");

  const config = isActive
    ? {
        title: t("active"),
        color:
          "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      }
    : {
        title: t("inactive"),
        color: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
      };

  return <Badge className={config.color}>{config.title}</Badge>;
}
