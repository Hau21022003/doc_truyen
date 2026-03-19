"use client";

import CustomButton from "@/components/custom-button";
import { EmptyData } from "@/components/empty-data";
import { AuthGuard } from "@/components/guards/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteBookmarkMutation } from "@/features/data/bookmark/bookmark.mutation";
import { useBookmarksQuery } from "@/features/data/bookmark/bookmark.query";
import { Bookmark } from "@/features/data/bookmark/bookmark.types";
import { BookmarkItem } from "@/features/data/bookmark/components/bookmark-item";
import { SupportedLocale } from "@/i18n/routing";
import { getErrorMessage } from "@/lib/error";
import { useConfirm } from "@/providers/confirm-provider";
import { stringUtils } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookmarkPage() {
  // locale - translate
  const locale = useLocale() as SupportedLocale;
  const tCommon = useTranslations("common");
  const t = useTranslations();
  // State
  const [page, setPage] = useState(1);
  const [allBookmark, setAllBookmark] = useState<Bookmark[]>([]);

  const {
    data: bookmarksData,
    error: bookmarksQueryError,
    isLoading: isBookmarksQueryLoading,
    refetch: refetchBookmarks,
  } = useBookmarksQuery({ page });

  // Accumulate allBookmark khi fetch trang mới
  useEffect(() => {
    const newItems = bookmarksData?.payload.data;
    if (!newItems || newItems.length === 0) return;

    if (page === 1) {
      // Trang đầu: set thẳng, không cộng dồn
      setAllBookmark(newItems);
    } else {
      // Các trang sau: cộng dồn vào danh sách
      setAllBookmark((prev) => [...prev, ...newItems]);
    }
  }, [bookmarksData]);

  const canNext = page < (bookmarksData?.payload.totalPages || 0);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const { confirm } = useConfirm();
  const { mutateAsync: removeBookmark } = useDeleteBookmarkMutation();
  const removeOne = useCallback(
    async (bookmark: Bookmark) => {
      const confirmed = await confirm({
        title: tCommon("actions.delete"),
        description: tCommon("delete.singleConfirm", {
          itemName: stringUtils.truncate(bookmark.story.title),
        }),
        variant: "destructive",
      });

      if (!confirmed) return false;

      await toast.promise(removeBookmark(bookmark.story.id), {
        loading: tCommon("actions.deleting"),
        success: () => {
          setPage(1);
          setAllBookmark([]);
          refetchBookmarks();
          return tCommon("delete.singleSuccess", {
            itemName: bookmark.story.title,
          });
        },
        error: (err) => getErrorMessage(err) || tCommon("delete.singleFailed"),
      });

      return true;
    },
    [confirm, tCommon, removeBookmark, getErrorMessage],
  );

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto">
        {bookmarksQueryError ? (
          <div className="flex flex-col items-center">
            <div className="p-4 text-center text-red-500">
              {getErrorMessage(bookmarksQueryError)}
            </div>
            <CustomButton color="orange" onClick={() => refetchBookmarks()}>
              {t("common.actions.retry")}
            </CustomButton>
          </div>
        ) : (
          <div className="">
            <p className="text-xl font-semibold">
              {t("layout.UserHeader.Bookmark")}
            </p>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {allBookmark.map((bookmark) => (
                <BookmarkItem
                  bookmark={bookmark}
                  key={bookmark.id}
                  onDelete={removeOne}
                />
              ))}

              {isBookmarksQueryLoading && (
                <>
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div
                      className="p-4 rounded-xl bg-muted dark:bg-muted-foreground/20 flex items-start gap-4"
                      key={idx.toString()}
                    >
                      <Skeleton className="w-20 h-20 dark:bg-muted-foreground/50 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-full max-w-2xs dark:bg-muted-foreground/50" />
                        <Skeleton className="h-4 w-24 dark:bg-muted-foreground/50" />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {canNext && (
              <div className="mt-7 flex flex-col items-center">
                <CustomButton onClick={handleLoadMore} color="orange">
                  {tCommon("actions.loadMore")}
                </CustomButton>
              </div>
            )}

            {!isBookmarksQueryLoading && allBookmark.length === 0 && (
              <EmptyData />
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
