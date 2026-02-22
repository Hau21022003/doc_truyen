import { cn } from "@/lib/utils";
import React from "react";

export function TableContainer({
  children,
  className = "",
  ...props
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={cn("overflow-auto text-sm w-full", className)} {...props}>
      {children}
    </div>
  );
}
