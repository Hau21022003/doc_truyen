"use client";

import { BulkActionBar } from "@/components/bulk-action-bar";
import CustomCheckbox from "@/components/custom-checkbox";
import { IconArchive } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useUsersActions,
  useUsersFilter,
  useUserTableConfig,
} from "@/features/data/users/hooks";
import { QueryUsersInput } from "@/features/data/users/update-profile.schema";
import { User } from "@/features/data/users/user.types";
import {
  USERS_QUERY_KEYS,
  useUsersQuery,
} from "@/features/data/users/users.query";
import { FilterBar } from "@/features/shared/filter/components/filter-bar";
import { useTableState } from "@/features/shared/table";
import {
  DataTable,
  ExtraColumnConfig,
} from "@/features/shared/table/components/data-table";
import HideColumnSelect from "@/features/shared/table/components/hide-column-select";
import { useRowSelection } from "@/hooks";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

export default function UsersPage() {
  const tUsers = useTranslations("users");
  const tCommon = useTranslations("common");

  // row selection
  const {
    selectedIds,
    isAllSelected,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
  } = useRowSelection<User>();

  const { removeOne, removeMany } = useUsersActions();

  const handleDelete = async (user: User) => {
    const success = await removeOne(user);

    // Xóa ID khỏi danh sách chọn
    if (success && isSelected(user)) {
      toggleRow(user);
    }
  };

  const handleBulkDelete = async () => {
    const success = await removeMany(selectedIds);
    if (success) clearSelection();
  };

  // Filter
  const { filterConfigs, params: filterParams } = useUsersFilter();

  // Table state
  const tableConfig = useUserTableConfig();

  const tableState = useTableState(tableConfig, {
    persistKey: USERS_QUERY_KEYS.lists().join(","),
    defaultPageSize: 10,
  });

  const searchParams: QueryUsersInput = useMemo(
    () => ({
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.page,
      sortBy: tableState.sort.column as any,
      sortOrder: tableState.sort.direction,
      ...filterParams,
    }),
    [
      tableState.pagination.pageSize,
      tableState.pagination.page,
      tableState.sort.column,
      tableState.sort.direction,
      filterParams,
    ],
  );

  useEffect(() => {
    tableState.pagination.setPage(1);
  }, [filterParams, tableState.sort.column, tableState.sort.direction]);

  const {
    data: usersData,
    error: usersQueryError,
    isLoading: isUsersQueryLoading,
    refetch: refetchUsers,
  } = useUsersQuery(searchParams);

  const data = usersData?.payload.data ?? [];

  const extraColumns: ExtraColumnConfig<User>[] = [
    {
      key: "checkbox",
      render: (user) => (
        <div className="flex items-center justify-center h-full">
          <CustomCheckbox
            color={"purple"}
            checked={isSelected(user)}
            onCheckedChange={() => toggleRow(user)}
          />
        </div>
      ),
      renderHeader() {
        return (
          <div className="flex items-center justify-center h-full">
            <CustomCheckbox
              color={"purple"}
              checked={isAllSelected(data)}
              onCheckedChange={() => toggleAll(data)}
            />
          </div>
        );
      },
      width: 30,
      sticky: "left",
    },
    {
      key: "actions",
      width: 40,
      align: "center",
      sticky: "right",
      label: tCommon("actions.actions"),
      render: (user) => (
        <div className="flex justify-center gap-2">
          <Button
            size="icon"
            variant={"outline"}
            onClick={() => handleDelete(user)}
            className="[&_svg:not([class*='size-'])]:size-5"
          >
            <IconArchive color="custom" className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <h3 className="font-medium">{tUsers("title")}</h3>
        <div className="flex items-center gap-2">
          <HideColumnSelect tableState={tableState} />
        </div>
      </div>

      <Separator />

      <FilterBar configs={filterConfigs} />
      <DataTable
        data={data}
        totalCount={usersData?.payload.total || 0}
        tableState={tableState}
        extraColumns={extraColumns}
        isLoading={isUsersQueryLoading}
        error={usersQueryError}
        onErrorRetry={refetchUsers}
      />

      <BulkActionBar
        count={selectedIds.length}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />
    </div>
  );
}
