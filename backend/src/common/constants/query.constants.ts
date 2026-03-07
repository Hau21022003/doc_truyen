// backend/src/common/constants/query.constants.ts
export const QUERY_SEPARATORS = {
  LIST: ',', // Ngăn cách các phần tử trong mảng
} as const;

export enum SortDirections {
  ASC = 'ASC',
  DESC = 'DESC',
}
