import { SORT_DIRECTIONS, SortDirection } from "@/shared/constants";
import { useState } from "react";
import {
  TableColumnConfigMap,
  TableColumnKey,
  TableState,
} from "../table.types";
import { useTableColumns } from "./use-table-columns";
import { useTableColumnsPersist } from "./use-table-columns-persist";

/**
 * Hook quản lý toàn bộ state của một table
 * @param TColumn - Union type của các key column (ví dụ: 'id' | 'name' | 'email')
 * @param TRow - Type object định nghĩa cấu trúc dữ liệu của mỗi row
 * @param options.persistKey - Key để lưu trạng thái cột vào localStorage
 * @param config - Đối tượng config các cột của table, theo cấu trúc của TableColumnConfigMap
 * @example
 * const userConfig: TableColumnConfigMap<'id' | 'name', User> = {
 *   id: { label: "ID", defaultVisible: true },
 *   name: { label: "Name", defaultVisible: true }
 * }
 * @returns Object chứa state và helper functions với các thuộc tính:
 *   - Từ column hooks: config, visibleMap, visibleColumns, visibleColumnConfigs
 *   - Từ column hooks: toggleColumn, setColumnVisible, resetColumns
 *   - sort: column, direction, setSort, toggleSort
 *   - pagination: page, pageSize, setPagination, setPage, setPageSize
 */
export function useTableState<TColumn extends TableColumnKey, TRow>(
  config: TableColumnConfigMap<TColumn, TRow>,
  options?: {
    persistKey?: string;
    defaultPageSize?: number;
  },
): TableState<TColumn, TRow> {
  // Column visibility
  const columnHooks = options?.persistKey
    ? useTableColumnsPersist(config, options.persistKey)
    : useTableColumns(config);

  // Sorting state
  const [sortState, setSortState] = useState<{
    column: TColumn | null;
    direction: SortDirection;
  }>({ column: null, direction: SORT_DIRECTIONS.ASC });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: options?.defaultPageSize || 10,
  });

  // Combined return value
  return {
    ...columnHooks,
    sort: {
      ...sortState,
      setSort: setSortState,
      toggleSort: (column: TColumn) => {
        if (sortState.column === column) {
          setSortState((prev) => ({
            ...prev,
            direction:
              prev.direction === SORT_DIRECTIONS.ASC
                ? SORT_DIRECTIONS.DESC
                : SORT_DIRECTIONS.ASC,
          }));
        } else {
          setSortState({ column, direction: SORT_DIRECTIONS.ASC });
        }
      },
    },
    pagination: {
      ...pagination,
      setPagination,
      setPage: (page: number) => setPagination((prev) => ({ ...prev, page })),
      setPageSize: (pageSize: number) =>
        setPagination((prev) => ({ ...prev, pageSize, page: 1 })),
    },
  };
}
