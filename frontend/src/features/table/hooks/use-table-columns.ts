import { useCallback, useMemo, useState } from "react";
import {
  TableColumnConfigMap,
  TableColumnKey,
  TableColumnsState,
  VisibleColumnConfig,
  VisibleState,
} from "../table.types";

export function useTableColumns<TColumn extends TableColumnKey, TRow>(
  config: TableColumnConfigMap<TColumn, TRow>,
): TableColumnsState<TColumn, TRow> {
  const [visibleMap, setVisibleMap] = useState<VisibleState<TColumn>>(() => {
    const init = {} as VisibleState<TColumn>;

    (Object.keys(config) as TColumn[]).forEach((key) => {
      init[key] = config[key].defaultVisible;
    });

    return init;
  });

  const [columnWidthMap, setColumnWidthMap] = useState<
    Record<TColumn, number | undefined>
  >(() => {
    const init = {} as Record<TColumn, number | undefined>;
    (Object.keys(config) as TColumn[]).forEach((key) => {
      init[key] = config[key].width;
    });
    return init;
  });

  // visible columns list
  const visibleColumns = useMemo(() => {
    return (Object.keys(config) as TColumn[]).filter((key) => visibleMap[key]);
  }, [config, visibleMap]);

  // full column config but only visible ones
  const visibleColumnConfigs: VisibleColumnConfig<TColumn, TRow>[] =
    useMemo(() => {
      return visibleColumns.map((key) => {
        const { width: initWidth, ...rest } = config[key];
        return {
          key,
          ...rest,
          initWidth,
          width: columnWidthMap[key],
        };
      });
    }, [visibleColumns, config]);

  // set visible manually
  const setColumnVisible = useCallback((column: TColumn, visible: boolean) => {
    setVisibleMap((prev) => ({
      ...prev,
      [column]: visible,
    }));
  }, []);

  // reset về default
  const resetColumns = useCallback(() => {
    const reset = {} as VisibleState<TColumn>;

    (Object.keys(config) as TColumn[]).forEach((key) => {
      reset[key] = config[key].defaultVisible;
    });

    setVisibleMap(reset);
  }, [config]);

  const toggleColumn = useCallback((column: TColumn) => {
    setVisibleMap((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  }, []);

  const setColumnWidth = useCallback((column: TColumn, width: number) => {
    setColumnWidthMap((prev) => ({
      ...prev,
      [column]: width,
    }));
  }, []);

  return {
    config,
    visibleMap,
    visibleColumns,
    visibleColumnConfigs,

    toggleColumn,
    setColumnVisible,
    resetColumns,
    setColumnWidth,
  };
}
