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
import { useStoryActions } from "@/features/data/story/hooks/use-story-actions";
import { useStoryFilter } from "@/features/data/story/hooks/use-story-filter";
import { useStoryTableConfig } from "@/features/data/story/hooks/use-story-table-config";
import {
  STORY_QUERY_KEYS,
  useStoriesQuery,
} from "@/features/data/story/story.query";
import { StoryQueryInput } from "@/features/data/story/story.schema";
import { Story } from "@/features/data/story/story.types";
import { FilterBar } from "@/features/shared/filter/components/filter-bar";
import { useTableState } from "@/features/shared/table";
import {
  DataTable,
  ExtraColumnConfig,
} from "@/features/shared/table/components/data-table";
import HideColumnSelect from "@/features/shared/table/components/hide-column-select";
import { useRowSelection, useTimeZone } from "@/hooks";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo } from "react";

export default function StoryPage() {
  const tStory = useTranslations("story");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { filterConfigs, params: filterParams } = useStoryFilter();
  const timezone = useTimeZone();

  // Bulk bar state
  const {
    selectedIds,
    isAllSelected,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
  } = useRowSelection<Story>();

  const { removeOne, removeMany } = useStoryActions();

  const handleDelete = async (tag: Story) => {
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
      timezone,
      ...filterParams,
    }),
    [
      tableState.pagination.pageSize,
      tableState.pagination.page,
      tableState.sort.column,
      tableState.sort.direction,
      timezone,
      filterParams,
    ],
  );

  useEffect(() => {
    tableState.pagination.setPage(1);
  }, [filterParams, tableState.sort.column, tableState.sort.direction]);

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
      render: (story) => (
        <div className="flex items-center justify-center h-full">
          <CustomCheckbox
            color={"purple"}
            checked={isSelected(story)}
            onCheckedChange={() => toggleRow(story)}
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
            className="[&_svg:not([class*='size-'])]:size-5"
            asChild
          >
            <Link href={`/admin/story/${story.id}/chapters`}>
              <IconBookOpenOutline color="custom" />
            </Link>
          </Button>
          <Button
            variant={"outline"}
            size="icon"
            asChild
            className="[&_svg:not([class*='size-'])]:size-5"
          >
            <Link href={`/admin/story/upsert?storyId=${story.id}`}>
              <IconPen color="custom" />
            </Link>
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
        <h3 className="font-medium">{tStory("title")}</h3>
        <div className="flex items-center gap-2">
          <HideColumnSelect tableState={tableState} />
          <CustomButton asChild color="orange">
            <Link href={`/admin/story/upsert`}>
              <IconPlus color="custom" />
              <p>{tStory("createStory")}</p>
            </Link>
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

      {/* <UpsertStoryModal
        mode={modeUpsertModal}
        onClose={closeUpsertModal}
        isOpen={isOpenUpsertModal}
        data={dataUpsertModal}
      /> */}
    </div>
  );
}
