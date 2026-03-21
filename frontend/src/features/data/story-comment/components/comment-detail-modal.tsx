"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SupportedLocale } from "@/i18n/routing";
import { getErrorMessage } from "@/lib/error";
import { dateUtils } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";
import { useCommentDetailQuery } from "../story-comment.query";

interface CommentDetailModalProps {
  isOpen: boolean;
  commentId: number | null;
  onClose: () => void;
}

const COMMENT_REPORT_REASON_MAP: Record<string, string> = {
  spam: "Spam",
  offensive: "Nội dung xúc phạm",
  inappropriate: "Không phù hợp",
  harassment: "Qu騷rối",
  misinformation: "Thông tin sai lệch",
  other: "Khác",
};

export function CommentDetailModal({
  isOpen,
  commentId,
  onClose,
}: CommentDetailModalProps) {
  const tCommon = useTranslations("common");
  const tComment = useTranslations("comment");
  const locale = useLocale() as SupportedLocale;

  const {
    data: detail,
    isLoading,
    error,
  } = useCommentDetailQuery(commentId ?? 0);

  const comment = detail?.payload;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl max-h-[85vh] max-h-[85vh] flex flex-col"
      >
        <DialogHeader className="items-center">
          <DialogTitle>{tComment("detailModal.title")}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-2">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-muted-foreground">
              {getErrorMessage(error) || tCommon("notification.fetchError")}
            </div>
          ) : comment ? (
            <div className="space-y-6">
              {/* Comment Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {tComment("detailModal.story")}
                  </p>
                  <p className="font-medium">{comment.story?.title || "-"}</p>
                </div>

                <Separator />

                {/* User Info */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tComment("detailModal.author")}
                  </p>
                  <div className="flex items-center gap-3">
                    {comment.user ? (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>
                            {comment.user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {comment.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {comment.user.email}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="font-medium text-sm">
                        {comment.guestName || "-"}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Comment Content */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {tComment("detailModal.content")}
                  </p>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                {/* <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div>
                      {tComment("detailModal.createdAt")}:{" "}
                      {dateUtils.formatDate(comment.createdAt, { locale })}
                    </div>
                    {comment.isFlagged && (
                      <Badge variant="destructive">
                        {tComment("detailModal.flagged")} ({comment.flagCount})
                      </Badge>
                    )}
                  </div> */}
              </div>

              {/* Reports Section */}
              {comment.reports && comment.reports.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {tComment("detailModal.reports")}
                      </p>
                      <Badge variant="outline">{comment.reports.length}</Badge>
                    </div>

                    <div className="space-y-2">
                      {comment.reports.map((report) => (
                        <div
                          key={report.id}
                          className="border rounded-lg p-3 bg-muted/50 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                {COMMENT_REPORT_REASON_MAP[report.reason] ||
                                  report.reason}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {tComment("detailModal.reportedBy")}:{" "}
                                {report.reporter?.name || "-"}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {dateUtils.formatDate(report.createdAt, {
                                locale,
                              })}
                            </p>
                          </div>

                          {report.description && (
                            <p className="text-sm text-muted-foreground">
                              {report.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {tCommon("actions.close")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
