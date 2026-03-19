"use client";

import CustomButton from "@/components/custom-button";
import { EmptyData } from "@/components/empty-data";
import { AuthGuard } from "@/components/guards/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { ReadingHistoryItem } from "@/features/data/reading-history/components/reading-history-item";
import { useReadingHistoryQuery } from "@/features/data/reading-history/reading-history.query";
import { ReadingHistory } from "@/features/data/reading-history/reading-history.types";
import { SupportedLocale } from "@/i18n/routing";
import { getErrorMessage } from "@/lib/error";
import { dateUtils } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const groupHistoriesByDate = (
  histories: ReadingHistory[],
  locale: SupportedLocale,
) => {
  const grouped = histories.reduce(
    (acc, history) => {
      const dateKey = dateUtils.formatDate(history.updatedAt, {
        locale,
        format: "long",
      });

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(history);
      return acc;
    },
    {} as Record<string, ReadingHistory[]>,
  );

  return grouped;
};

export default function HistoryPage() {
  // locale - translate
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations();
  // State
  const [page, setPage] = useState(1);
  const [allHistories, setAllHistories] = useState<ReadingHistory[]>([]);
  const {
    data: historiesData,
    error: historiesQueryError,
    isLoading: isHistoriesQueryLoading,
    refetch: refetchHistories,
  } = useReadingHistoryQuery({ page, limit: 5 });

  // const groupedHistories = groupHistoriesByDate(histories, locale);

  // Accumulate histories khi fetch trang mới
  useEffect(() => {
    const newItems = historiesData?.payload.data;
    if (!newItems || newItems.length === 0) return;

    if (page === 1) {
      // Trang đầu: set thẳng, không cộng dồn
      setAllHistories(newItems);
    } else {
      // Các trang sau: cộng dồn vào danh sách
      setAllHistories((prev) => [...prev, ...newItems]);
    }
  }, [historiesData]);

  const canNext = page < (historiesData?.payload.totalPages || 0);

  const groupedHistories = groupHistoriesByDate(allHistories, locale);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto">
        {historiesQueryError ? (
          <div className="flex flex-col items-center">
            <div className="p-4 text-center text-red-500">
              {getErrorMessage(historiesQueryError)}
            </div>
            <CustomButton color="orange" onClick={() => refetchHistories()}>
              {t("common.actions.retry")}
            </CustomButton>
          </div>
        ) : (
          <div className="">
            <p className="text-xl font-semibold">
              {t("layout.UserHeader.history")}
            </p>

            <div className="mt-7 space-y-6">
              {Object.entries(groupedHistories).map(([date, dateHistories]) => (
                <div key={date}>
                  {/* Date header với bg-muted */}
                  <div className="py-2 mb-3">
                    <p className="text-sm font-medium">{date}</p>
                  </div>

                  {/* Histories của ngày đó */}
                  <ul className="space-y-6">
                    {dateHistories.map((history) => (
                      <ReadingHistoryItem key={history.id} history={history} />
                    ))}
                  </ul>
                </div>
              ))}

              {isHistoriesQueryLoading && (
                <ul className="space-y-6">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      className="flex items-start gap-4"
                      key={idx.toString()}
                    >
                      <Skeleton className="w-20 h-20 dark:bg-muted-foreground/50 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-3/5 dark:bg-muted-foreground/50" />
                        <Skeleton className="h-4 w-24 dark:bg-muted-foreground/50" />
                        <Skeleton className="h-4 w-32 dark:bg-muted-foreground/50" />
                      </div>
                    </div>
                  ))}
                </ul>
              )}
            </div>

            {canNext && (
              <div className="mt-7 flex flex-col items-center">
                <CustomButton onClick={handleLoadMore} color="orange">
                  {t("common.actions.loadMore")}
                </CustomButton>
              </div>
            )}

            {!isHistoriesQueryLoading && allHistories.length === 0 && (
              <EmptyData />
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
