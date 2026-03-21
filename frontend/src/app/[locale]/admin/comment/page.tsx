"use client";

import { BulkActionBar } from "@/components/bulk-action-bar";
import CustomCheckbox from "@/components/custom-checkbox";
import { IconArchive, IconDetailsMore } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentDetailModal } from "@/features/data/story-comment/components/comment-detail-modal";
import { useCommentActions } from "@/features/data/story-comment/hooks/use-comment-actions";
import { useCommentFilter } from "@/features/data/story-comment/hooks/use-comment-filter";
import { useCommentTableConfig } from "@/features/data/story-comment/hooks/use-comment-table-config";
import {
  STORY_COMMENTS_QUERY_KEYS,
  useCommentsQuery,
} from "@/features/data/story-comment/story-comment.query";
import { QueryCommentsInput } from "@/features/data/story-comment/story-comment.schema";
import { AdminStoryComment } from "@/features/data/story-comment/story-comment.types";
import { FilterBar } from "@/features/shared/filter/components/filter-bar";
import { useTableState } from "@/features/shared/table";
import {
  DataTable,
  ExtraColumnConfig,
} from "@/features/shared/table/components/data-table";
import HideColumnSelect from "@/features/shared/table/components/hide-column-select";
import { useRowSelection } from "@/hooks";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export default function CommentPage() {
  const tCommon = useTranslations("common");
  const tComment = useTranslations("comment");

  // Modal detail state
  const [detailCommentId, setDetailCommentId] = useState<number | null>(null);

  // Actions
  const {
    selectedIds,
    isAllSelected,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
  } = useRowSelection<AdminStoryComment>();

  const { removeOne, removeMany } = useCommentActions();

  const handleDelete = async (comment: AdminStoryComment) => {
    const success = await removeOne(comment);

    // Xóa ID khỏi danh sách chọn
    if (success && isSelected(comment)) {
      toggleRow(comment);
    }
  };

  const handleBulkDelete = async () => {
    const success = await removeMany(selectedIds);
    if (success) clearSelection();
  };

  // Table state
  const tableConfig = useCommentTableConfig();
  const tableState = useTableState(tableConfig, {
    persistKey: STORY_COMMENTS_QUERY_KEYS.queries().join(","),
    defaultPageSize: 10,
  });
  const { filterConfigs, params: filterParams } = useCommentFilter();
  const searchParams: QueryCommentsInput = useMemo(
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

  // Query
  const {
    data: commentsResponse,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useCommentsQuery(searchParams);
  const comments = commentsResponse?.payload?.data || [];

  // Extra columns
  const extraColumns: ExtraColumnConfig<AdminStoryComment>[] = [
    {
      key: "checkbox",
      render: (comment) => (
        <div className="flex items-center justify-center h-full">
          <CustomCheckbox
            color={"purple"}
            checked={isSelected(comment)}
            onCheckedChange={() => toggleRow(comment)}
          />
        </div>
      ),
      renderHeader() {
        return (
          <div className="flex items-center justify-center h-full">
            <CustomCheckbox
              color={"purple"}
              checked={isAllSelected(comments)}
              onCheckedChange={() => toggleAll(comments)}
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
      render: (comment) => (
        <div className="flex justify-center gap-2">
          <Button
            variant={"outline"}
            size="icon"
            onClick={() => setDetailCommentId(comment.id)}
            className="[&_svg:not([class*='size-'])]:size-5"
          >
            <IconDetailsMore color="custom" />
          </Button>
          <Button
            size="icon"
            variant={"outline"}
            onClick={() => handleDelete(comment)}
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
        <h3 className="font-medium">{tComment("adminTitle")}</h3>
        <div className="flex items-center gap-2">
          <HideColumnSelect tableState={tableState} />
        </div>
      </div>

      <Separator />

      <FilterBar configs={filterConfigs} />

      <DataTable
        data={comments}
        totalCount={commentsResponse?.payload.total || 0}
        tableState={tableState}
        extraColumns={extraColumns}
        isLoading={isCommentsLoading}
        error={commentsError}
        onErrorRetry={refetchComments}
      />

      <BulkActionBar
        count={selectedIds.length}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />

      <CommentDetailModal
        isOpen={detailCommentId !== null}
        commentId={detailCommentId}
        onClose={() => setDetailCommentId(null)}
      />
    </div>
  );
}
