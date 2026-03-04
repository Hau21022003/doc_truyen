export type TableColumnKey = string;

export type TableColumnConfig<TRow> = {
  label: string;
  defaultVisible: boolean;
  width?: number;
  align?: "left" | "center" | "right";
  resizable?: boolean;
  sortable?: boolean;

  renderHeader?: (columnKey: TableColumnKey) => React.ReactNode;
  accessor?: (row: TRow) => any; // lấy raw value từ row
  format?: (value: any) => React.ReactNode; // format value đơn giản
  render?: (row: TRow) => React.ReactNode; // render full control (override everything)
};

/**
 * Map mỗi tên cột đến cấu hình của nó
 * Ví dụ: { id: { label: "ID", defaultVisible: true, width: 80 }, name: {...} }
 */
export type TableColumnConfigMap<TColumn extends TableColumnKey, TRow> = Record<
  TColumn,
  TableColumnConfig<TRow>
>;

/**
 * Map mỗi tên cột đến trạng thái hiển thị của nó
 * Ví dụ: { id: true, name: true, email: false }
 */
export type VisibleState<TColumn extends TableColumnKey> = Record<
  TColumn,
  boolean
>;

/**
 * Đại diện cho một cột đang hiển thị với cấu hình và dữ liệu runtime
 */
export type VisibleColumnConfig<
  TColumn extends TableColumnKey,
  TRow,
> = TableColumnConfig<TRow> & {
  key: TColumn; // Khóa định danh của cột
  initWidth?: number; // Chiều rộng ban đầu của cột (lưu lại giá trị từ config)
};

/**
 * Đại diện cho thông tin hiển thị của một cột
 */
export type ColumnVisibilityInfo<TRow> = {
  visible: boolean;
  config: TableColumnConfig<TRow>;
};

export type ColumnState<TRow> = {
  visible: boolean;
  width?: number;
  config: TableColumnConfig<TRow>;
};

export type ColumnStateMap<TColumn extends TableColumnKey, TRow> = Record<
  TColumn,
  ColumnState<TRow>
>;

/**
 * Type cho column management state (trả về từ useTableColumns)
 */
export type TableColumnsState<TColumn extends TableColumnKey, TRow> = {
  columns: ColumnStateMap<TColumn, TRow>;
  visibleColumns: TColumn[];
  visibleColumnConfigs: VisibleColumnConfig<TColumn, TRow>[];

  // config: TableColumnConfigMap<TColumn, TRow>;
  // visibleMap: VisibleState<TColumn>;
  // visibleMapWithConfig: Record<TColumn, ColumnVisibilityInfo<TRow>>;
  // visibleColumns: TColumn[];
  // visibleColumnConfigs: VisibleColumnConfig<TColumn, TRow>[];
  toggleColumn: (column: TColumn) => void;
  setColumnVisible: (column: TColumn, visible: boolean) => void;
  resetColumns: () => void;
  setColumnWidth: (column: TColumn, width: number) => void;
};

/**
 * Complete type cho return value của useTableState
 */
export type TableState<
  TColumn extends TableColumnKey,
  TRow,
> = TableColumnsState<TColumn, TRow> & {
  sort: {
    column: TColumn | null;
    direction: "asc" | "desc";
    setSort: React.Dispatch<
      React.SetStateAction<{
        column: TColumn | null;
        direction: "asc" | "desc";
      }>
    >;
    toggleSort: (column: TColumn) => void;
  }; // Khi enable sorting
  pagination: {
    page: number;
    pageSize: number;
    setPagination: React.Dispatch<
      React.SetStateAction<{
        page: number;
        pageSize: number;
      }>
    >;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
  };
};
