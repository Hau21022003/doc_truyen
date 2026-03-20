import {
  IconAdminOutlined,
  IconCheckCircleOutline,
  IconUserOutline,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { USER_ROLE, UserRole } from "../user-role.constants";

export function getUserRoleConfig(
  role: UserRole,
  tUserRole: (key: string) => string,
) {
  switch (role) {
    case USER_ROLE.READER:
      return {
        icon: IconUserOutline,
        title: tUserRole(role),
        color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      };
    case USER_ROLE.CONTENT_ADMIN:
      return {
        icon: IconCheckCircleOutline,
        title: tUserRole(role),
        color:
          "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      };
    case USER_ROLE.SYSTEM_ADMIN:
      return {
        icon: IconAdminOutlined,
        title: tUserRole(role),
        color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      };
    default:
      return {
        icon: IconUserOutline,
        title: tUserRole(role),
        color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      };
  }
}

interface UserRoleBadgeProps {
  role: UserRole;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const tUserRole = useTranslations("users.roleConstants");
  const config = getUserRoleConfig(role, tUserRole);

  return (
    <Badge className={config.color}>
      <config.icon color="custom" />
      {config.title}
    </Badge>
  );
}
