// hooks/use-row-selection.ts
import { useCallback, useMemo, useState } from "react";

export function useRowSelection<T extends { id: number | string }>() {
  const [selectedRows, setSelectedRows] = useState<Set<T["id"]>>(new Set());

  const toggleRow = useCallback((item: T) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
      } else {
        newSet.add(item.id);
      }
      return newSet;
    });
  }, []);

  // const toggleAll = useCallback((items: T[]) => {
  //   setSelectedRows((prev) => {
  //     // Nếu tất cả đều được chọn, xóa hết
  //     if (
  //       prev.size === items.length &&
  //       items.every((item) => prev.has(item.id))
  //     ) {
  //       return new Set();
  //     }

  //     // Nếu không, chọn tất cả
  //     return new Set(items.map((item) => item.id));
  //   });
  // }, []);

  const toggleAll = useCallback((items: T[]) => {
    setSelectedRows((prev) => {
      const allSelected = items.every((item) => prev.has(item.id));

      if (allSelected) {
        const newSet = new Set(prev);
        items.forEach((item) => newSet.delete(item.id));
        return newSet;
      }

      return new Set(items.map((item) => item.id));
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const isSelected = useCallback(
    (item: T) => {
      return selectedRows.has(item.id);
    },
    [selectedRows],
  );

  const isAllSelected = useCallback(
    (items: T[]) =>
      items.length > 0 && items.every((item) => selectedRows.has(item.id)),
    [selectedRows],
  );

  const selectedIds = useMemo(() => Array.from(selectedRows), [selectedRows]);

  return {
    selectedRows,
    selectedIds,
    selectedCount: selectedRows.size,
    isAllSelected,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
  };
}
