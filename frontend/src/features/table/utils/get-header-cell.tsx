import { TableColumnKey, VisibleColumnConfig } from "../table.types";

/**
 * Interface cho các tham số của header renderer
 */
interface HeaderRendererParams<TColumn extends TableColumnKey, TRow> {
  /**
   * Cấu hình cột đang hiển thị
   */
  columnConfig: VisibleColumnConfig<TColumn, TRow>;
}

/**
 * Utility function để render nội dung của table header
 * Kiểm tra xem renderHeader có được định nghĩa trong config không, nếu không thì dùng label
 */
export const getHeaderCell = <TColumn extends TableColumnKey, TRow>({
  columnConfig,
}: HeaderRendererParams<TColumn, TRow>): React.ReactNode => {
  // Nếu có renderHeader tùy chỉnh, sử dụng nó
  if (columnConfig.renderHeader) {
    return columnConfig.renderHeader(columnConfig.key);
  }

  // Hiển thị label mặc định
  return <p className="truncate line-clamp-1">{columnConfig.label}</p>;
};
