"use client";

import CustomButton from "@/components/custom-button";
import { IconCalendarOutline, IconChartFill } from "@/components/icons";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyViewStats } from "@/features/data/report/report.query";
import { FILTER_TYPE } from "@/features/shared/filter/filter.constants";
import { FilterConfig } from "@/features/shared/filter/filter.types";
import { DateRangeFilterContent } from "@/features/shared/filter/popovers";
import { SupportedLocale } from "@/i18n/routing";
import { getErrorMessage } from "@/lib/error";
import { dateUtils } from "@/shared/utils";
import { numberUtils } from "@/shared/utils/number.utils";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  totalViews: {
    label: "Views",
    color: "var(--color-primary-orange)",
  },
} satisfies ChartConfig;

// Helper để format ngày từ "2026-03-18" sang "18/03" hoặc format khác
const formatDate = (dateStr: string, locale: SupportedLocale) => {
  const date = new Date(dateStr);

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
};

export function DailyViewChart() {
  const t = useTranslations();
  const locale = useLocale() as SupportedLocale;

  const today = new Date();
  const to = today.toISOString().slice(0, 10);

  const fromDate = new Date();
  fromDate.setDate(today.getDate() - 6);
  const from = fromDate.toISOString().slice(0, 10);

  const [dateRange, setDateRange] = useState<{
    from: string | Date;
    to: string | Date;
  } | null>({
    from,
    to,
  });

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useDailyViewStats(dateRange);

  const chartData =
    stats?.payload?.map((stat) => ({
      date: stat.date,
      views: Number(stat.totalViews),
      displayDate: formatDate(stat.date, locale),
    })) ?? [];

  // Tính tổng views
  const totalViews = chartData.reduce((sum, stat) => sum + stat.views, 0);

  const selectDateConfig: FilterConfig<typeof FILTER_TYPE.DATE_RANGE> = {
    key: "date-range",
    defaultVisible: true,
    label: "",
    type: "date-range",
  };

  return (
    <section className="p-4 rounded-xl bg-muted space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconChartFill color="custom" className="text-blue-400" />
          <p className="font-semibold truncate">
            {t("dashboard.dailyViewsTitle")}
          </p>
        </div>
        {/* Button calendar */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-accent-foreground/20">
              <IconCalendarOutline />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 flex flex-col items-center w-fit"
            align={"end"}
          >
            <DateRangeFilterContent
              config={selectDateConfig}
              onChange={(value) => {
                setDateRange(value);
              }}
              value={dateRange}
              onClose={() => {}}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* Error */}
      {error && (
        <div className="mt-4 flex flex-col items-center">
          <div className="p-4 text-center text-red-500">
            {getErrorMessage(error)}
          </div>
          <CustomButton color="orange" onClick={() => refetch()}>
            {t("common.actions.retry")}
          </CustomButton>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="mt-4 grid grid-cols-10 gap-4 h-56 items-end">
          {Array.from({ length: 10 }).map((_, i) => {
            const height = Math.floor(Math.random() * 60) + 40; // 40% -> 100%

            return (
              <Skeleton
                key={i}
                className="w-full rounded-md bg-muted-foreground/40"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      )}

      {/* Chart */}
      {!isLoading && chartData.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          {t("dashboard.noData")}
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <p className="text-3xl font-semibold">
              {numberUtils.formatNumberWithCommas(totalViews)}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("dashboard.totalViews")}
            </p>
          </div>
          <ChartContainer config={chartConfig} className="mt-5">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  numberUtils.formatCompactNumber(Number(value))
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label, payload) =>
                      dateUtils.formatDate(payload?.[0]?.payload?.date, {
                        locale,
                      }) || label
                    }
                    formatter={(value) =>
                      numberUtils.formatNumberWithCommas(Number(value))
                    }
                  />
                }
              />
              <Bar dataKey="views" fill="var(--color-totalViews)" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </section>
  );
}
