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

  const toggleAll = useCallback((items: T[]) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      const allSelected = items.every((item) => newSet.has(item.id));

      if (allSelected) {
        // remove current items
        items.forEach((item) => newSet.delete(item.id));
      } else {
        // add current items
        items.forEach((item) => newSet.add(item.id));
      }

      return newSet;
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
