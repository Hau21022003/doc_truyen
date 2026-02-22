import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export const tableVariants = cva("table w-auto min-w-full", {
  variants: {
    size: {
      sm: "text-sm",
      md: "",
      lg: "text-lg",
    },
    bordered: {
      true: "border border-border rounded-md",
      false: "border-0",
    },
    striped: {
      true: "[&>tbody>tr:nth-child(even)]:bg-muted/30",
      false: "",
    },
  },
  defaultVariants: {
    size: "sm",
    bordered: false,
    striped: false,
  },
});

export type TableVariantsProps = VariantProps<typeof tableVariants>;

export function Table({
  className = "",
  size,
  bordered,
  striped,
  children,
  ...props
}: React.HTMLProps<HTMLTableElement> & TableVariantsProps) {
  return (
    <table
      className={cn(tableVariants({ size, bordered, striped }), className)}
      {...props}
    >
      {children}
    </table>
  );
}
