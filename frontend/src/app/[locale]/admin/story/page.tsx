"use client";

import { BulkActionBar } from "@/components/bulk-action-bar";
import CustomButton from "@/components/custom-button";
import CustomCheckbox from "@/components/custom-checkbox";
import {
  IconArchive,
  IconBookOpenOutline,
  IconPen,
  IconPlus,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilterBar } from "@/features/filter/components/filter-bar";
import UpsertStoryModal from "@/features/story/components/upsert-story-modal";
import { useStoryActions } from "@/features/story/hooks/use-story-actions";
import { useStoryFilter } from "@/features/story/hooks/use-story-filter";
import { useStoryTableConfig } from "@/features/story/hooks/use-story-table-config";
import {
  STORY_QUERY_KEYS,
  useStoriesQuery,
} from "@/features/story/story.query";
import { StoryQueryInput } from "@/features/story/story.schema";
import { Story } from "@/features/story/story.types";
import { useTableState } from "@/features/table";
import {
  DataTable,
  ExtraColumnConfig,
} from "@/features/table/components/data-table";
import HideColumnSelect from "@/features/table/components/hide-column-select";
import { useRowSelection, useUpsertModal } from "@/hooks";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function StoryPage() {
  const tStory = useTranslations("story");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { filterConfigs, params: filterParams } = useStoryFilter();

  // Bulk bar state
  const {
    selectedIds,
    isAllSelected,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
  } = useRowSelection<Story>();

  // Upsert modal state
  const {
    isOpen: isOpenUpsertModal,
    close: closeUpsertModal,
    data: dataUpsertModal,
    mode: modeUpsertModal,
    openCreate: openCreateModal,
    openEdit: openEditModal,
  } = useUpsertModal<Story>();

  const { removeOne, removeMany } = useStoryActions();

  const handleDelete = async (tag: Story) => {
    const success = await removeOne(tag);

    // Xóa ID khỏi danh sách chọn
    if (success && isSelected(tag)) {
      toggleRow(tag);
    }
  };

  const openChapterStory = (story: Story) => {
    router.push(`/admin/${story.id}/chapters`);
  };

  const handleBulkDelete = async () => {
    const success = await removeMany(selectedIds);
    if (success) clearSelection();
  };

  const tableConfig = useStoryTableConfig();

  const tableState = useTableState(tableConfig, {
    persistKey: STORY_QUERY_KEYS.lists().join(","),
    defaultPageSize: 10,
  });

  const searchParams: StoryQueryInput = useMemo(
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

  const {
    data: storiesData,
    error: storiesQueryError,
    isLoading: isStoriesQueryLoading,
    refetch: refetchStories,
  } = useStoriesQuery(searchParams);

  const data = storiesData?.payload.data ?? [];

  const extraColumns: ExtraColumnConfig<Story>[] = [
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
      render: (story) => (
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            size="icon"
            onClick={() => openChapterStory(story)}
            className="[&_svg:not([class*='size-'])]:size-5"
          >
            <IconBookOpenOutline color="custom" />
          </Button>
          <Button
            variant={"outline"}
            size="icon"
            onClick={() => openEditModal(story)}
            className="[&_svg:not([class*='size-'])]:size-5"
          >
            <IconPen color="custom" />
          </Button>
          <Button
            size="icon"
            variant={"outline"}
            onClick={() => handleDelete(story)}
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
        <h3>{tStory("title")}</h3>
        <div className="flex items-center gap-2">
          <HideColumnSelect tableState={tableState} />
          <CustomButton onClick={openCreateModal} color="orange">
            <IconPlus color="custom" />
            <p>{tStory("createStory")}</p>
          </CustomButton>
        </div>
      </div>
      <Separator />
      <FilterBar configs={filterConfigs} />
      <DataTable
        data={data}
        totalCount={storiesData?.payload.total || 0}
        tableState={tableState}
        extraColumns={extraColumns}
        isLoading={isStoriesQueryLoading}
        error={storiesQueryError}
        onErrorRetry={refetchStories}
      />

      <BulkActionBar
        count={selectedIds.length}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />

      <UpsertStoryModal
        mode={modeUpsertModal}
        onClose={closeUpsertModal}
        isOpen={isOpenUpsertModal}
        data={dataUpsertModal}
      />
    </div>
  );
}
