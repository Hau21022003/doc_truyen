import { FILTER_TYPE } from "@/features/shared/filter/filter.constants";
import { AnyFilterConfig } from "@/features/shared/filter/filter.types";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { USER_ROLE_VALUES, UserRole } from "../user-role.constants";

export const useUsersFilter = () => {
  const t = useTranslations("users");
  const tUserRole = useTranslations("users.roleConstants");

  const [search, setSearch] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const [role, setRole] = useState<UserRole | null>(null);

  const filterConfigs: AnyFilterConfig[] = useMemo(
    () =>
      [
        {
          key: "search",
          label: t(`filters.search`),
          type: FILTER_TYPE.TEXT,
          defaultVisible: true,
          onChange(value) {
            setSearch(value);
          },
        },
        {
          key: "role",
          label: t(`filters.role`),
          type: FILTER_TYPE.SELECT,
          defaultVisible: false,
          popoverSize: "lg",
          options: USER_ROLE_VALUES.map((userRole) => ({
            value: userRole,
            label: tUserRole(userRole),
          })),
          onChange(value) {
            setRole(value as UserRole | null);
          },
        },
      ] as AnyFilterConfig[],
    [t, tUserRole],
  );

  const params = useMemo(
    () => ({
      search: debouncedSearch,
      role,
    }),
    [debouncedSearch, role],
  );

  return {
    params,
    filterConfigs,
  };
};
