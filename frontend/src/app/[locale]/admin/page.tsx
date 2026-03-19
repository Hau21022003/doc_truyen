"use client";

import { DashboardTopStories } from "@/features/views/dashboard/components";
import { DailyViewChart } from "@/features/views/dashboard/components/daily-view-chart";
import { DashboardStoryStats } from "@/features/views/dashboard/components/dashboard-story-stats";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const tDashboard = useTranslations("dashboard");
  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-6xl py-4 space-y-6">
        <p className="text-2xl font-medium mt-4">{tDashboard("title")}</p>
        {/* 4 card thống kê số truyện, số  */}
        <DashboardStoryStats />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] items-start gap-6">
          <DailyViewChart />
          <DashboardTopStories />
        </div>
      </div>
    </div>
  );
}
