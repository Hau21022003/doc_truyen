import { useEffect, useMemo } from "react";
import { TableColumnConfigMap, TableColumnKey } from "../table.types";
import { useTableColumns } from "./use-table-columns";

export function useTableColumnsPersist<TColumn extends TableColumnKey, TRow>(
  config: TableColumnConfigMap<TColumn, TRow>,
  storageKey: string,
) {
  const base = useTableColumns(config);

  // load storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        Object.keys(saved).forEach((k) => {
          base.setColumnVisible(k as TColumn, saved[k]);
        });
      }
    } catch {}
  }, [storageKey]); // Only run once on mount

  // save storage
  useMemo(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(base.visibleMap));
    } catch {}
  }, [base.visibleMap, storageKey]);

  return base;
}
