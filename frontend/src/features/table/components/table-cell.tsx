import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export const tableCellVariants = cva(
  "table-cell border-muted-foreground/30 border-b",
  {
    variants: {
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      size: "md",
      align: "left",
    },
  },
);
export type TableCellVariantsProps = VariantProps<typeof tableCellVariants>;

export function TableCell({
  className = "",
  children,
  align = "left",
  size,
  width,
  ...props
}: Omit<React.HTMLProps<HTMLTableCellElement>, "size" | "align"> &
  TableCellVariantsProps) {
  return (
    <td
      className={cn(tableCellVariants({ size, align }), className)}
      style={{ width }}
      {...props}
    >
      {children}
    </td>
  );
}
