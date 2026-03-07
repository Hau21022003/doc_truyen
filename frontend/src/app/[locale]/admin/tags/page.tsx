"use client";

import { BulkActionBar } from "@/components/bulk-action-bar";
import CustomButton from "@/components/custom-button";
import CustomCheckbox from "@/components/custom-checkbox";
import { IconArchive, IconPen, IconPlus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTableState } from "@/features/table";
import {
  DataTable,
  ExtraColumnConfig,
} from "@/features/table/components/data-table";
import HideColumnSelect from "@/features/table/components/hide-column-select";
import UpsertTagModal from "@/features/tags/components/upsert-tag-modal";
import { useTagActions } from "@/features/tags/hooks/use-tag-actions";
import { useTagTableConfig } from "@/features/tags/hooks/use-tag-table-config";
import { TAGS_QUERY_KEYS, useTagsQuery } from "@/features/tags/tags.query";
import { Tag } from "@/features/tags/tags.types";
import { useIsMobile, useUpsertModal } from "@/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { useRowSelection } from "@/hooks/use-row-selection";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export default function TagsPage() {
  const tTag = useTranslations("tags");
  const tCommon = useTranslations("common");
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const {
    isOpen: isOpenUpsertTagModal,
    close: closeUpsertTagModal,
    data: dataUpsertTagModal,
    mode: modeUpsertTagModal,
    openCreate: openCreateTagModal,
    openEdit: openEditTagModal,
  } = useUpsertModal<Tag>();

  const {
    selectedIds,
    isAllSelected,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
  } = useRowSelection<Tag>();

  const { removeOne, removeMany } = useTagActions();

  const handleDelete = async (tag: Tag) => {
    const success = await removeOne(tag);

    // Xóa ID khỏi danh sách chọn
    if (success && isSelected(tag)) {
      toggleRow(tag);
    }
  };

  const handleBulkDelete = async () => {
    const success = await removeMany(selectedIds);
    if (success) clearSelection();
  };

  const tableConfig = useTagTableConfig();

  const tableState = useTableState(tableConfig, {
    persistKey: TAGS_QUERY_KEYS.lists().join(","),
    defaultPageSize: 10,
  });

  useEffect(() => {
    tableState.pagination.setPage(1);
  }, [debouncedSearch]);

  const searchParams = useMemo(
    () => ({
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.page,
      search: debouncedSearch,
      sortBy: tableState.sort.column as any,
      sortOrder: tableState.sort.direction,
    }),
    [
      tableState.pagination.pageSize,
      tableState.pagination.page,
      debouncedSearch,
      tableState.sort.column,
      tableState.sort.direction,
    ],
  );

  const {
    data: tagsData,
    error: tagsQueryError,
    isLoading: isTagsQueryLoading,
    refetch: refetchTags,
  } = useTagsQuery(searchParams);

  const data = tagsData?.payload.data ?? [];

  const extraColumns: ExtraColumnConfig<Tag>[] = [
    {
      key: "checkbox",
      render: (tag) => (
        <div className="flex items-center justify-center h-full">
          <CustomCheckbox
            color={"purple"}
            checked={isSelected(tag)}
            onCheckedChange={() => toggleRow(tag)}
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
      width: 80,
      align: "center",
      sticky: "right",
      label: tCommon("actions.actions"),
      render: (tag) => (
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            size="icon"
            onClick={() => openEditTagModal(tag)}
            className="[&_svg:not([class*='size-'])]:size-5"
          >
            <IconPen color="custom" />
          </Button>
          <Button
            size="icon"
            variant={"outline"}
            onClick={() => handleDelete(tag)}
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
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1">
          <InputGroup className="w-full max-w-xs">
            <InputGroupInput
              placeholder={tCommon("actions.searchPlaceholder")}
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex items-center gap-2">
          <HideColumnSelect tableState={tableState} />
          <CustomButton
            onClick={openCreateTagModal}
            color="orange"
            size={isMobile ? "icon" : "default"}
          >
            <IconPlus color="custom" />
            {!isMobile && <p>{tTag("createTag")}</p>}
          </CustomButton>
        </div>
      </div>

      <DataTable
        data={data}
        totalCount={tagsData?.payload.total || 0}
        tableState={tableState}
        extraColumns={extraColumns}
        isLoading={isTagsQueryLoading}
        error={tagsQueryError}
        onErrorRetry={refetchTags}
      />

      <BulkActionBar
        count={selectedIds.length}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />

      <UpsertTagModal
        mode={modeUpsertTagModal}
        onClose={closeUpsertTagModal}
        isOpen={isOpenUpsertTagModal}
        data={dataUpsertTagModal}
      />
    </div>
  );
}
