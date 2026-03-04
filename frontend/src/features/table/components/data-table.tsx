import {
  IconArrowDown,
  IconArrowUp,
  IconChevronSort,
} from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { TableColumnKey, TableState } from "../table.types";
import { getHeaderCell, getTableCell } from "../utils";
import { ErrorTable } from "./error-table";
import { ResizeHandle } from "./resize-handle";
import { Table } from "./table";
import { TableBody } from "./table-body";
import { TableCell } from "./table-cell";
import { TableContainer } from "./table-container";
import { TableHeader } from "./table-header";
import { TableHeaderCell } from "./table-header-cell";
import TableHeaderSeparator from "./table-header-separator";
import TablePagination from "./table-pagination";
import { TableRow } from "./table-row";

export type ExtraColumnConfig<TRow> = {
  key: string; // Unique key cho extra column
  width?: number;
  align?: "left" | "center" | "right";
  resizable?: boolean;
  // Không có defaultVisible, luôn hiển thị

  // Render function bắt buộc vì không có data mapping
  render: (row: TRow, rowIndex: number) => React.ReactNode;

  // Optional header label, mặc định là rỗng
  label?: string;

  // Render tùy chọn cho header
  renderHeader?: () => React.ReactNode;

  // Optional styling
  className?: string;
  sticky?: "left" | "right"; // For fixed columns
};

interface DataTableProps<TColumn extends TableColumnKey, TRow> {
  data: TRow[];
  totalCount: number;

  tableState: TableState<TColumn, TRow>;

  extraColumns?: ExtraColumnConfig<TRow>[];

  isLoading?: boolean;
  className?: string;
  error?: any;
  onErrorRetry?: () => void;
}

export function calculateStickyOffsets<TRow>(
  columns: ExtraColumnConfig<TRow>[],
) {
  const leftOffsets: Record<string, number> = {};
  const rightOffsets: Record<string, number> = {};
  let leftOffset = 0;
  let rightOffset = 0;

  // Calculate left offsets
  columns
    .filter((col) => col.sticky === "left")
    .forEach((col) => {
      leftOffsets[col.key] = leftOffset;
      leftOffset += col.width || 60;
    });

  // Calculate right offsets (need to reverse)
  [...columns]
    .reverse()
    .filter((col) => col.sticky === "right")
    .forEach((col) => {
      rightOffsets[col.key] = rightOffset;
      rightOffset += col.width || 60;
    });

  return { leftOffsets, rightOffsets };
}

