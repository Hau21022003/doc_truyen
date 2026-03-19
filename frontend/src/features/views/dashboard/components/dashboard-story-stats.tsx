"use client";

import {
  IconCheckCircleOutline,
  IconPlus,
  IconRoundArrow,
  IconStopOutline,
} from "@/components/icons";
import { useStoryStatsQuery } from "@/features/data/report/report.query";
import { cn } from "@/lib/utils";
import { numberUtils } from "@/shared/utils/number.utils";
import { useTranslations } from "next-intl";

const statsConfig = [
  {
    key: "total",
    icon: IconPlus,
    iconClass: "bg-muted-foreground/30",
  },
  {
    key: "ongoing",
    icon: IconRoundArrow,
    iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100",
  },
  {
    key: "completed",
    icon: IconCheckCircleOutline,
    iconClass:
      "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-100",
  },
  {
    key: "hiatus",
    icon: IconStopOutline,
    iconClass: "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-100",
  },
];

export function DashboardStoryStats() {
  const tDashboard = useTranslations("dashboard");
  const { data: statsData, isLoading, error } = useStoryStatsQuery();
  const stats = statsData?.payload;

  if (error) return <div>Error loading stats</div>;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 ">
      {stats && (
        <>
          {statsConfig.map(({ key, icon: Icon, iconClass }) => (
            <div key={key} className="bg-muted p-4 rounded-xl">
              <div className="flex items-center gap-2 justify-between">
                <p className="font-medium truncate">{tDashboard(key)}</p>

                <div
                  className={cn(
                    "h-9 w-9 flex items-center justify-center rounded-md [&_svg:not([class*='size-'])]:size-5",
                    iconClass,
                  )}
                >
                  <Icon color="custom" />
                </div>
              </div>

              <p className="text-3xl font-semibold mt-4">
                {numberUtils.formatCompactNumber(
                  stats[key as keyof typeof stats],
                )}
              </p>

              <p className="text-muted-foreground text-sm mt-1">
                {tDashboard(`${key}_desc`)}
              </p>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
