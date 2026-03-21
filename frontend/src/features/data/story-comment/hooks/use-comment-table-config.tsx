import { ExpandableText } from "@/components/expandable-text";
import { TableColumnConfigMap } from "@/features/shared/table";
import { SupportedLocale } from "@/i18n/routing";
import { dateUtils, imageUtils } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import CommentFlagStatus from "../components/comment-flag-status";
import {
  COMMENT_COLUMNS,
  CommentColumn,
  isCommentSortableColumn,
} from "../story-comment.constants";
import { AdminStoryComment } from "../story-comment.types";

export const useCommentTableConfig = () => {
  const tCommentColumns = useTranslations("comment.columns");
  const locale = useLocale() as SupportedLocale;

  const tableConfig: TableColumnConfigMap<CommentColumn, AdminStoryComment> =
    useMemo(
      () => ({
        storyTitle: {
          label: tCommentColumns(COMMENT_COLUMNS.STORY_TITLE),
          defaultVisible: true,
          resizable: true,
          sortable: isCommentSortableColumn(COMMENT_COLUMNS.STORY_TITLE),
          render: (comment) => {
            return (
              <div className="flex items-start gap-2">
                <img
                  src={imageUtils.optimizeCloudinary(
                    comment.story?.coverImage || "",
                    { height: 80, width: 80 },
                  )}
                  alt=""
                  className="shrink-0 w-14 h-14"
                />
                <p className="line-clamp-2">{comment.story?.title}</p>
              </div>
            );
          },
        },
        userName: {
          label: tCommentColumns(COMMENT_COLUMNS.USER_NAME),
          defaultVisible: true,
          resizable: true,
          sortable: isCommentSortableColumn(COMMENT_COLUMNS.USER_NAME),
          render: (comment) => {
            return <p>{comment.user?.name || comment.guestName || "-"}</p>;
          },
        },
        content: {
          label: tCommentColumns(COMMENT_COLUMNS.CONTENT),
          defaultVisible: true,
          resizable: true,
          sortable: isCommentSortableColumn(COMMENT_COLUMNS.CONTENT),
          render: (comment) => {
            return <ExpandableText text={comment.content} maxLength={100} />;
          },
        },
        // isFlagged: {
        //   label: tCommentColumns(COMMENT_COLUMNS.IS_FLAGGED),
        //   defaultVisible: true,
        //   resizable: true,
        //   width: 120,
        //   sortable: isCommentSortableColumn(COMMENT_COLUMNS.IS_FLAGGED),
        //   render: (comment) => (
        //     <CommentFlagStatus
        //       isFlagged={comment.isFlagged}
        //       flagCount={comment.flagCount}
        //     />
        //   ),
        // },
        flagCount: {
          label: tCommentColumns(COMMENT_COLUMNS.FLAG_COUNT),
          defaultVisible: false,
          resizable: true,
          width: 80,
          sortable: isCommentSortableColumn(COMMENT_COLUMNS.FLAG_COUNT),
          // format: (value) => numberUtils.formatNumberWithCommas(value || 0),
          render: (comment) => (
            <CommentFlagStatus
              isFlagged={comment.isFlagged}
              flagCount={comment.flagCount}
            />
          ),
        },
        createdAt: {
          label: tCommentColumns(COMMENT_COLUMNS.CREATED_AT),
          defaultVisible: true,
          resizable: true,
          sortable: isCommentSortableColumn(COMMENT_COLUMNS.CREATED_AT),
          format: (value) => dateUtils.formatDate(value, { locale }),
        },
        updatedAt: {
          label: tCommentColumns(COMMENT_COLUMNS.UPDATED_AT),
          defaultVisible: false,
          resizable: true,
          sortable: isCommentSortableColumn(COMMENT_COLUMNS.UPDATED_AT),
          format: (value) => dateUtils.formatDate(value, { locale }),
        },
      }),
      [tCommentColumns, locale],
    );

  return tableConfig;
};
