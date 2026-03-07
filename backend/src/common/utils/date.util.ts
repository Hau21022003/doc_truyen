import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export interface DateRangeInput {
  startDate?: string; // 2024-12-24
  endDate?: string; // 2024-12-24
  timezone: string; // Bắt buộc: 'America/New_York', 'Asia/Ho_Chi_Minh', etc.
}

export interface DateRangeOutput {
  utcStartDate?: string;
  utcEndDate?: string;
  timezone: string;
  originalStartDate?: string;
  originalEndDate?: string;
}

/**
 * Chuyển đổi ngày tháng từ timezone của người dùng sang UTC để query database
 */
export function createDateRangeInUTC(input: DateRangeInput): DateRangeOutput {
  const { startDate, endDate, timezone = 'UTC' } = input;

  if (!startDate && !endDate) {
    return { timezone };
  }

  let utcStartDate: string | undefined;
  let utcEndDate: string | undefined;

  if (startDate) {
    // Parse ngày tháng với timezone của người dùng
    // startOfDay trả về thời gian bắt đầu của ngày trong timezone của người dùng
    const startLocal = startOfDay(parseISO(startDate));
    // Chuyển đổi local time sang UTC
    const startUtc = fromZonedTime(startLocal, timezone);
    utcStartDate = startUtc.toISOString();
  }

  if (endDate) {
    // Parse ngày tháng với timezone của người dùng
    const endLocal = endOfDay(parseISO(endDate));
    // Chuyển đổi local time sang UTC
    const endUtc = fromZonedTime(endLocal, timezone);
    utcEndDate = endUtc.toISOString();
  }

  return {
    utcStartDate,
    utcEndDate,
    timezone,
    originalStartDate: startDate,
    originalEndDate: endDate,
  };
}
