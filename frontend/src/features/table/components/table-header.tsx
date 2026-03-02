import { ReactNode } from "react";

interface TableHeaderProps {
  className?: string;
  children?: ReactNode;
}
export function TableHeader({ className = "", children }: TableHeaderProps) {
  return (
    <thead className={`bg-card backdrop-blur-sm ${className}`}>
      {children}
    </thead>
  );
}
