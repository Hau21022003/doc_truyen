import http from "@/lib/http";
import { ViewStatsQuery, viewStatsQuerySchema } from "./report.schema";
import { DailyViewStat, StoryStats } from "./report.types";

export const reportService = {
  getStoryStats: () => http.get<StoryStats>("/story/stats"),

  getDailyViewStats: (params: ViewStatsQuery) => {
    if (!params) {
      return { payload: [] };
    }

    // 1. Convert date sang YYYY-MM-DD trước
    const formattedParams: ViewStatsQuery = {
      from: formatDateForApi(params.from),
      to: formatDateForApi(params.to),
    };

    // 2. Validate với schema
    viewStatsQuerySchema.parse(formattedParams);

    // 3. Mock tạm thời
    const mockData = generateMockDailyViews(
      formattedParams.from,
      formattedParams.to,
    );

    return {
      payload: mockData,
    };

    // 👉 Khi dùng API thật thì bật lại:
    // return http.get<DailyViewStat[]>("/story-views/daily", {
    //   params: formattedParams,
    // });
  },
};

// PRIVATE HELPER: convert Date|string to YYYY-MM-DD string
const formatDateForApi = (date: Date | string): string => {
  if (typeof date === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const generateMockDailyViews = (
  from: string | Date,
  to: string | Date,
): DailyViewStat[] => {
  const result: DailyViewStat[] = [];

  const start = new Date(from);
  const end = new Date(to);

  const current = new Date(start);

  while (current <= end) {
    const dateStr = current.toISOString().slice(0, 10);

    // Tạo số "giả nhưng ổn định" theo ngày
    // seed theo ngày (YYYYMMDD)
    const seed =
      current.getFullYear() * 10000 +
      (current.getMonth() + 1) * 100 +
      current.getDate();

    const rand = seededRandom(seed);
    const views = Math.floor(800 + rand * 2200); // 800 → 3000

    result.push({
      date: dateStr,
      totalViews: String(views),
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