export function DataTable<TColumn extends TableColumnKey, TRow>({
  data,
  totalCount,
  tableState,
  className,
  extraColumns = [],
  isLoading,
  error,
  onErrorRetry,
}: DataTableProps<TColumn, TRow>) {
  // const leftExtraColumns = extraColumns.filter((col) => col.sticky === "left");
  // const rightExtraColumns = extraColumns.filter(
  //   (col) => col.sticky === "right",
  // );
  // const normalExtraColumns = extraColumns.filter((col) => !col.sticky);
  const {
    leftSticky: leftExtraColumns,
    rightSticky: rightExtraColumns,
    normal: normalExtraColumns,
  } = useMemo(
    () => ({
      leftSticky: extraColumns.filter((col) => col.sticky === "left"),
      rightSticky: extraColumns.filter((col) => col.sticky === "right"),
      normal: extraColumns.filter((col) => !col.sticky),
    }),
    [extraColumns],
  );

  const { leftOffsets: leftStickyOffsets, rightOffsets: rightStickyOffsets } =
    calculateStickyOffsets(extraColumns);

  // const leftStickyOffsets: Record<string, number> = {};
  // const rightStickyOffsets: Record<string, number> = {};

  // let leftOffset = 0;
  // let rightOffset = 0;

  // // LEFT sticky
  // extraColumns
  //   .filter((col) => col.sticky === "left")
  //   .forEach((col) => {
  //     leftStickyOffsets[col.key] = leftOffset;
  //     leftOffset += col.width || 60;
  //   });

  // // RIGHT sticky (phải đảo ngược)
  // [...extraColumns]
  //   .reverse()
  //   .filter((col) => col.sticky === "right")
  //   .forEach((col) => {
  //     rightStickyOffsets[col.key] = rightOffset;
  //     rightOffset += col.width || 60;
  //   });
  if (error) {
    return (
      <ErrorTable error={error} onRetry={onErrorRetry} className={className} />
    );
  }
  return (
    <div
      className={cn(
        "border-muted-foreground/30 border rounded-md overflow-hidden",
        className,
      )}
    >
      <TableContainer className="max-h-[600px]">
        <Table style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <TableHeader className="sticky top-0 z-30">
            <TableRow>
              {/* Left sticky extra columns FIRST */}
              {leftExtraColumns.map((column) => (
                <TableHeaderCell
                  key={`extra-${column.key}`}
                  align={column.align}
                  className={cn(column.className, "border-r")}
                  style={{
                    width: column.width,
                    minWidth: column.width || 60,
                    position: "sticky",
                    left: leftStickyOffsets[column.key],
                    top: 0,
                    zIndex: 30,
                  }}
                >
                  {column.renderHeader ? column.renderHeader() : column.label}
                </TableHeaderCell>
              ))}

              {/* Regular columns */}
              {tableState.visibleColumnConfigs.map((column) => (
                <TableHeaderCell
                  data-resizable
                  key={column.key}
                  style={{
                    width: column.width,
                    minWidth: column.width || 60,
                    maxWidth: column.width,
                  }}
                  align={column.align}
                >
                  <div className="flex items-center gap-1">
                    {getHeaderCell({ columnConfig: column })}
                    {column.sortable && (
                      <div
                        onClick={() => tableState.sort.toggleSort(column.key)}
                        className="[&_svg:not([class*='size-'])]:size-5 cursor-pointer text-muted-foreground hover:text-primary"
                      >
                        {tableState.sort.column !== column.key && (
                          <IconChevronSort color="custom" />
                        )}
                        {column.key === tableState.sort.column &&
                          tableState.sort.direction === "asc" && (
                            <IconArrowDown color="custom" />
                          )}
                        {column.key === tableState.sort.column &&
                          tableState.sort.direction === "desc" && (
                            <IconArrowUp color="custom" />
                          )}
                      </div>
                    )}
                  </div>
                  {column.resizable ? (
                    <ResizeHandle
                      onResize={(width) => {
                        tableState.setColumnWidth(column.key, width);
                      }}
                    />
                  ) : (
                    <TableHeaderSeparator />
                  )}
                </TableHeaderCell>
              ))}

              {/* Normal extra columns */}
              {normalExtraColumns.map((column) => (
                <TableHeaderCell
                  key={`extra-${column.key}`}
                  align={column.align}
                  className={column.className}
                  style={{
                    width: column.width,
                    minWidth: column.width || 60,
                  }}
                >
                  {column.renderHeader ? column.renderHeader() : column.label}
                </TableHeaderCell>
              ))}

              {/* Right sticky extra columns LAST */}
              {rightExtraColumns.map((column) => (
                <TableHeaderCell
                  key={`extra-${column.key}`}
                  align={column.align}
                  className={cn(column.className, "border-l")}
                  style={{
                    width: column.width,
                    minWidth: column.width || 60,
                    position: "sticky",
                    top: 0,
                    right: rightStickyOffsets[column.key],
                    zIndex: 30,
                  }}
                >
                  {column.renderHeader ? column.renderHeader() : column.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading table */}
            {isLoading &&
              // Hiển thị skeleton rows khi loading
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {/* Left sticky extra columns skeleton */}
                  {leftExtraColumns.map((column) => (
                    <TableCell
                      key={`skeleton-extra-left-${column.key}-${index}`}
                      align={column.align}
                      className={cn(column.className, "border-r")}
                      style={{
                        position: "sticky",
                        left: leftStickyOffsets[column.key],
                        zIndex: 20,
                      }}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}

                  {/* Regular columns skeleton */}
                  {tableState.visibleColumnConfigs.map((column) => (
                    <TableCell
                      key={`skeleton-${column.key}-${index}`}
                      align={column.align}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}

                  {/* Normal extra columns skeleton */}
                  {normalExtraColumns.map((column) => (
                    <TableCell
                      key={`skeleton-extra-${column.key}-${index}`}
                      align={column.align}
                      className={column.className}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}

                  {/* Right sticky extra columns skeleton */}
                  {rightExtraColumns.map((column) => (
                    <TableCell
                      key={`skeleton-extra-right-${column.key}-${index}`}
                      align={column.align}
                      className={cn(column.className, "border-l")}
                      style={{
                        position: "sticky",
                        right: rightStickyOffsets[column.key],
                        zIndex: 20,
                      }}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Data Table */}
            {!isLoading &&
              data.map((row, index) => (
                <TableRow key={`${row?.toString()}-${index}`}>
                  {/* Left sticky extra cells FIRST */}
                  {leftExtraColumns.map((column) => (
                    <TableCell
                      key={`extra-cell-${column.key}`}
                      align={column.align}
                      className={cn(
                        column.className,
                        "bg-background border-r ",
                      )}
                      style={{
                        position: "sticky",
                        left: leftStickyOffsets[column.key],
                        zIndex: 20,
                      }}
                    >
                      {column.render(row, index)}
                    </TableCell>
                  ))}

                  {/* Regular cells */}
                  {tableState.visibleColumnConfigs.map((column) => (
                    <TableCell key={column.key} align={column.align}>
                      {getTableCell({
                        row,
                        columnConfig: column,
                      })}
                    </TableCell>
                  ))}

                  {/* Normal extra cells */}
                  {normalExtraColumns.map((column) => (
                    <TableCell
                      key={`extra-cell-${column.key}`}
                      align={column.align}
                      className={column.className}
                    >
                      {column.render(row, index)}
                    </TableCell>
                  ))}

                  {/* Right sticky extra cells LAST */}
                  {rightExtraColumns.map((column) => (
                    <TableCell
                      key={`extra-cell-${column.key}`}
                      align={column.align}
                      className={cn(column.className, "bg-background border-l")}
                      style={{
                        position: "sticky",
                        right: rightStickyOffsets[column.key],
                        zIndex: 20,
                      }}
                    >
                      {column.render(row, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        className="px-4 py-2"
        currentPage={tableState.pagination.page}
        pageSize={tableState.pagination.pageSize}
        setPage={tableState.pagination.setPage}
        setPageSize={tableState.pagination.setPageSize}
        totalCount={totalCount}
      />
    </div>
  );
}
