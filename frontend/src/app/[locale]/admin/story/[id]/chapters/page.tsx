"use client";

import { BulkActionBar } from "@/components/bulk-action-bar";
import CustomButton from "@/components/custom-button";
import CustomCheckbox from "@/components/custom-checkbox";
import { IconArchive, IconPen, IconPlus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CHAPTERS_QUERY_KEYS,
  useStoryChaptersQuery,
} from "@/features/chapter/chapter.query";
import { ChapterQueryInput } from "@/features/chapter/chapter.schema";
import { Chapter } from "@/features/chapter/chapter.types";
import { useChapterActions } from "@/features/chapter/hooks/use-chapter-actions";
import { useChapterFilter } from "@/features/chapter/hooks/use-chapter-filter";
import { useChapterTableConfig } from "@/features/chapter/hooks/use-chapter-table-config";
import { FilterBar } from "@/features/filter/components/filter-bar";
import { useStoryQuery } from "@/features/story/story.query";
import { useTableState } from "@/features/table";
import {
  DataTable,
  ExtraColumnConfig,
} from "@/features/table/components/data-table";
import HideColumnSelect from "@/features/table/components/hide-column-select";
import { useRowSelection, useTimeZone } from "@/hooks";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function ChaptersPage() {
  const tChapter = useTranslations("chapter");
  const tCommon = useTranslations("common");
  const params = useParams<{ id: string }>();
  const storyId = params.id ? Number(params.id) : undefined;
  const timeZone = useTimeZone();

  const { data: storyData } = useStoryQuery(storyId);

  const { filterConfigs, params: filterParams } = useChapterFilter();

  // Bulk bar state
  const {
    selectedIds,
    isAllSelected,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
  } = useRowSelection<Chapter>();

  const { removeOne, removeMany } = useChapterActions();

  const handleDelete = async (tag: Chapter) => {
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

  const tableConfig = useChapterTableConfig();

  const tableState = useTableState(tableConfig, {
    persistKey: CHAPTERS_QUERY_KEYS.lists().join(","),
    defaultPageSize: 10,
  });

  const searchParams: ChapterQueryInput = useMemo(
    () => ({
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.page,
      sortBy: tableState.sort.column as any,
      sortOrder: tableState.sort.direction,
      timezone: timeZone,
      ...filterParams,
    }),
    [
      tableState.pagination.pageSize,
      tableState.pagination.page,
      tableState.sort.column,
      tableState.sort.direction,
      timeZone,
      filterParams,
    ],
  );

  const {
    data: chaptersData,
    error: chaptersQueryError,
    isLoading: isChaptersQueryLoading,
    refetch: refetchChapters,
  } = useStoryChaptersQuery({ storyId, params: searchParams });

  const data = chaptersData?.payload.data ?? [];

  const extraColumns: ExtraColumnConfig<Chapter>[] = [
    {
      key: "checkbox",
      render: (chapter) => (
        <div className="flex items-center justify-center h-full">
          <CustomCheckbox
            color={"purple"}
            checked={isSelected(chapter)}
            onCheckedChange={() => toggleRow(chapter)}
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
      render: (chapter) => (
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            size="icon"
            className="[&_svg:not([class*='size-'])]:size-5"
          >
            <Link
              href={`/admin/story/${storyId}/chapters/upsert?chapterId=${chapter.id}`}
            >
              <IconPen color="custom" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant={"outline"}
            onClick={() => handleDelete(chapter)}
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
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button
            size="icon"
            variant={"outline"}
            className="rounded-full"
            asChild
          >
            <Link href={"/admin/story"}>
              {/* <IconArrowUp color="custom" /> */}
              <ArrowLeft />
            </Link>
          </Button>
          <h3 className="flex-1 max-w-xl font-medium truncate">
            {tChapter("title", { title: storyData?.payload.title || "" })}
          </h3>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <HideColumnSelect tableState={tableState} />
          <CustomButton color="orange" asChild>
            <Link href={`/admin/story/${storyId}/chapters/upsert`}>
              <IconPlus color="custom" />
              <p>{tChapter("createChapter")}</p>
            </Link>
          </CustomButton>
        </div>
      </div>

      <Separator />

      <FilterBar configs={filterConfigs} />
      <DataTable
        data={data}
        totalCount={data.length || 0}
        tableState={tableState}
        extraColumns={extraColumns}
        isLoading={isChaptersQueryLoading}
        error={chaptersQueryError}
        onErrorRetry={refetchChapters}
      />

      <BulkActionBar
        count={selectedIds.length}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />
    </div>
  );
}
