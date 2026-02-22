"use client";
import {
  IconFirst,
  IconLast,
  IconNext,
  IconPrevious,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";

export const tablePaginationVariants = cva(
  "flex items-center flex-col gap-2 lg:flex-row lg:justify-between text-sm",
  {
    variants: {
      rounded: {
        sm: "rounded-tl-md rounded-tr-md",
        md: "rounded-tl-lg rounded-tr-lg",
        lg: "rounded-tl-xl rounded-tr-xl",
      },
    },
    defaultVariants: {
      rounded: "sm",
    },
  },
);
export type TablePaginationVariantsProps = VariantProps<
  typeof tablePaginationVariants
>;

// Interface cho props
interface TablePaginationProps {
  // State từ useTableState
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;

  // Thông tin dữ liệu
  totalCount: number;
  totalPages?: number;

  // Tùy chọn hiển thị
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  maxVisiblePages?: number; // Số trang tối đa hiển thị

  // Customização
  className?: string;
  disabled?: boolean;
}

export default function TablePagination({
  className = "",
  rounded,
  pageSizeOptions = [10, 20, 50],
  ...props
}: TablePaginationProps & TablePaginationVariantsProps) {
  const t = useTranslations("table.pagination");
  const totalPages =
    props.totalPages ?? Math.ceil(props.totalCount / props.pageSize);
  const startItem = (props.currentPage - 1) * props.pageSize + 1;
  const endItem = Math.min(
    props.currentPage * props.pageSize,
    props.totalCount,
  );

  const getVisiblePages = ({
    currentPage,
    totalPages,
    maxVisible = 5,
  }: {
    currentPage: number;
    totalPages: number;
    maxVisible?: number;
  }): number[] => {
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // Điều chỉnh khi gần đầu
    if (currentPage <= half) {
      end = Math.min(totalPages, maxVisible);
    }

    // Điều chỉnh khi gần cuối
    if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages({
    currentPage: props.currentPage,
    totalPages,
    maxVisible: props.maxVisiblePages,
  });

  return (
    <div
      className={cn(tablePaginationVariants({ rounded }), className)}
      // {...props}
    >
      {/* Left */}
      <div className="flex gap-3 items-center">
        <span className="text-muted-foreground">{t("itemsPerPage")}</span>
        <Select
          defaultValue={props.pageSize.toString()}
          onValueChange={(value) => props.setPageSize(Number(value))}
        >
          <SelectTrigger size="sm" className="px-1 py-1 h-8 w-13 gap-1">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <span className="text-muted-foreground">
          {startItem} - {endItem} {t("of")} {props.totalCount} {t("items")}
        </span>
      </div>
      {/* Right */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => props.setPage(1)}
          disabled={props.currentPage === 1}
          size={"icon"}
          variant={"outline"}
          className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
        >
          <IconFirst size="sm" color="custom" />
        </Button>
        <Button
          onClick={() => props.setPage(props.currentPage - 1)}
          disabled={props.currentPage === 1}
          size={"icon"}
          variant={"outline"}
          className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
        >
          <IconPrevious size="sm" color="custom" />
        </Button>
        {visiblePages.map((page, index) => (
          <button
            key={index}
            className={`size-9 rounded-md flex items-center justify-center ${
              page === props.currentPage
                ? "bg-primary-orange text-primary-orange-foreground border-primary-orange"
                : "hover:bg-muted hover:text-primary border border-muted rounded-md text-sm text-muted-foreground"
            }`}
            onClick={() => props.setPage(page)}
          >
            {page}
          </button>
        ))}
        <Button
          size={"icon"}
          variant={"outline"}
          className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
          onClick={() => props.setPage(props.currentPage + 1)}
          disabled={props.currentPage === totalPages}
        >
          <IconNext size="sm" color="custom" />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          className="hover:bg-muted hover:text-primary border-muted border text-muted-foreground"
          onClick={() => props.setPage(totalPages)}
          disabled={props.currentPage === totalPages}
        >
          <IconLast size="sm" color="custom" />
        </Button>
      </div>
    </div>
  );
}
