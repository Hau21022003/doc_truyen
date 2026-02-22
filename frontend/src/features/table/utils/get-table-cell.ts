import { TableColumnKey, VisibleColumnConfig } from "../table.types";

/**
 * Interface cho các tham số của cell renderer
 * Sử dụng VisibleColumnConfig để đảm bảo type safety
 */
interface CellRendererParams<TRow, TColumn extends TableColumnKey> {
  /**
   * Dữ liệu của hàng để render
   */
  row: TRow;
  /**
   * Cấu hình cột đang hiển thị
   */
  columnConfig: VisibleColumnConfig<TColumn, TRow>;
}

/**
 * Utility function để render nội dung của table cell
 * Tuân thủ thứ tự ưu tiên: render > format > accessor
 */
export const getTableCell = <TRow, TColumn extends TableColumnKey>({
  row,
  columnConfig,
}: CellRendererParams<TRow, TColumn>): React.ReactNode => {
  // Ưu tiên 1: Sử dụng render function nếu có
  if (columnConfig.render) {
    return columnConfig.render(row);
  }

  // Lấy giá trị thô từ accessor nếu cần cho format
  const value = columnConfig.accessor
    ? columnConfig.accessor(row)
    : (row as any)[columnConfig.key];

  // Ưu tiên 2: Sử dụng format function nếu có
  if (columnConfig.format && value !== undefined) {
    return columnConfig.format(value);
  }

  // Ưu tiên 3: Sử dụng giá trị từ accessor nếu có
  if (value !== undefined) {
    return value;
  }

  // Fallback: Trả về chuỗi rỗng
  return "";
};
