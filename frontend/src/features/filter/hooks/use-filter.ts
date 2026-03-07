import { useMemo, useState } from "react";
import { AnyFilterConfig, FilterStateMap, FilterValue } from "../filter.types";

// Helper function để so sánh 2 filter state
const isFilterStateChanged = (
  currentState: FilterStateMap,
  initialState: FilterStateMap,
): boolean => {
  const currentKeys = Object.keys(currentState);
  const initialKeys = Object.keys(initialState);

  if (currentKeys.length !== initialKeys.length) return true;

  return currentKeys.some((key) => {
    const current = currentState[key];
    const initial = initialState[key];
    return (
      current.visible !== initial.visible || current.value !== initial.value
    );
  });
};

export function useFilter(config: AnyFilterConfig[]) {
  const initialState = useMemo(() => {
    const init = {} as FilterStateMap;
    config.forEach((f) => {
      init[f.key] = {
        visible: f.defaultVisible,
        value: f.defaultValue ?? null,
      };
    });
    return init;
  }, [config]);

  const [filterStateMap, setFilterStateMap] =
    useState<FilterStateMap>(initialState);

  const visibleFilters = useMemo(() => {
    return Object.keys(filterStateMap).filter((f) => filterStateMap[f].visible);
  }, [filterStateMap]);

  // Kiểm tra xem có thay đổi so với trạng thái khởi tạo không
  const hasChanged = useMemo(() => {
    return isFilterStateChanged(filterStateMap, initialState);
  }, [filterStateMap, initialState]);

  const toggleFilter = (key: string) => {
    setFilterStateMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        visible: !prev[key].visible,
      },
    }));
  };

  const updateFilterValue = (key: string, value: FilterValue) => {
    setFilterStateMap((prev) => {
      const newFilterState = {
        ...prev,
        [key]: {
          ...prev[key],
          value,
        },
      };

      // Gọi callback nếu có
      const filterConfig = config.find((f) => f.key === key);
      if (filterConfig?.onChange) {
        (filterConfig as any).onChange(value);
      }

      return newFilterState;
    });
  };

  const resetFilters = () => {
    setFilterStateMap(initialState);

    // Gọi callbacks với giá trị reset
    config.forEach((filterConfig) => {
      const initialValue = filterConfig.defaultValue ?? null;
      if (filterConfig?.onChange) {
        (filterConfig as any).onChange(initialValue);
      }
    });
  };

  return {
    filterStateMap, // State tổng hợp
    visibleFilters, // Danh sách filter hiển thị
    hasChanged, // Có thay đổi so với mặc định không

    toggleFilter, // Toggle visible
    updateFilterValue, // Cập nhật value
    resetFilters, // Reset về mặc định
  };
}
