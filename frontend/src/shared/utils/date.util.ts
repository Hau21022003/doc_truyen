/**
 * Date utility functions for the frontend
 */

/**
 * Format a date according to the specified locale
 */
export function formatDate(
  date: Date | string | number,
  options: {
    locale?: string;
    format?: "short" | "medium" | "long" | "full";
    includeTime?: boolean;
  } = {},
): string {
  const { locale = "vi", format = "medium", includeTime = false } = options;

  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  const formatOptions: Intl.DateTimeFormatOptions = includeTime
    ? {
        year: "numeric",
        month: format === "short" ? "short" : "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    : {
        year: "numeric",
        month: format === "short" ? "short" : "long",
        day: "numeric",
      };

  if (format === "full") {
    formatOptions.weekday = "long";
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

/**
 * Format a relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = "vi",
): string {
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  let interval;
  let unit: keyof typeof intervals = "minute";

  // Find the appropriate interval
  for (const [key, seconds] of Object.entries(intervals)) {
    if (Math.abs(diffInSeconds) > seconds) {
      interval = Math.floor(Math.abs(diffInSeconds) / seconds);
      unit = key as keyof typeof intervals;
      break;
    }
  }

  if (!interval) {
    unit = "minute";
    interval = Math.floor(Math.abs(diffInSeconds) / 60) || 1;
  }

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return formatter.format(-interval, unit);
}
