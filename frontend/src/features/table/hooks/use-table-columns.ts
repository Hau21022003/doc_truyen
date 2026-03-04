import { useCallback, useMemo, useState } from "react";
import {
  ColumnStateMap,
  TableColumnConfigMap,
  TableColumnKey,
  TableColumnsState,
  VisibleColumnConfig,
} from "../table.types";

export function useTableColumns<TColumn extends TableColumnKey, TRow>(
  config: TableColumnConfigMap<TColumn, TRow>,
  initialState?: Record<TColumn, { visible?: boolean; width?: number }>,
): TableColumnsState<TColumn, TRow> {
  const [columns, setColumns] = useState<ColumnStateMap<TColumn, TRow>>(() => {
    const init = {} as ColumnStateMap<TColumn, TRow>;

    (Object.keys(config) as TColumn[]).forEach((key) => {
      const saved = initialState?.[key];

      init[key] = {
        visible: saved?.visible ?? config[key].defaultVisible,
        width: saved?.width ?? config[key].width,
        config: config[key],
      };
    });

    return init;
  });

  // ✅ derive visible column keys
  const visibleColumns = useMemo(() => {
    return (Object.keys(columns) as TColumn[]).filter(
      (key) => columns[key].visible,
    );
  }, [columns]);

  // ✅ derive full visible column config
  const visibleColumnConfigs: VisibleColumnConfig<TColumn, TRow>[] =
    useMemo(() => {
      return visibleColumns.map((key) => {
        const col = columns[key];
        const { width: initWidth, ...rest } = col.config;

        return {
          key,
          ...rest,
          initWidth,
          width: col.width,
        };
      });
    }, [visibleColumns, columns]);

  // ✅ actions

  const setColumnVisible = useCallback((column: TColumn, visible: boolean) => {
    setColumns((prev) => ({
      ...prev,
      [column]: {
        ...prev[column],
        visible,
      },
    }));
  }, []);

  const toggleColumn = useCallback((column: TColumn) => {
    setColumns((prev) => ({
      ...prev,
      [column]: {
        ...prev[column],
        visible: !prev[column].visible,
      },
    }));
  }, []);

  const setColumnWidth = useCallback((column: TColumn, width: number) => {
    setColumns((prev) => ({
      ...prev,
      [column]: {
        ...prev[column],
        width,
      },
    }));
  }, []);

  const resetColumns = useCallback(() => {
    setColumns(() => {
      const reset = {} as ColumnStateMap<TColumn, TRow>;

      (Object.keys(config) as TColumn[]).forEach((key) => {
        reset[key] = {
          visible: config[key].defaultVisible,
          width: config[key].width,
          config: config[key],
        };
      });

      return reset;
    });
  }, [config]);

  return {
    columns,
    visibleColumns,
    visibleColumnConfigs,

    toggleColumn,
    setColumnVisible,
    resetColumns,
    setColumnWidth,
  };
}
