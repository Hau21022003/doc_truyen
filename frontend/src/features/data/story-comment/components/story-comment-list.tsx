"use client";

import { IconFirst, IconLast } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import { numberUtils } from "@/shared/utils/number.utils";
import { getPaginationPages } from "@/shared/utils/pagination.utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useStoryCommentsQuery } from "../story-comment.query";
import { ReportCommentModal } from "./report-comment-modal";
import StoryCommentItem from "./story-comment-item";

export default function StoryCommentList({
  storyId,
  chapterId,
}: {
  storyId: number;
  chapterId?: number;
}) {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null,
  );

  const {
    data: commentsData,
    isLoading,
    error,
  } = useStoryCommentsQuery({
    storyId,
    chapterId,
    page: currentPage,
  });

  const comments = commentsData?.payload.data || [];
  const totalPages = commentsData?.payload.totalPages || 1;
  const pages = getPaginationPages(currentPage, totalPages);

  const handleOpenReportModal = (commentId: number) => {
    setSelectedCommentId(commentId);
    setIsOpenReportModal(true);
  };

  const handleCloseReportModal = () => {
    setIsOpenReportModal(false);
    setSelectedCommentId(null);
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {getErrorMessage(error) || t("common.notification.fetchError")}
      </div>
    );
  }

  return (
    <div>
      {commentsData && commentsData.payload.total !== 0 && (
        <p className="text-lg font-semibold">
          {numberUtils.formatNumberWithCommas(commentsData.payload.total)}{" "}
          Comments
        </p>
      )}
      <ul className="mt-4 space-y-7">
        {isLoading &&
          Array.from({ length: 3 }).map((i) => (
            <li key={`skeleton_${i}`}>
              <div className="flex gap-4 items-start animate-pulse">
                <Skeleton className="w-14 h-14 rounded-full shrink-0 dark:bg-muted-foreground/50" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 dark:bg-muted-foreground/50" />
                  <Skeleton className="h-4 w-full dark:bg-muted-foreground/50" />
                  <Skeleton className="h-4 w-3/4 dark:bg-muted-foreground/50" />
                  <Skeleton className="h-4 w-24 dark:bg-muted-foreground/50" />
                </div>
              </div>
            </li>
          ))}
        {comments.map((comment) => (
          <li key={comment.id}>
            <StoryCommentItem
              comment={comment}
              onReport={() => handleOpenReportModal(comment.id)}
            />
          </li>
        ))}
      </ul>
      {commentsData && commentsData.payload.totalPages !== 0 && (
        <div className="mt-7 flex items-center justify-center flex-wrap gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            size={"icon"}
            variant={"outline"}
            className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
          >
            <IconFirst size="sm" color="custom" />
          </Button>
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={index} className="text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={index}
                variant={"outline"}
                onClick={() => setCurrentPage(page)}
                className={`size-9 rounded-md flex items-center justify-center ${
                  page === currentPage
                    ? "bg-primary-orange dark:bg-primary-orange hover:dark:bg-primary-orange text-primary-orange-foreground border-primary-orange"
                    : "hover:bg-muted hover:text-primary border border-muted rounded-md text-sm text-muted-foreground"
                }`}
              >
                {page}
              </Button>
            ),
          )}
          <Button
            onClick={() => setCurrentPage(totalPages)}
            size={"icon"}
            variant={"outline"}
            className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
            disabled={currentPage === totalPages}
          >
            <IconLast size="sm" color="custom" />
          </Button>
        </div>
      )}

      <ReportCommentModal
        isOpen={isOpenReportModal}
        commentId={selectedCommentId}
        onClose={handleCloseReportModal}
      />
    </div>
  );
}
