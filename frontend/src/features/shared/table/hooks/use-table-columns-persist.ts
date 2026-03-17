import { useEffect, useMemo } from "react";
import {
  TableColumnConfigMap,
  TableColumnKey,
  TableColumnsState,
} from "../table.types";
import { useTableColumns } from "./use-table-columns";

export function useTableColumnsPersist<TColumn extends TableColumnKey, TRow>(
  config: TableColumnConfigMap<TColumn, TRow>,
  storageKey: string,
): TableColumnsState<TColumn, TRow> {
  const initialState = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  }, [storageKey]);

  const base = useTableColumns(config, initialState);

  useEffect(() => {
    try {
      const result: Record<string, any> = {};

      Object.keys(base.columns).forEach((key) => {
        result[key] = {
          visible: base.columns[key as TColumn].visible,
          width: base.columns[key as TColumn].width,
        };
      });

      localStorage.setItem(storageKey, JSON.stringify(result));
    } catch (error) {
      console.error("Failed to save column state:", error);
    }
  }, [base.columns, storageKey]);

  return base;
}
