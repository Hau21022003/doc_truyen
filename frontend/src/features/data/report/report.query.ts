import { useQuery } from "@tanstack/react-query";
import { ViewStatsQuery } from "./report.schema";
import { reportService } from "./report.service";

export const REPORT_QUERY_KEYS = {
  all: ["reports"],
  storyStats: () => [...REPORT_QUERY_KEYS.all, "story-stats"],
  dailyViewStats: (params: ViewStatsQuery) => [
    ...REPORT_QUERY_KEYS.all,
    "daily-view-stats",
    params,
  ],
};

export const useStoryStatsQuery = () => {
  return useQuery({
    queryKey: REPORT_QUERY_KEYS.storyStats(),
    queryFn: () => reportService.getStoryStats(),
  });
};

export const useDailyViewStats = (params: ViewStatsQuery) => {
  return useQuery({
    queryKey: ["daily-view-stats", params],
    queryFn: () => reportService.getDailyViewStats(params),
    // enabled: !!params.from && !!params.to,
    // enabled: true - luôn enabled vì service sẽ handle null
    staleTime: 0,
  });
};
