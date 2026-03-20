import { TableColumnConfigMap } from "@/features/shared/table";
import { SupportedLocale } from "@/i18n/routing";
import { dateUtils } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import UserActiveStatus from "../components/user-active-status";
import UserRoleBadge from "../components/user-role-badge";
import {
  isUserSortableColumn,
  USER_COLUMNS,
  UserColumn,
} from "../user-role.constants";
import { User } from "../user.types";

export const useUserTableConfig = () => {
  const tUserColumns = useTranslations("users.columns");
  const locale = useLocale() as SupportedLocale;

  const tableConfig: TableColumnConfigMap<UserColumn, User> = useMemo(
    () => ({
      name: {
        label: tUserColumns(USER_COLUMNS.NAME),
        defaultVisible: true,
        resizable: true,
        sortable: isUserSortableColumn(USER_COLUMNS.NAME),
      },
      email: {
        label: tUserColumns(USER_COLUMNS.EMAIL),
        defaultVisible: true,
        resizable: true,
        sortable: isUserSortableColumn(USER_COLUMNS.EMAIL),
      },
      role: {
        label: tUserColumns(USER_COLUMNS.ROLE),
        defaultVisible: true,
        resizable: true,
        sortable: isUserSortableColumn(USER_COLUMNS.ROLE),
        render: (user) => <UserRoleBadge role={user.role} />,
      },
      isActive: {
        label: tUserColumns(USER_COLUMNS.IS_ACTIVE),
        defaultVisible: true,
        resizable: true,
        width: 100,
        sortable: isUserSortableColumn(USER_COLUMNS.IS_ACTIVE),
        render: (user) => <UserActiveStatus isActive={user.isActive} />,
      },
      lastLoginAt: {
        label: tUserColumns(USER_COLUMNS.LAST_LOGIN_AT),
        defaultVisible: true,
        resizable: true,
        sortable: isUserSortableColumn(USER_COLUMNS.LAST_LOGIN_AT),
        format: (value) =>
          value ? dateUtils.formatDate(value, { locale }) : "-",
      },
      createdAt: {
        label: tUserColumns(USER_COLUMNS.CREATED_AT),
        defaultVisible: true,
        resizable: true,
        sortable: isUserSortableColumn(USER_COLUMNS.CREATED_AT),
        format: (value) => dateUtils.formatDate(value, { locale }),
      },
      updatedAt: {
        label: tUserColumns(USER_COLUMNS.UPDATED_AT),
        defaultVisible: true,
        resizable: true,
        sortable: isUserSortableColumn(USER_COLUMNS.UPDATED_AT),
        format: (value) => dateUtils.formatDate(value, { locale }),
      },
    }),
    [tUserColumns, locale],
  );

  return tableConfig;
};
