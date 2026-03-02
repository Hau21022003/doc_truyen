import { DateRange } from "react-day-picker";

export type PresetKey =
  | "today"
  | "last7Days"
  | "last30Days"
  | "thisMonth"
  | "lastMonth";

export const DATE_RANGE_PRESETS: Record<PresetKey, () => DateRange> = {
  today: () => {
    const today = new Date();
    return { from: today, to: today };
  },

  last7Days: () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 6);
    return { from, to };
  },

  last30Days: () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 29);
    return { from, to };
  },

  thisMonth: () => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1),
      to: new Date(),
    };
  },

  lastMonth: () => {
    const now = new Date();
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return {
      from: firstDayOfLastMonth,
      to: lastDayOfLastMonth,
    };
  },
};
