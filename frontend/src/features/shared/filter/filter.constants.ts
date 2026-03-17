export const FILTER_TYPE = {
  TEXT: "text",
  SELECT: "select",
  COMBOBOX: "combobox",
  DATE_RANGE: "date-range",
} as const;

export type FilterType = (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE];
