"use client";

import { IconArchive, IconPen } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TableColumnConfigMap, useTableState } from "@/features/table";
import {
  DataTable,
  ExtraColumnConfig,
} from "@/features/table/components/data-table";
import { TAG_COLUMNS, TagColumn } from "@/features/tags/tags.constants";
import { TAGS_QUERY_KEYS, useTagsQuery } from "@/features/tags/tags.query";
import { Tag } from "@/features/tags/tags.types";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { useConfirm } from "@/providers/confirm-provider";
import { useAuthStore } from "@/shared/stores";
import { formatDate, truncate } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";

export default function TagsPage() {
  const t = useTranslations("tags");
  const locale = useLocale() as (typeof SUPPORTED_LOCALES)[number];
  const { user } = useAuthStore();
  const { confirm } = useConfirm();

  const handleOpenEditModal = (tag: Tag) => {};

  const handleDelete = async (tag: Tag) => {
    const confirmed = await confirm({
      title: t("delete"),
      description: t("deleteConfirm", {
        name: truncate(tag.name),
      }),
      confirmText: t("confirm"),
      cancelText: t("cancel"),
      variant: "destructive",
    });

    if (confirmed) {
      console.log("delete", tag.id);
    }
  };

  const tableConfig: TableColumnConfigMap<TagColumn, Tag> = {
    name: {
      label: t(TAG_COLUMNS.NAME),
      defaultVisible: true,
      resizable: true,
      sortable: true,
    },
    slug: {
      label: t(TAG_COLUMNS.SLUG),
      defaultVisible: true,
      resizable: true,
    },
    storyCount: {
      label: t(TAG_COLUMNS.STORY_COUNT),
      defaultVisible: true,
      resizable: true,
    },
    createdAt: {
      label: t(TAG_COLUMNS.CREATED_AT),
      defaultVisible: true,
      resizable: true,
      sortable: true,
      format: (value) =>
        formatDate(value, { locale, timeZone: user?.timezone }),
    },
    updatedAt: {
      label: t(TAG_COLUMNS.UPDATED_AT),
      defaultVisible: true,
      resizable: true,
      sortable: true,
      format: (value) =>
        formatDate(value, { locale, timeZone: user?.timezone }),
    },
  };

  const extraColumns: ExtraColumnConfig<Tag>[] = [
    {
      key: "actions",
      width: 150,
      align: "center",
      sticky: "right",
      label: "Actions",
      render: (tag, index) => (
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            size="icon"
            onClick={() => handleOpenEditModal(tag)}
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

  const tableState = useTableState(tableConfig, {
    persistKey: TAGS_QUERY_KEYS.lists().join(","),
    defaultPageSize: 10,
  });

  const {
    data: tagsData,
    isError: isTagsQueryError,
    isLoading: isTagsQueryLoading,
  } = useTagsQuery({
    limit: tableState.pagination.pageSize,
    page: tableState.pagination.page,
    // search: tableState.
    sortBy: tableState.sort.column as any,
    sortOrder: tableState.sort.direction,
  });

  return (
    <div className="p-4 md:p-6 ">
      <DataTable
        data={tagsData?.payload.data || []}
        totalCount={tagsData?.payload.total || 0}
        tableState={tableState}
        extraColumns={extraColumns}
        isLoading={isTagsQueryLoading}
      />
    </div>
  );
}
