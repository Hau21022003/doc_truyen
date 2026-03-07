export const QUERY_SEPARATORS = {
  LIST: ",", // Ngăn cách các phần tử trong mảng
} as const;

export const SORT_DIRECTIONS = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

export const SORT_DIRECTION_VALUES = Object.values(SORT_DIRECTIONS) as [
  SortDirection,
  ...SortDirection[],
];
