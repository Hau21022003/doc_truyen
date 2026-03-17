import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

export const tableHeaderVariants = cva(
  "relative font-medium border-b border-muted-foreground/30 select-none bg-muted truncate",
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
export type TableHeaderVariantsProps = VariantProps<typeof tableHeaderVariants>;

export function TableHeaderCell({
  className = "",
  children,
  align = "left",
  size,
  ...props
}: Omit<React.HTMLProps<HTMLTableCellElement>, "size" | "align"> &
  TableHeaderVariantsProps) {
  return (
    <th
      className={cn(tableHeaderVariants({ size, align }), className)}
      {...props}
    >
      {children}
    </th>
  );
}
